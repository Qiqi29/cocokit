import { CoCoVisibleWidget, WiegetLog, Color, EType, VType } from 'cocokit'
const widget = new CoCoVisibleWidget()
const Log = new WiegetLog()


// 配置控件的基本信息
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
widget.prop('文本', 'text', '这是一段文本').editor(EType.TextArea)
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
widget.method('测试方法', 'testMethod', {
    params: [
        { key: 'data', label: '', defaultValue: '', valueType: VType.any },
    ],
    color: Color.blue,
}, 
function (data) {
    Log.info(this, '数据', data)
})


// 渲染控件
widget.render(function () { 
    return (<>
        <div className={this.__widgetId}>
            <span>{this.text}</span>
        </div>

        <style>{`
            .${this.__widgetId} {
                width: 100%;
                height: 100%;
            }
        `}</style>
    </>)
})


// 导出控件
exports.types = widget.types()
exports.widget = widget.build()