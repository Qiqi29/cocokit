const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const packageJson = require('./package.json')


// 代码压缩配置
const terserOptions = {
    mangle: false,              // 简化变量名
    keep_fnames: true,          // 保留函数名
    keep_classnames: true,      // 保留类名
    compress: {
        defaults: false,        // 默认压缩规则
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
}


module.exports = {
    entry: './widget.jsx',
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        // 防止 this 指向 undefined
        new webpack.DefinePlugin({
          'this': 'this',
        }),
        // 配置外部模块，防止 webpack 打包出错
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
                terserOptions: packageJson.build_config['代码压缩'] ? {} : terserOptions,
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
