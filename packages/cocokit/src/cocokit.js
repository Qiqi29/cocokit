import { getType } from './unils'

// #region 控件配置
const WidgetConfig = {
    title: '',
    type: '',
    version: '',
    icon: '',
    docs: { url: '' },
    isInvisibleWidget: false,
    isGlobalWidget: false,
    hasAnyWidget: false,
    properties: [],
    events: [],
    methods: [],
    // 附加属性
    size: { width: 0, height: 0 },
    eventIcon: '',
    returnId: true,
}

// 控件实例
class WidgetInstance extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
        this.init()
    }
    init() {}
    render() {}
}


// #region 基本控件类
class BaseWidget {
    constructor() {
        this.currentProp = null
    }

    // 添加属性
    prop(label, key, value) {
        const prop = {
            key: key,
            label:  label,
            defaultValue: value,
            valueType: getType(value),
            blockOptions: { setter: {}, getter: {} }
        }
        WidgetConfig.properties.push(prop)
        this.currentProp = prop
        return this
    }

    // 检查数据类型
    check(types) { 
        this.currentProp.checkType = types
        return this
    }
    // 编辑器类型
    editor(type) {
        this.currentProp.editorType = type
        return this
    }
    // 数值单位
    unit(text) {
        this.currentProp.unit = text
        return this
    }
    // 属性下拉菜单
    dropdown(menu) { 
        this.currentProp.dropdown = dropdownToArray(menu) 
        return this
    }
    // 隐藏属性编辑器
    hide() { 
        this.currentProp.hidePropertyEditor = true
        return this
    }
    // 只读属性
    readonly() { 
        this.currentProp.readonly = true 
        return this
    }
    // 悬停提示
    tips(text) { 
        this.currentProp.tooltip = text 
        return this
    }
    // 隐藏积木
    noBlock() { 
        this.currentProp.blockOptions.generateBlock = false
        this.noSet().noGet() 
        return this 
    }
    // 隐藏设置积木
    noSet() { 
        this.currentProp.blockOptions.setter.generateBlock = false
        return this 
    }
    // 隐藏获取积木
    noGet() { 
        this.currentProp.blockOptions.getter.generateBlock = false
        return this 
    }
    // 积木间隔
    space(value) { 
        this.currentProp.blockOptions.setter.space = value
        return this 
    }
    // 设置积木行文本
    line(text) { 
        this.currentProp.blockOptions.setter.line = text
        return this 
    }
    // 读取积木行文本
    lineGet(text) { 
        this.currentProp.blockOptions.getter.line = text
        return this 
    }
    // 合并积木
    keys(arr) { 
        this.currentProp.blockOptions.setter.keys = arr
        this.currentProp.blockOptions.getter.keys = arr
        return this 
    }

    
    // 初始化控件数据
    init(func) {
        WidgetInstance.prototype.init = func
    }


    // 积木配置生成
    #blockOptions(block, options) {
        return {
            color: options.color || null,
            space: options.space || null,
            line: options.line || '',
            callMethodLabel: options.methodLabel ?? null,
            inputsInline: options.inline ?? true,
            order: options.order ?? null,
            icon: options.icon || block == 'event' ? WidgetConfig.eventIcon : null,
        }
    }


    // 创建事件
    event(label, key, options={}) {
        const event = {
            key: key,
            label: label, 
            params: options.params || [],
            subTypes: eventDropdownToArray(options.dropdown),
            tooltip: options.tips || '',
            blockOptions: this.#blockOptions('event', options),
        }
        WidgetConfig.events.push(event)
    }


    // 创建方法积木
    method(label, key, options, func) {
        const method = {
            key: key,
            label: label,
            params: methodDropdownToArray(options.params),
            valueType: options.returnType || null,
            tooltip: options.tips || '',
            blockOptions: this.#blockOptions('method', options),
        }
        WidgetConfig.methods.push(method)
        WidgetInstance.prototype[key] = func
    }


    // 创建内部方法
    inMethod(key, func) {
        WidgetInstance.prototype[key] = func
    }

    
    // 导出控件配置
    types() {
        return WidgetConfig;
    }
}


// #region 不可见控件
export class CoCoInvisibleWidget extends BaseWidget {
    constructor() {
        super()
    }

    // 配置控件
    config(options) {
        const { name, id, version, icon='', eventIcon='', docs='', isGlobal=true } = options
        Object.assign(WidgetConfig, {
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

    // 导出控件实例
    build() {
        return WidgetInstance
    }
}


// #region 可见控件
export class CoCoVisibleWidget extends BaseWidget {
    constructor() {
        super()
    }

    // 配置控件
    config(options) {
        const { name, id, version, icon='', eventIcon='', docs='', width, height, anyWidget=true, returnId=true } = options
        Object.assign(WidgetConfig, {
            title: name,
            type: id,
            version: version,
            icon: icon,
            eventIcon: eventIcon,
            docs: { url: docs },
            size: { width, height },
            hasAnyWidget: anyWidget,
            returnId,
        })
    }

    // 渲染控件
    render(elementFunc) {
        WidgetInstance.prototype.render = elementFunc
    }

    // 导出控件实例
    build() {
        // 添加返回控件ID积木
        if (WidgetConfig.returnId) {
            this.method('的 ID', 'getWidgetId', {
                returnType: 'string',
                color: ' #F0AF3F', methodLabel: false,
            }, function () {
                return this.__widgetId
            })
        }
        // 添加宽高设置属性
        this.prop('宽度', '__width', WidgetConfig.size.width).noBlock()
        this.prop('高度', '__height', WidgetConfig.size.height).noBlock()
        this.prop('', '__size', 100).readonly().keys(['__height', '__width']).line('通用')
        return WidgetInstance
    }
}


// #region 辅助函数

// 属性下拉菜单转换
function dropdownToArray(dropdown) {
    if (!dropdown) return null
    return Object.entries(dropdown).map(([label, value]) => ({ label, value }))
}

// 事件下拉菜单转换
function eventDropdownToArray(dropdown) {
    if (!dropdown) return []
    return dropdown.map((item, index) => {
        return { key: index, dropdown: dropdownToArray(item) }
    })
}

// 方法参数下拉菜单转换
function methodDropdownToArray(dropdown) {
    if (!dropdown) return []
    return dropdown.map(item => {
        return { ...item, dropdown: dropdownToArray(item.dropdown) }
    })
}