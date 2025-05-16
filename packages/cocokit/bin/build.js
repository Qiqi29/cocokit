const prompts = require('@clack/prompts')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const packageJson = require('../package.json')


// 颜色代码
const color = {
    reset: '\x1b[0m',   // 重置颜色
    bold: '\x1b[1m',    // 粗体
    gray: '\x1b[90m',   // 灰色
    red: '\x1b[31m',    // 红色
    yellow: '\x1b[33m', // 黄色
    green: '\x1b[32m',  // 绿色
    cyan: '\x1b[36m',   // 青色
    blue: '\x1b[34m',   // 蓝色
}


module.exports = async (filePath) => {
    
    prompts.intro(`${color.blue}${color.bold}CoCoKit v${packageJson.version}${color.reset}`)

    // 获取 webpack 配置文件
    let webpackConfig
    try {
        const webpackConfigPath = path.resolve(process.cwd(), 'webpack.config.js')
        webpackConfig = require(webpackConfigPath)
    } catch (error) {
        console.log(error)
        prompts.cancel("读取 webpack.config.js 配置文件出错")
        return process.exit(0)
    }

    // 获取控件 package.json 配置文件
    let widgetPackageJson
    try {
        const widgetPackageJsonPath = path.resolve(process.cwd(), 'package.json')
        widgetPackageJson = require(widgetPackageJsonPath)
    } catch (error) {
        console.log(error)
        prompts.cancel("读取 package.json 配置文件出错")
        return process.exit(0)
    }


    // 获取控件路径
    let widgetPath
    try {
        widgetPath = path.resolve(process.cwd(), filePath)
        fs.statSync(widgetPath)
    } catch (error) {
        console.log(error)
        prompts.cancel("没有找到控件文件，请检查路径是否正确")
        return process.exit(0)
    }


    // 读取控件文件
    let widgetFiles = []
    if (fs.statSync(widgetPath).isDirectory()) {
        const files = fs.readdirSync(widgetPath)
        files.forEach(file => {
            if (path.extname(file) === '.jsx') {
                widgetFiles.push(path.join(widgetPath, file))
            }
        })
    } else if (path.extname(widgetPath) === '.jsx') {
        widgetFiles.push(widgetPath)
    } else {
        prompts.cancel('提供的路径不是 jsx 文件')
        return process.exit(0)
    }


    // 开始打包
    let widgetCount = 0
    const startTime = Date.now()
    const load = prompts.spinner()
    load.start(`正在打包控件`)


    // 使用 Promise 创建打包任务
    const buildPromises = widgetFiles.map(widgetFilePath => {
        return new Promise((resolve, reject) => {
            // 读取控件版本号
            const widgetFileContent = fs.readFileSync(widgetFilePath, 'utf8')
            const versionMatch = widgetFileContent.match(/version\s*:\s*['"]([^'"]+)['"]/)
            const widgetVersion = versionMatch ? versionMatch[1] : ''

            // 构建文件名
            const prefixText = widgetPackageJson.build_config['前缀标签'] || ''
            const addVersion = widgetPackageJson.build_config['加版本号'] || false
            const widgetFileName = prefixText + '_' + path.basename(widgetFilePath, '.jsx')
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
                    if (err) {
                        reject({ widget: widgetFileName, info: err })
                    } else {
                        reject({ widget: widgetFileName, info: stats.toJson().errors })
                    }
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

    // 记录构建信息
    const buildOutputs = []

    // 执行打包任务
    Promise.all(buildPromises)
    .then(() => {
        load.stop(`打包完成！`)

        // 输出所有构建信息
        console.log(`${color.gray}│${color.reset}`)
        buildOutputs.forEach(({ path, maxLength, version, fileSize }) => { 
            console.log(`${color.gray}│${color.reset}  ${color.bold}${path.padEnd(maxLength)} ${color.reset}\t${color.cyan}v${version}\t${color.gray}${fileSize} kB${color.reset}`)
        })

        // 输出打包信息
        const duration = ((Date.now() - startTime) / 1000).toFixed(2)
        prompts.outro(`${color.green}共打包 ${widgetCount} 个控件 ${color.gray}耗时 ${duration}s${color.reset}`)
    })
    .catch(error => {
        load.stop('已停止打包')
        prompts.outro(`${color.red}控件 [${error.widget}] 打包失败${color.reset}`)
        
        if (Array.isArray(error.info)) {
            error.info.forEach(info => {
                console.error(info.message)
            })
        } else {
            console.error(error.info)
        }
        console.log()
    })
}