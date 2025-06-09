const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')
const fs = require('fs')


/**
 * @typedef {Object} BuildConfig
 * @property {string} prefixText
 * @property {boolean} addVersion
 */


/**
 * 加载 package.json 中的配置
 *
 * @returns {BuildConfig}
 */
function loadBuildConfig() {
    // 读取 package.json 配置文件
    const widgetPackageJsonPath = path.resolve(process.cwd(), 'package.json')
    if (!fs.existsSync(widgetPackageJsonPath)) {
        throw new Error('未找到 package.json 配置文件')
    }
    const widgetPackageJson = require(widgetPackageJsonPath)
    return {
        prefixText: widgetPackageJson?.build_config?.前缀标签 || '',
        addVersion: widgetPackageJson?.build_config?.加版本号 || false
    }
}


/**
 * 获取输出文件夹路径
 *
 * @param {string} inputPath
 * @returns {string}
 */
function getOutputDirPath(inputPath) {

    if (!fs.existsSync(inputPath)) {
        throw new Error(`未找到文件 [${inputPath}]`)
    }


    /** @type {string} */
    let widgetDirName
    if ((fs.statSync(inputPath)).isDirectory()) {
        widgetDirName = inputPath
    }
    else if (path.extname(inputPath) === '.jsx') {
        widgetDirName = path.dirname(inputPath)
    }
    else {
        throw new Error(`文件 [${inputPath}] 不是 jsx 文件`)
    }


    const folderName = path.basename(widgetDirName)
    const outputDirPath = path.join(widgetDirName, '..', folderName + '_打包')

    return outputDirPath
}


/**
 * 获取所有需要打包的控件的入口文件路径和输出文件夹路径
 *
 * @param {string} inputPath
 * @returns {string[]}
 */
function getWidgetEntryFiles(inputPath) {


    if (!fs.existsSync(inputPath)) {
        throw new Error(`未找到文件 [${inputPath}]`)
    }


    /** @type {string[]} */
    const widgetEntryFiles = []
    if ((fs.statSync(inputPath)).isDirectory()) {
        fs.readdirSync(inputPath).forEach(filePath => {
            if (path.extname(filePath) === '.jsx') {
                widgetEntryFiles.push(path.resolve(inputPath, filePath))
            }
        })
    }
    else if (path.extname(inputPath) === '.jsx') {
        widgetEntryFiles.push(inputPath)
    }
    else {
        throw new Error(`文件 [${inputPath}] 不是 jsx 文件`)
    }


    return widgetEntryFiles
}


/**
 * @typedef {Object} WidgetToBeBuild
 * @property {string} entry
 * @property {string} outputFileName
 * @property {string} version
 */


/**
 * 解析控件构建信息。
 *
 * @param {string} widgetEntryFilePath
 * @returns {WidgetToBeBuild}
 */
function resolveWidgetToBeBuild(widgetEntryFilePath, buildConfig) {

    // 读取控件版本号
    const versionMatch = fs.readFileSync(widgetEntryFilePath, 'utf8').match(/version\s*:\s*['"]([^'"]+)['"]/)
    const widgetVersion = versionMatch?.[1] ?? ''


    // 构建输出的文件名
    const { prefixText, addVersion } = buildConfig
    const widgetFileName = `${prefixText ? prefixText+'_' : ''}${path.basename(widgetEntryFilePath, '.jsx')}`
    const outputFileName = `${widgetFileName}${addVersion ? `_${widgetVersion}` : ''}.js`


    return {
        entry: widgetEntryFilePath,
        outputFileName,
        version: widgetVersion
    }
}

/**
 * @typedef {Object} BuildOutput
 * @property {string} path
 * @property {string} version
 * @property {string} fileSize 以 kb 为单位的文件大小
 */


/**
 * @typedef {Object} BuildStats
 * @property {unknown} [errors]
 * @property {string} [time] 以秒为单位的打包耗时
 * @property {number} [maxLength]
 * @property {BuildOutput[]} [outputs]
 */


/**
 * @typedef {Object} Options
 * @property {boolean} [serve]
 * @property {boolean} [watch]
 * @property {(server: WebpackDevServer) => void} [onServerCreate]
 * @property {() => void} [onBuildStart]
 * @property {(stats?: BuildStats) => void} [onBuildFinish]
 */


/**
 * @param {string} inputPath
 * @param {Options} [options]
 */
module.exports = function build(inputPath, options) {

    inputPath = path.resolve(process.cwd(), inputPath)

    // 读取 webpack 配置文件
    const webpackConfigPath = path.resolve(process.cwd(), 'webpack.config.js')
    if (!fs.existsSync(webpackConfigPath)) {
        throw new Error('未找到 webpack.config.js 配置文件')
    }
    /** @type {webpack.Configuration} */
    const webpackConfig = require(webpackConfigPath)


    /** @type {BuildConfig} */
    const buildConfig = loadBuildConfig()


    const outputDirPath = getOutputDirPath(inputPath)


    /** @type {Record<string, WidgetToBeBuild>} */
    let outputFilenameToWidgetToBeBuildMap = {}
    let maxFilePathLength = 0


    // 动态设置入口文件，可以随时添加新的入口文件而无需重启 webpack
    webpackConfig.entry = () => {
        /** @type {webpack.Entry} */
        const entry = {}
        outputFilenameToWidgetToBeBuildMap = {}
        const widgetEntryFiles = getWidgetEntryFiles(inputPath)
        const widgetsToBeBuild = widgetEntryFiles.map(widgetEntryFile => {
            return resolveWidgetToBeBuild(widgetEntryFile, buildConfig)
        })
        widgetsToBeBuild.forEach(widgetToBeBuild => {
            outputFilenameToWidgetToBeBuildMap[widgetToBeBuild.outputFileName] = widgetToBeBuild
            entry[widgetToBeBuild.outputFileName] = widgetToBeBuild.entry
        })
        maxFilePathLength = Math.max(...widgetsToBeBuild.map(file => {
            const versionLength = buildConfig.addVersion ? file.version.length + 1 : 0;
            return path.relative(process.cwd(), path.join(outputDirPath, path.basename(file.outputFileName, '.jsx') + '.js')).length + versionLength + buildConfig.prefixText.length
        }))
        return entry
    }


    webpackConfig.output ??= {}
    webpackConfig.output.filename = "[name]"
    webpackConfig.output.path = outputDirPath


    webpackConfig.plugins ??= []
    // 检测打包开始。在监视和服务模式下，每次重新打包都会触发。
    webpackConfig.plugins.push({
        /**
         * @param {webpack.Compiler} compiler
         */
        apply(compiler) {
            compiler.hooks.make.tap('CoCoKit', () => {
                options?.onBuildStart?.()
            })
        }
    })


    /**
     * Webpack 完成时回调
     *
     * @param {null | Error} err
     * @param {webpack.Stats} [stats]
     */
    function onWebpackFinish(err, stats) {
        if (err || stats?.hasErrors()) {
            const error = err || stats?.toJson().errors
            if (Array.isArray(error)) {
                error.forEach(msg => console.error(msg.message))
            } else {
                console.error(error)
            }
            options?.onBuildFinish?.({ errors: error })
            return
        }
        if (!stats) {
            options?.onBuildFinish?.()
            return
        }
        const statsJson = stats.toJson()
        if (!statsJson.assets) {
            options?.onBuildFinish?.({ time: ((statsJson.time ?? 0) / 1000).toFixed(2) })
            return
        }
        /** @type {BuildOutput[]} */
        const buildOutputs = []
        /** @type {BuildStats} */
        const buildStats = {
            time: ((statsJson.time ?? 0) / 1000).toFixed(2),
            maxLength: maxFilePathLength,
            outputs: buildOutputs
        }
        statsJson.assets.forEach(asset => {
            const outputFilePath = path.join(outputDirPath, asset.name)
            const relativePath = path.relative(process.cwd(), outputFilePath)
            const version = outputFilenameToWidgetToBeBuildMap[asset.name].version
            const fileSize = (asset.size / 1024).toFixed(2)
            buildOutputs.push({
                path: relativePath,
                version: version,
                fileSize
            })
        })
        options?.onBuildFinish?.(buildStats)
    }

    let compiler = webpack(webpackConfig)

    if (options?.serve) {
        compiler.hooks.done.tap('CoCoKit', (stats) => {
            onWebpackFinish(null, stats)
        })
        const server = new WebpackDevServer(webpackConfig.devServer, compiler)
        options?.onServerCreate?.(server)
        server.start()

        let needForceShutdown = false
        ;['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, () => {
                if (needForceShutdown) {
                    console.log('已强制关闭开发服务')
                    process.exit(0)
                }

                needForceShutdown = true

                server.stop()
            })
        })
    } else if (options?.watch) {
        const watching = compiler.watch({}, onWebpackFinish)

        let needForceShutdown = false
        ;['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, () => {
                if (needForceShutdown) {
                    console.log('已强制退出监视')
                    process.exit(0)
                }

                needForceShutdown = true

                watching.close(() => {})
            })
        })
    } else {
        compiler.run(onWebpackFinish)
    }
}