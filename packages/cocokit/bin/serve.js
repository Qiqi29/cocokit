const prompts = require('@clack/prompts')
const chalk = require('chalk')
const cckPackage = require('../package.json')
const build = require('./build-tool')

// 打包控件
module.exports = async (inputPath) => {

    prompts.intro(chalk.blue.bold('CoCoKit') + chalk.gray('  v'+cckPackage.version))

    const load = prompts.spinner()

    try {
        build(inputPath, {
            serve: true,
            onServerCreate(server) {
                server.logger.info = (...args) => {
                    const message = args.join(" ")
                    const matchResult = message.match(/Loopback:([\s]|(\x1B.*?m))*(https?:\/\/.*?\/)/i)
                    if (matchResult) {
                        const devServerAddress = matchResult.slice(-1)[0]
                        prompts.log.info(`开发服务已启动于：${chalk.bold.green(devServerAddress)}`)
                        prompts.log.info(`你可以访问 ${chalk.bold.green(devServerAddress + "webpack-dev-server")} 来查看输出文件`)
                        console.log(chalk.gray('│'))
                    }
                }
            },
            onBuildStart() {
                load.start('正在打包..')
            },
            onBuildFinish(stats) {
                if (!stats) {
                    return
                }
                if (stats.errors) {
                    load.stop('打包出错啦')
                    // 输出错误信息
                    if (Array.isArray(stats.errors)) {
                        stats.errors.forEach(msg => console.error(msg.message))
                    } else {
                        console.error(stats.errors)
                    }
                }
                if (!stats.outputs) {
                    return
                }
                load.stop('打包完成! (/≧▽≦)/')
                // 关闭原始模式。spinner 会开启原始模式导致 Ctrl + C 失效。关闭原始模式以重新启用 Ctrl + C。
                process.stdin.setRawMode(false)
                console.log(chalk.gray('│'))
                stats.outputs.forEach(({ path, version, fileSize }) => {
                    console.log(chalk.gray('│  ') + chalk.bold(path.padEnd(stats.maxLength ?? 0)) + chalk.cyan(`\tv${version}\t`) + chalk.gray(`${fileSize} kB`))
                })
                prompts.log.info(chalk.green(`共打包 ${stats.outputs.length} 个控件  `) + chalk.gray(`耗时 ${stats.time}s`))
            }
        })

        ;['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, () => {
                prompts.outro('已关闭开发服务')
            })
        })
    } catch (error) {
        load.stop('已停止打包')
        prompts.outro(chalk.red(error.message))
        return process.exit(1)
    }
}