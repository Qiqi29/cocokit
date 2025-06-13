#! /usr/bin/env node
const { program } = require('commander')
const chalk = require('chalk')

const cckPackage = require('../package.json')
const build = require('./build')
const watch = require('./watch')
const serve = require('./serve')


// 信息
program.name('cocokit')
.description(chalk.blue.bold('CoCoKit 命令行工具'))
.version(cckPackage.version)


// 命令：打包控件
program.command('build')
.description('打包指定控件 / 打包文件夹中的控件')
.argument('<file>', '要打包的文件路径')
.action((filePath) => {
    build(filePath)
})


// 命令：监听控件
program.command('watch')
.description('监听控件 / 文件夹中的控件变化，自动打包')
.argument('<file>', '要打包的文件路径')
.action((filePath) => {
    watch(filePath)
})


// 命令：打开开发服务
program.command('serve')
.description('打开开发服务，配合控件自动重载控件可以实现自动导入控件、刷新编辑器')
.argument('<file>', '要打包的文件路径')
.action((filePath) => {
    serve(filePath)
})


// 解析命令行参数
program.parse(process.argv)