// 从 cocokit 中导入所需的功能
import { CoCoWidget, WiegetLog, Color, EType, VType } from 'cocokit'
const widget = new CoCoWidget()  // 创建可见控件实例，不可见控件通过 CoCoInvisibleWidget 创建
const Log = new WiegetLog()      // 控件日志输出，可以在编辑器和控制台中同时输出信息



// 配置控件的基本信息
// 你可以把鼠标悬停在任意配置项上查看配置的描述
widget.config({
    name: '示例控件',
    id: 'QII_WIDGET_DEMO',
    version: '1.0.0',
    icon: 'https://static.bcmcdn.com/coco/player/unstable/HyDgABNleg.image/png',
    eventIcon: 'https://static.bcmcdn.com/coco/player/unstable/rkVwtDNFyg.image/svg+xml',
    width: 200,
    height: 100,
})


// 创建几个常见的属性
// 属性通过链式方法进行配置，在 prop() 后通过 .func() 的方式配置更多参数
// VSCode 会自动提示参数，并解释参数的作用
widget.prop('文本', 'text', '这是一段文本').editor(EType.TextArea).line('设置文本')
.prop('大小', 'textSize', 14).unit('px').noGet()
.prop('颜色', 'textColor', '#101012').noGet()


// 创建一个简单的事件
widget.event('加载完成时', 'onReady')

// 创建带有下拉菜单和返回值的事件
widget.event('被', 'on', {
    dropdown: [
        { 点击时: 'Click', 按下时: 'Dowm', 松开时: 'Up' }
    ],
    params: [
        { key: 'data', label: '数据', valueType: VType.string }
    ],
})


// 创建一个方法
// 可以添加 returnType 参数，让方法变成带有返回值的积木
widget.method('测试方法', 'testMethod', {
    params: [
        { key: 'data', label: '', defaultValue: '', valueType: VType.any },
    ],
    color: Color.blue,
}, 
function (data) {
    Log.info(this, '数据', data)
})


// 创建一个内部方法
// 用来创建需要通过 this 获取数据，但是不需要生成积木的方法
widget.inMethod('methodKeyin', function (data) {
    this.data = ''
})


// 渲染控件
widget.render(function () { return (
<>
    <div className={this.__widgetId}>
        <span>{this.text}</span>
    </div>

    <style>{`
        .${this.__widgetId} {
            width: 100%;
            height: 100%;
        }
    `}</style>
</>
)})


// 导出控件
exports.types = widget.types()
exports.widget = widget.build()