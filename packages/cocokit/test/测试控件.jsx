/**
 * @author 作者
 * 一段简短的描述，介绍你的控件
 */

import { CoCoWidget, Color, EType } from '../dist/index'
const widget = new CoCoWidget()

const document = this.document
const window = this.window


widget.config({
    name: '测试控件',
    id: 'WIDGWT',
    version: '1.0.0',
    width: 100,
    height: 100,
})

widget.prop('文本', 'text', '你好世界').editor(EType.TextArea)

widget.event('被点击时', 'onClick')

widget.method('获取文本', 'getText', {
    returnType: 'string',
    color: Color.blue,
}, function () {
    document.getElementById(this.__widgetId)
    return this.text
})


widget.render(function () { return (
<>
    <div className={this.__widgetId} onClick={() => this.emit('onClick')}>
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

exports.types = widget.types()
exports.widget = widget.build()