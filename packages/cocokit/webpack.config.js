/**
 * Webpack 打包配置
 * 此处用来测试打包程序，可同步更新到 create-cocokit 模板中
 */

const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')


// 导出 webpack 配置
module.exports = {
    entry: './widget.jsx',
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, '_build'),
    },
    devServer: {
        // 没有静态文件
        static: false,
        devMiddleware: {
            // 关闭终端日志
            stats: 'none'
        },
        // 允许从 CoCo 和 CP 访问开发服务
        allowedHosts: [
            "coco.codemao.cn",
            "cp.cocotais.cn"
        ],
        // 允许跨域请求
        headers(incomingMessage) {
            /** @type {{ rawHeaders: string[] }} */
            const {rawHeaders} = incomingMessage
            const origin = rawHeaders[rawHeaders.findIndex((value) => {
                return /origin/i.test(value)
            }) + 1]
            return {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET"
            }
        },
        // 关闭模块热替换
        hot: false,
        // 关闭 Live Reload，防止其与控件实时重载控件冲突
        liveReload: false
    },
    plugins: [
        // 防止全局 this 指向 undefined
        new webpack.DefinePlugin({
          'this': 'this',
        }),
        // 配置内置模块，防止 webpack 打包出错
        new webpack.ExternalsPlugin('commonjs', [
            'axios', 'utils', 'vika', 'lodash', 'crypto-js', 'websocket', 'antd-mobile'
        ]),
    ],
    // 构建模式
    mode: 'production',
    // 优化选项
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,              // 简化变量名
                    keep_fnames: true,          // 保留函数名
                    keep_classnames: true,      // 保留类名
                    compress: {
                        defaults: false,        // 关闭默认压缩规则
                        unused: true,           // 移除未使用的代码
                        dead_code: true,        // 移除不可达的代码
                        drop_console: false,    // 移除 console 语句
                    },
                    format: {
                        comments: /@author/,    // 保留指定格式的注释
                        beautify: true,         // 保留换行和空格
                        indent_level: 2,        // 缩进级别
                        braces: false,          // 保留大括号
                    },
                },
                extractComments: false,
            }),
        ],
    },
    module: {
        rules: [
            {
                // 配置 babel，解析 jsx 文件
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
}
