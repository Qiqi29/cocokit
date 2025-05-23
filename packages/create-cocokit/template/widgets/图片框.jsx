/**
 * @author 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */

import { CoCoWidget, EType } from 'cocokit'
const widget = new CoCoWidget()


// 控件配置
widget.config({
    name: '图片框',
    id: 'QII_WIDGET_IMAGE',
    version: '2.0.0',
    icon: 'https://static.bcmcdn.com/coco/player/unstable/SJQ3xvF8Jl.image/png',
    width: 220,
    height: 140,
})


// 控件属性
widget.prop('图片', 'imgUrl', 'https://static.bcmcdn.com/coco/player/unstable/HJyfLwixlx.image/png').editor(EType.TextArea).line('图片')
.prop('显示模式', 'imgMode', 'cover').editor(EType.OptionSwitch).dropdown({ 完整:'contain', 拉伸:'fill', 裁剪:'cover' })
.prop('背景颜色', 'imgBg', '#00002010')
.prop('圆角', 'imgRound', 10).unit('px').noGet()
.prop('旋转', 'imgRotate', 0).unit('度').noGet()
.prop('缩放', 'imgScale', 100).unit('%').noGet()

.prop('模糊', 'imgBlur', 0).unit('px').noGet().line('滤镜')
.prop('亮度', 'imgBrightness', 100).unit('%').noGet()
.prop('饱和度', 'imgSaturate', 100).unit('%').noGet()

.prop('边框粗细', 'borderSize', 0).unit('px').noGet().line('其他样式')
.prop('边框颜色', 'borderColor', '#B7D4FB').noGet()
.prop('阴影颜色', 'shadowColor', 'transparent').noGet()
.prop('阴影样式', 'shadowStyle', '0px 5px 20px 0px').noGet()
.prop('动画样式', 'animStyle', 'all 0.3s ease').noGet()
.prop('圆角样式', 'customRound', '').noGet()

.prop('屏幕适配', 'screenAlign', 'top').dropdown({ 顶部对齐: 'top', 底部对齐: 'bottom' }).noBlock()


// 控件事件
widget.event('被点击时', 'onClick')
widget.event('图片加载失败时', 'onLoadError')


// 渲染控件
widget.render(function () { return (
<>
    <div 
        className={this.__widgetId}
        onClick={() => this.emit('onClick')}
        data-screen-align={this.screenAlign}>
        <img 
            src={this.imgUrl} draggable="false"
            onError={() => this.imgUrl !== '' && this.emit('onLoadError')}
        />
    </div>

    <style>{`
        .${this.__widgetId} {
            width: 100%;
            height: 100%;
            background-color: ${this.imgBg};
            border: ${this.borderSize}px solid ${this.borderColor};
            border-radius: ${this.customRound == '' ? this.imgRound + 'px' : this.customRound};
            box-shadow: ${this.shadowStyle + ' ' + this.shadowColor};
            filter: brightness(${this.imgBrightness}%) saturate(${this.imgSaturate}%);
            transform: rotate(${this.imgRotate}deg);
            transition: ${this.animStyle};
            overflow: hidden;
        }
        .${this.__widgetId} img {
            width: 100%;
            height: 100%;
            object-fit: ${this.imgMode};
            filter: blur(${this.imgBlur}px);
            transform: scale(${this.imgScale / 100});
            transition: ${this.animStyle};
        }
        .${this.__widgetId} img[src=""] {
            display: none;
        }
    `}</style>
</>
)})


// 导出控件
exports.types = widget.types()
exports.widget = widget.build()