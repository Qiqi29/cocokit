/** 
 * 控件属性类型
 */
export interface IProp {
    key?: string
    label?: string
    defaultValue?: any
    valueType?: string | string[]
    checkType?: string | string[]
    editorType?: string
    unit?: string
    dropdown?: Record<string, any> | null
    hidePropertyEditor?: boolean
    readonly?: boolean
    tooltip?: string
    blockOptions?: IBlockOptions
}

interface IBlockOptions {
    generateBlock?: boolean
    color?: string
    space?: number
    line?: string
    callMethodLabel?: string | boolean
    inputsInline?: boolean
    order?: number
    icon?: string
    setter?: IBlockOptionsSetGet
    getter?: IBlockOptionsSetGet
}

interface IBlockOptionsSetGet {
    generateBlock?: boolean
    space?: number
    line?: string
    keys?: string[]
}




// 基本积木类型
interface IBaseBlock {
    /** 鼠标悬停在积木上时显示的内容（可通过\n换行） */
    tips?: string
    /** 设置积木分割线文本（设置后会在积木上方显示分割线，并显示设置的文本内容） */
    line?: string
    /** 积木在列表中与下一个积木的间隔 */
    space?: number
    /** 积木在列表中的顺序 */
    order?: number
    /** 积木的图标 */
    icon?: string
}

// 参数类型
interface IParamsType {
    /** 参数的键名 */
    key?: string
    /** 参数的描述文本 */
    label?: string
    /** 参数的后缀文本 */
    labelAfter?: string
    /** 参数的默认值 */
    defaultValue?: any
    /** 参数的类型 */
    valueType?: string | string[]
    /** 参数的下拉菜单 */
    dropdown?: Record<string, any>[]
}


/**
 * 控件事件类型
 */
export interface IEvent extends IBaseBlock {
    /** 事件的参数列表 */
    params?: IParamsType[]
    /** 事件的下拉菜单配置 */
    dropdown?: Record<string, any>[] | undefined
}


/**
 * 控件方法类型
 */
export interface IMethod extends IBaseBlock {
    /** 方法的参数列表 */
    params?: IParamsType[]
    /** 方法的的返回值类型（设置后积木会变为 "读取" 类型） */
    returnType?: string | Array<string>
    /** 方法积木的颜色 */
    color?: string
    /** 积木前的 "调用" 文本，输入字符串可以自定义，布尔值可以显示或隐藏  */
    methodLabel?: string | boolean
    /** 是否为一行积木 */
    inline?: boolean
}



// 基本控件配置
interface IBaseWidget {
    /** 控件的名称 */
    name: string
    /** 控件的ID（不能和其他控件重复） */
    id: string
    /** 控件的版本号（格式: 1.0.0） */
    version: string
    /** 控件的图标链接 */
    icon?: string
    /** 事件积木的图标链接 */
    eventIcon?: string
    /** 控件的文档链接 */
    docs?: string
}


/**
 * 可见控件配置
 */
export interface IVisibleWidget extends IBaseWidget {
    /** 控件的宽度 */
    width: number
    /** 控件的高度 */
    height: number
    /** 是否开启任意控件功能 */
    anyWidget?: boolean
    /** 是否添加 "返回控件ID" 积木 */
    returnId?: boolean
}


/**
 * 不可见控件配置
 */
export interface IInvisibleWidget extends IBaseWidget {
    /** 是否为全局控件 */
    isGlobal?: boolean
}
