const prompts = require('@clack/prompts')
const chalk = require('chalk')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const cckPackage = require('../package.json')


// 打包控件
module.exports = async (inputFilePath) => {

    prompts.intro(chalk.blue.bold('CoCoKit') + chalk.gray('  v'+cckPackage.version))

    const load = prompts.spinner()
    load.start('正在打包..')


    // 读取 webpack 配置文件
    const webpackConfigPath = path.resolve(process.cwd(), 'webpack.config.js')
    if (!fs.existsSync(webpackConfigPath)) {
        load.stop('已停止打包')
        prompts.outro(chalk.red('未找到 webpack.config.js 配置文件'))
        return process.exit(1)
    }
    const webpackConfig = require(webpackConfigPath)


    // 读取 package.json 配置文件
    const widgetPackageJsonPath = path.resolve(process.cwd(), 'package.json')
    if (!fs.existsSync(widgetPackageJsonPath)) {
        load.stop('已停止打包')
        prompts.outro(chalk.red('未找到 package.json 配置文件'))
        return process.exit(1)
    }
    const widgetPackageJson = require(widgetPackageJsonPath)


    // 获取完整的文件路径
    let fullFilePath = path.resolve(process.cwd(), inputFilePath)
    if (!fs.existsSync(fullFilePath)) {
        load.stop('已停止打包')
        prompts.outro(chalk.red(`未找到文件 [${inputFilePath}]`))
        return process.exit(1)
    }


    // 读取文件
    let widgetFiles = []
    if (fs.statSync(fullFilePath).isDirectory()) {
        fs.readdirSync(fullFilePath).forEach(file => {
            if (path.extname(file) === '.jsx') {
                widgetFiles.push(path.resolve(fullFilePath, file))
            }
        })
    } 
    else if (path.extname(fullFilePath) === '.jsx') {
        widgetFiles = [fullFilePath]
    } 
    else {
        load.stop('已停止打包')
        prompts.outro(chalk.red(`文件 [${inputFilePath}] 不是 jsx 文件`))
        return process.exit(1)
    }


    // 开始打包
    let widgetCount = 0
    const startTime = Date.now()

    // 记录每个控件的构建输出
    const buildOutputs = []
    
    const buildPromises = widgetFiles.map(widgetFilePath => {
        return new Promise((resolve, reject) => {
            // 读取控件版本号
            const versionMatch = fs.readFileSync(widgetFilePath, 'utf8').match(/version\s*:\s*['"]([^'"]+)['"]/)
            const widgetVersion = versionMatch?.[1] ?? ''

            // 构建输出的文件名
            const prefixText = widgetPackageJson?.build_config?.前缀标签 || ''
            const addVersion = widgetPackageJson?.build_config?.加版本号 || false
            const widgetFileName = `${prefixText ? prefixText+'_' : ''}${path.basename(widgetFilePath, '.jsx')}`
            const outputFileName = `${widgetFileName}${addVersion ? `_${widgetVersion}` : ''}.js`

            // 更新 Webpack 配置
            webpackConfig.entry = widgetFilePath
            webpackConfig.output.filename = outputFileName
            const widgetDirName = path.dirname(widgetFilePath)
            const folderName = path.basename(widgetDirName)
            const outputDirPath = path.join(widgetDirName, '..', folderName + '_打包')
            webpackConfig.output.path = outputDirPath

            // 运行 Webpack
            webpack(webpackConfig, (err, stats) => {
                if (err || stats.hasErrors()) {
                    reject({ 
                        widget: widgetFileName, 
                        msg: err || stats.toJson().errors 
                    })
                    return
                }
                // 获取输出路径
                const outputFilePath = path.join(webpackConfig.output.path, outputFileName)
                const relativePath = path.relative(process.cwd(), outputFilePath)
                // 获取文件大小
                const statsJson = stats.toJson()
                const fileSize = (statsJson.assets[0].size / 1024).toFixed(2)
                // 计算输出文件路径的长度，用来对齐文本
                const maxFilePathLength = Math.max(...widgetFiles.map(file => {
                    const versionLength = addVersion ? widgetVersion.length + 1 : 0;
                    return path.relative(process.cwd(), path.join(webpackConfig.output.path, path.basename(file, '.jsx') + '.js')).length + versionLength + prefixText.length
                }))
                // 记录构建信息
                buildOutputs.push({
                    path: relativePath,
                    maxLength: maxFilePathLength,
                    version: widgetVersion,
                    fileSize: fileSize
                })
                widgetCount++
                resolve()
            })
        })
    })


    // 执行打包任务
    Promise.all(buildPromises)
    .then(() => {
        load.stop('打包完成! (/≧▽≦)/')

        // 输出构建信息
        console.log(chalk.gray('│'))
        buildOutputs.forEach(({ path, maxLength, version, fileSize }) => { 
            console.log(chalk.gray('│  ') + chalk.bold(path.padEnd(maxLength)) + chalk.cyan(`\tv${version}\t`) + chalk.gray(`${fileSize} kB`))
        })

        // 输出打包信息
        const duration = ((Date.now() - startTime) / 1000).toFixed(2)
        prompts.outro(chalk.green(`共打包 ${widgetCount} 个控件  `) + chalk.gray(`耗时 ${duration}s`))
    })
    .catch(error => {
        load.stop('打包出错啦')
        prompts.outro(chalk.red(`控件 [${error.widget}] 打包失败`))
        
        // 输出错误信息
        if (Array.isArray(error.msg)) {
            error.msg.forEach(msg => console.error(msg.message))
        } else {
            console.error(error.msg)
        }
        console.log()
    })
}