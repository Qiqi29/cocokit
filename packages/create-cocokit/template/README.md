# CoCoKit
一个 CoCo 控件开发工具，助你快速开发出强大的控件。


## 快速开始
初次使用时，请先执行下面的命令安装项目所需的依赖包。

~~~ bash
npm install
~~~


### 创建控件
在项目中任意文件夹内新建一个 JSX 文件，例如 `我的控件.jsx`，在代码中导入 `cocokit` 模块。

控件分为 `可见控件` 和 `不可见控件`，分别对应 `CoCoVisibleWidget` 和 `CoCoInvisibleWidget` 两个类。

~~~ jsx
import { CoCoVisibleWidget } from 'cocokit'
const widget = new CoCoVisibleWidget()
~~~

导入完成后，就可以开始编写控件啦，详细使用方法参考 `widgets` 文件夹中的示例控件。


### 类型提示
控件包提供了完整的 TS 类型提示，在编写控件时，VSCode 可以自动进行代码提示，也可以按下 `Ctrl + i` 快捷键打开代码提示弹窗，查看可以配置的各种参数。

> 你也可以在控件的代码顶部添加 `// @ts-check` 注解，激活 TS 的类型检查功能。


### 代码片段
开发包中提供了常用的代码片段，帮助你快速写出一个控件。

- `widget` 可见控件基础模板
- `widgetin` 不可见控件基础模板
- `winit` 初始化控件数据
- `wprop` 创建一个属性
- `wevent` 创建一个事件
- `wmethod` 创建一个方法
- `wmethodin` 创建一个内部方法
- `crender` 渲染控件


## 打包控件
使用开发包编写的控件，需要打包后才可以导入CoCo中使用。

执行 `npm run build {控件路径}` 命令，就可以打包指定控件。

~~~ bash
npm run build ./widgets/按钮.jsx
~~~


### 打包所有控件
在执行打包命令时，可以传入文件夹路径，打包文件夹内的所有控件。

~~~ bash
npm run build ./widgets
~~~


### 自动打包
如果你觉得手动打包很麻烦，可以执行 `npm run watch` 命令，当你保存控件时，就可以自动打包。


### 打包配置
在 `package.json` 文件底部，你可以自定义打包配置，例如自定义打包后的文件名，开启代码压缩。


## 内置组件
开发包中内置了一些常用的组件，引入后可以在渲染函数中直接使用。

~~~ jsx
import { Icon } from 'cocokit'

widget.render(function () { return (
    <div>
        {/* 使用图标组件 */}
        <Icon size={24} code={this.iconCode} />
    </div>
)})
~~~


## 内置函数与常量
开发包中还内置了一些常用的小工具，例如：

- `Color` 常用的积木颜色
- `VType` 属性类型
- `isUrl()` 判断一个字符串是否是一个 URL 地址
- `replaceNewLine()` 替换字符串中的换行符
- `WiegetLog <class>` 日志输出，可同时在编辑器和浏览器中打印数据
