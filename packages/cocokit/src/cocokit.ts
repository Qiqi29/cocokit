/**
 * CoCoKit 控件开发包
 * @author 琦琦
 */

import type { IProp, IEvent, IMethod, IVisibleWidget, IInvisibleWidget } from './types'
import { getType } from './utils'


// 声明官方控件类
declare class VisibleWidget {
    constructor(props: any)
}


/** 控件实例 */
class widgetInstance extends VisibleWidget {
    [key: string]: any;
    constructor(props: any) {
        super(props)
        Object.assign(this, props)
        this.init()
    }
    init() {}
    render() {}
}

/** 控件配置 */
const widgetConfig = {
    title: '',
    type: '',
    version: '',
    icon: '',
    docs: { url: '' },
    isInvisibleWidget: false,
    isGlobalWidget: false,
    hasAnyWidget: false,
    properties: [] as any[],
    events: [] as any[],
    methods: [] as any[],
    // 附加属性
    size: { width: 0, height: 0 },
    eventIcon: '',
    returnId: true,
}


// #region 基本控件类
/** 基本控件类 */
class BaseWidget {
    currentProp: IProp

    constructor() {
        this.currentProp = {}
    }
    
    /**
     * 创建属性
     * @param label 属性名称 
     * @param key   属性 key
     * @param value 属性默认值
     * @example
     * // 使用示例
     * widget.prop('文本', 'text', '这是一段文本')
     */
    prop(label: string, key: string, value: any) {
        const prop = {
            key: key,
            label:  label,
            defaultValue: value,
            valueType: getType(value),
            blockOptions: { setter: {}, getter: {} }
        }
        widgetConfig.properties.push(prop)
        this.currentProp = prop
        return this
    }

    /**
     * 设置属性的类型（cocokit 会自动推断参数的类型，部分参数需要自行设置)
     * @param type 类型
     */
    type(type: string) {
        this.currentProp.valueType = type
        return this
    }

    /**
     * 设置属性的值检查
     * @param type 检查的类型
     */
    check(type: string | string[]) {
        this.currentProp.checkType = type
        return this
    }

    /**
     * 设置属性的编辑器样式
     * @param type 类型 
     * @example
     * // 使用示例
     * widget.prop(...).editor('TextArea')      // 直接设置
     * widget.prop(...).editor(EType.TextArea)  // 使用内置类型
     */
    editor(type: string) {
        this.currentProp.editorType = type
        return this
    }
    
    /**
     * 设置数值单位（属性值为数字时，在输入框右侧显示的文本）
     * @param text 单位文本
     * @example
     * // 使用示例
     * widget.prop(...).unit('像素')
     */
    unit(text: string) {
        this.currentProp.unit = text
        return this
    }

    /**
     * 设置属性的下拉菜单选项
     * @param menu 下拉菜单配置
     * @example
     * // 使用示例
     * widget.prop(...).dropdown({ 选项1: 'value1', 选项2: 'value2' })
     */
    dropdown(menu: Record<string, any>) { 
        this.currentProp.dropdown = dropdownToArray(menu) 
        return this
    }

    /**
     * 隐藏属性编辑器（在属性面板隐藏这个属性，可以通过积木设置和读取）
     */
    hide() {
        this.currentProp.hidePropertyEditor = true
        return this
    }

    /**
     * 设置属性为只读（在属性面板隐藏这个属性，并且只能通过积木读取，不能修改）
     */
    readonly() { 
        this.currentProp.readonly = true 
        return this
    }

    /**
     * 设置悬停提示（鼠标悬停在积木上时显示的内容（可通过\n换行））
     * @param text 提示内容
     */
    tips(text: string) { 
        this.currentProp.tooltip = text 
        return this
    }

    /**
     * 隐藏属性的积木（不生成 "设置" 和 "读取" 积木）
     */
    noBlock() { 
        this.currentProp.blockOptions!.generateBlock = false
        this.noSet().noGet() 
        return this 
    }

    /**
     * 隐藏 "设置" 积木
     */
    noSet() { 
        this.currentProp.blockOptions!.setter!.generateBlock = false
        return this 
    }
    
    /**
     * 隐藏 "读取" 积木
     */
    noGet() { 
        this.currentProp.blockOptions!.getter!.generateBlock = false
        return this 
    }

    /**
     * 设置积木间隔（积木在列表中与下一个积木之间的间距）
     * @param value 间隔大小
     */
    space(value: number) { 
        this.currentProp.blockOptions!.setter!.space = value
        return this 
    }

    /**
     * 设置积木分割线文本（设置后会在积木上方显示分割线，并显示设置的文本内容）
     * @param text 
     */
    line(text: string) { 
        this.currentProp.blockOptions!.setter!.line = text
        return this 
    }

    /**
     * 设置 "读取" 积木分割线文本
     * @param text 
     */
    lineGet(text: string) { 
        this.currentProp.blockOptions!.getter!.line = text
        return this 
    }

    /**
     * 合并属性积木
     * @param array 属性键数组
     */
    keys(array: string[]) { 
        this.currentProp.blockOptions!.setter!.keys = array
        this.currentProp.blockOptions!.getter!.keys = array
        return this 
    }


    /**
     * 初始化控件数据（在这里可以通过 this 读取和设置数据）
     * @param func 初始化函数
     */
    init(func: () => void) {
        widgetInstance.prototype.init = func
    }

    /**
     * 创建事件
     * @param label   事件名称 
     * @param key     事件 key
     * @param options 事件配置
     * @example
     * // 使用示例
     * widget.event('被点击时', 'onClick', { icon: 'https://..' })
     */
    event(label: string, key: string, options: IEvent = {}) {
        const event = {
            key: key,
            label: label,
            params: options.params || [],
            subTypes: eventDropdownToArray(options.dropdown),
            tooltip: options.tips || '',
            blockOptions: {
                line: options.line || '',
                space: options.space ?? null,
                order: options.order ?? null,
                icon: options.icon || widgetConfig.eventIcon || '',
            },
        }
        widgetConfig.events.push(event)
    }

    /**
     * 创建方法
     * @param label   方法名称 
     * @param key     方法 key
     * @param options 方法配置
     * @param func    方法执行的函数
     */
    method(label: string, key: string, options: IMethod = {}, func: (...args: any[]) => any) {
        const method = {
            key: key,
            label: label,
            params: methodDropdownToArray(options.params),
            valueType: options.returnType || null,
            tooltip: options.tips || '',
            blockOptions: {
                color: options.color || null,
                line: options.line || '',
                space: options.space ?? null,
                callMethodLabel: options.methodLabel ?? null,
                inputsInline: options.inline ?? true,
                order: options.order ?? null,
                icon: options.icon || null,
            },
        }
        widgetConfig.methods.push(method)
        widgetInstance.prototype[key] = func
    }

    /**
     * 创建内部方法（用来创建需要通过 this 获取数据，但是不需要生成积木的方法）
     * @param key   方法名
     * @param func  方法执行的函数
     */
    inMethod(key: string, func: (...args: any[]) => any) {
        widgetInstance.prototype[key] = func
    }

    /**
     * 导出控件配置
     * @returns 
     */
    types() {
        return widgetConfig
    }
}


// #region 可见控件
/**
 * 创建可见控件
 * @example
 * import { CoCoWidget } from 'cocokit'
 * const widget = new CoCoWidget()
 */
export class CoCoWidget extends BaseWidget {
    constructor() {
        super()
    }

    /**
     * 配置控件信息
     * @param options 控件配置
     */
    config(options: IVisibleWidget) {
        const { name, id, version, icon='', eventIcon='', docs='', anyWidget=true, width, height, returnId=true } = options
        Object.assign(widgetConfig, {
            title: name,
            type: id,
            version: version,
            icon: icon,
            eventIcon: eventIcon,
            docs: { url: docs },
            hasAnyWidget: anyWidget,
            size: { width, height },
            returnId,
        })
    }

    /**
     * 渲染控件
     * @param element 渲染函数（返回DOM元素）
     */
    render(element: () => any) {
        widgetInstance.prototype.render = element
    }

    /**
     * 导出控件实例
     */
    build() {
        // 添加返回控件ID积木
        if (widgetConfig.returnId) {
            this.method('的 ID', 'getWidgetId', {
                returnType: 'string',
                color: ' #F0AF3F', methodLabel: false,
            }, function (this: widgetInstance) {
                return this.__widgetId
            })
        }
        // 添加宽高设置属性
        this.prop('宽度', '__width', widgetConfig.size.width).noBlock()
        this.prop('高度', '__height', widgetConfig.size.height).noBlock()
        this.prop('', '__size', 100).readonly().keys(['__height', '__width']).line('通用')
        return widgetInstance
    }
}


// #region 不可见控件
/**
 * 创建不可见控件
 * @example
 * import { CoCoInvisibleWidget } from 'cocokit'
 * const widget = new CoCoInvisibleWidget()
 */
export class CoCoInvisibleWidget extends BaseWidget {
    constructor() {
        super()
    }

    /**
     * 配置控件信息
     * @param options 控件配置
     */
    config(options: IInvisibleWidget) {
        const { name, id, version, icon='', eventIcon='', docs='', isGlobal=true } = options
        Object.assign(widgetConfig, {
            title: name,
            type: id,
            version: version,
            icon: icon,
            eventIcon: eventIcon,
            docs: { url: docs },
            isInvisibleWidget: true,
            isGlobalWidget: isGlobal,
        })
    }

    /**
     * 导出控件实例
     */
    build() {
        return widgetInstance
    }
}




// 属性下拉菜单转换
function dropdownToArray(dropdown: Record<string, any>) {
    if (!dropdown) return null
    return Object.entries(dropdown).map(([label, value]) => ({ label, value }))
}

// 事件下拉菜单转换
function eventDropdownToArray(dropdown: Array<Record<string, any>> | undefined) {
    if (!dropdown) return []
    return dropdown.map((item, index) => {
        return { key: index, dropdown: dropdownToArray(item) }
    })
}

// 方法参数下拉菜单转换
function methodDropdownToArray(dropdown: Array<Record<string, any>> | undefined) {
    if (!dropdown) return []
    return dropdown.map(item => {
        return { ...item, dropdown: dropdownToArray(item.dropdown) }
    })
}