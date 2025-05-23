/**
 * @author 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */

import { CoCoWidget, Icon, IconLoading } from '../dist/index'
const widget = new CoCoWidget()

var window = this.window
var document = this.document


widget.config({
    name: '按钮',
    id: 'QII_WIDGET_BUTTON',
    version: '2.0.0',
    icon: 'https://static.bcmcdn.com/coco/player/unstable/HyDgABNleg.image/png',
    width: 90,
    height: 35,
})


widget.prop('文本配置', 'ButtonTextGroup', '').editor('ButtonTextGroup').noBlock()
.prop('文本', 'textVisible', true).hide().noGet().dropdown({ 显示:true, 隐藏:false }).line('文本')
.prop('文本内容', 'text', '按钮').hide()
.prop('文本字体', 'fontFamily', 'sans-serif').hide().noBlock()
.prop('文本字号', 'maxFontSize', 14).hide().noBlock()
.prop('文本颜色', 'textColor', '#FFFFFF').hide().noBlock()
.prop('文本对齐', 'textAlign', 'center').hide().noGet().dropdown({ 左侧:'left', 居中:'center', 右侧:'right' })
.prop('自定义字体', 'customFontFamily', '').noGet()
.prop('文本加粗', 'textBlod', false).noGet()

.prop('按钮圆角', 'buttonRound', 20).unit('px').noGet().line('按钮')
.prop('按钮颜色', 'buttonColor', '#3080FF').noGet()
.prop('按钮颜色-渐变', 'buttonColor2', 'transparent').noGet()
.prop('渐变角度', 'colorAngle', 160).unit('度').noGet()
.prop('背景模糊', 'bgBlur', 0).unit('px').noGet()
.prop('字距', 'letterSpacing', 0).unit('px').noGet()
.prop('点击变暗', 'animDark', true).noGet()
.prop('点击缩小', 'animSize', true).noGet()
.prop('加载', 'loading', false)
.prop('禁用', 'disabled', false)

.prop('边框粗细', 'borderWidth', 0).unit('px').noGet().line('边框')
.prop('边框颜色', 'borderColor', '#303032').noGet()

.prop('图标', 'icon', '').noGet().line('图标')
.prop('图标大小', 'iconSize', 18).unit('px').noGet()
.prop('覆盖图标颜色', 'coverIconColor', true).noGet()

.prop('屏幕适配', 'screenAlign', 'top').dropdown({ 顶部对齐: 'top', 底部对齐: 'bottom' }).noBlock()


widget.event('被', 'on', {
    dropdown: [
        { '点击 时':'Click', '按下 时':'Down', '松开 时':'Up', '长按 时':'Long' }
    ]
})
widget.inMethod('onEvent', function (event, name) {
    if (this.loading || this.disabled) return
    event.persist()
    window.qii_click_position = event.currentTarget.getBoundingClientRect()
    this.emit('on' + name)
})


widget.render(function () { return (
<>
    <button 
        className={this.__widgetId}
        disabled={this.disabled}
        onClick={(e) => this.onEvent(e, 'Click')}
        onMouseDown={(e) => this.onEvent(e, 'Down')}
        onTouchStart={(e) => this.onEvent(e, 'Down')}
        onMouseUp={(e) => this.onEvent(e, 'Up')}
        onTouchEnd={(e) => this.onEvent(e, 'Up')}
        onContextMenu={(e) => { e.preventDefault(); this.onEvent(e, 'Long') }}
        data-screen-align={this.screenAlign}>
        
        <Icon show={this.icon && !this.loading} size={this.iconSize} code={this.icon} color={this.coverIconColor ? this.textColor : ''}/>
        <IconLoading show={this.loading} size={this.iconSize}/>
        { this.textVisible && this.text != '' && <span>{this.text}</span> }

    </button>

    <style>{`
        .${this.__widgetId} {
            width: 100%;
            height: 100%;
            padding: 0 ${this.textAlign !== 'center' ? '14px' : '0'};
            display: flex;
            align-items: center;
            justify-content: ${this.textAlign};
            background: transparent;
            border: none;
            color: ${this.textColor};
            font-size: ${this.maxFontSize}px;
            font-weight: ${this.textBlod ? 'bold' : 'normal'};
            font-family: ${this.customFontFamily};
            text-indent: ${this.letterSpacing}px;
            letter-spacing: ${this.letterSpacing}px;
            transition: all 0.15s;
            cursor: pointer;
        }
        
        /* 使用伪元素当作背景，单独对背景设置滤镜 */
        .${this.__widgetId}::before {
            content: '';
            position: absolute; top: 0; left: 0;
            width: 100%;
            height: 100%;
            background: ${this.buttonColor2 == 'transparent' ? this.buttonColor : `linear-gradient(${this.colorAngle}deg, ${this.buttonColor}, ${this.buttonColor2})`};
            border-radius: ${this.buttonRound}px;
            border: ${this.borderWidth}px solid ${this.borderColor};
            backdrop-filter: ${this.bgBlur ? `blur(${this.bgBlur}px)` : ''};
            transition: filter 0.1s;
        }
        
        .${this.__widgetId} > * {
            z-index: 2;
        }
        .${this.__widgetId} > span {
            margin-top: 1.5px;
        }
        .${this.__widgetId} .qii-icon {
            margin-top: 1px;
            margin-right: ${this.textVisible && this.text != '' ? 5 : 0}px;
        }

        .${this.__widgetId}:disabled {
            opacity: 0.55;
        }
        .${this.__widgetId}:not([disabled]):active {
            transform: scale(${this.animSize ? 0.96 : 1});
        }
        .${this.__widgetId}:not([disabled]):active::before {
            filter: brightness(${this.animDark ? 0.86 : 1});
        }
    `}</style>       
</>
)})


exports.types = widget.types()
exports.widget = widget.build()