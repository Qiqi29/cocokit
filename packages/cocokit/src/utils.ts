/** 常用的积木颜色 */
export const Color = {
    // 常用
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

/** 数据类型 */
export const VType = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    color: 'color',
    array: ['array', 'string'],
    object: ['object', 'string'],
    any: ['string', 'number', 'boolean', 'color', 'array', 'object'],
}

/** 编辑器类型 */
export const EType = {
    /** 多行文本输入框 */
    TextArea: 'TextArea',
    /** 富文本编辑器 */
    RichText: 'RichTextEditor',
    /** 选项切换选择器（需配置 dropdown） */
    OptionSwitch: 'OptionSwitch',
    /** 数字滑动条 */
    Slider: 'NumberSlider',
    /** 对齐方式选择器 */
    Align: 'Align',
    /** 水平对齐选择器 */
    HorAlign: 'HorizontalAlign',
    /** 垂直对齐选择器 */
    VerAlign: 'VerticalAlign',
    /** 方向选择器 */
    Direction: 'SliderDirection',
    /** 文本组配置 */
    TextGroup: 'TextWidgetTextGroup',
    /** 按钮组配置 */
    ButtonGroup: 'ButtonTextGroup',
    /** 音量滑动条 */
    AudioVolume: 'AudioVolume',
    /** 音速滑动条 */
    AudioRate: 'AudioRate',
    /** HTTP请求头编辑器 */
    HttpHeader: 'HttpHeader',
}



/**
 * 获取数据的类型
 * @param value 数据
 */
export function getType(value: any) {
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'
    if (isColor(value)) return 'color'
    if (Array.isArray(value)) return ['array', 'string']
    return 'string'
}


// 颜色正则
const COLOR_REGEX = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$|^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;

/**
 * 判断字符串是否为颜色值
 * @param string 字符串
 */
export function isColor(string: string) {
    return COLOR_REGEX.test(string) || string === 'transparent'
}

/**
 * 判断字符串是否为 URL
 * @param string 字符串
 */
export function isUrl(string: string) {
    return /^https?:\/\/.+/.test(string)
}

/**
 * 替换字符串中的 `\\n` 为 `\n`
 * @param content 字符串内容
 */
export function replaceNewline(content: string) {
    return content.replace(/\\n/g, '\n')
}