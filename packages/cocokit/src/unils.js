// 积木颜色
export const Color = {
    // 自定义
    blue: ' #4A9AFA',
    blue_light: ' #62B7FF',
    green: ' #07AFC1',
    yellow: ' #F0AF3F',
    pink: ' #FF74B7',
    // 官方
    event: ' #608FEE',
    control: ' #68CDFF',
    feature: ' #00AFC3',
    calc: ' #FEAE8A',
    variable: ' #FFBB55',
    array: ' #F9CC37',
    object: ' #A073FF',
    function: ' #F88767',
    props: ' #E76CEA',
}

// 属性类型
export const VType = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    color: 'color',
    array: ['array', 'string'],
    object: ['object', 'string'],
    any: ['string', 'number', 'boolean', 'color', 'array', 'object'],
}

// 编辑器类型
export const EType = {
    TextArea: 'TextArea',
    Option: 'OptionSwitch',
    Slider: 'NumberSlider',
    TextGroup: 'TextWidgetTextGroup',
    ButtonGroup: 'ButtonTextGroup',
    Align: 'Align',
    HorAlign: 'HorizontalAlign',
    VerAlign: 'VerticalAlign',
    Direction: 'SliderDirection',
    RichText: 'RichTextEditor',
    AudioVolume: 'AudioVolume',
    AudioRate: 'AudioRate',
    HttpHeader: 'HttpHeader',
}


// 类型推断
export function getType(value) {
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'
    if (isColor(value)) return 'color'
    if (Array.isArray(value)) return ['array', 'string']
    return 'string'
}


// 颜色正则
const COLOR_REGEX = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$|^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;

// 判断是否为颜色值
export function isColor(string) {
    return COLOR_REGEX.test(string) || string === 'transparent'
}


// 验证 URL
export function isUrl(string) {
    const pattern = /^https?:\/\/.+/
    return pattern.test(string)
}


// 修正换行符
export function replaceNewline(content) {
    return content.replace(/\\n/g, '\n')
}


// 控件日志输出
export class WiegetLog {
    constructor() {}
    
    #replaceData(args) {
        return args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2)
            }
            return arg
        }).join(' ')
    }
    
    info(thisWidget, ...args) {
        console.log(...args)
        thisWidget.widgetLog(this.#replaceData(args))
    }
    warn(thisWidget, ...args) {
        console.warn(...args)
        thisWidget.widgetWarn(this.#replaceData(args))
    }
    error(thisWidget, ...args) {
        console.error(...args)
        thisWidget.widgetError(this.#replaceData(args))
    }
}