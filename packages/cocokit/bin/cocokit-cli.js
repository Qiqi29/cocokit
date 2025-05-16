#! /usr/bin/env node
const { program } = require('commander')
const build = require('./build.js')


// 命令行工具信息
program.name('cocokit')
.description('CoCoKit 命令行工具')
.version('0.1.0')


// 命令：打包控件
program.command('build')
.description('打包指定控件/文件夹内的控件')
.argument('<file>', '要打包的文件路径')
.action((filePath) => {
    build(filePath)
})


// 解析命令行参数
program.parse(process.argv)