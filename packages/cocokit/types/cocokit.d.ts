/**
 * 基本控件类
 */
declare class BaseWidget {
    /**
     * 创建属性
     * @param label 属性名称
     * @param key 属性键名
     * @param value 默认值
     */
    prop(label: string, key: string, value: any): this;
    
    /**
     * 设置属性检查类型
     * @param types 类型或类型数组
     */
    check(types: any): this;
    
    /**
     * 设置属性编辑器类型（编辑面板中该属性的编辑器样式）
     * @param type 编辑器类型
     */
    editor(type: string): this;

    /**
     * 设置数值单位（属性值为数字时，在输入框右侧显示的单位）
     * @param text 单位文本
     */
    unit(text: string): this;

    /**
     * 设置属性的下拉菜单选项
     * @param menu 下拉菜单配置
     */
    dropdown(menu: Record<string, any>): this;

    /**
     * 隐藏属性编辑器（在属性面板隐藏这个属性，可以通过积木设置和读取）
     */
    hide(): this

    /**
     * 设置属性为只读（在属性面板隐藏这个属性，并且只能通过积木读取，不能修改）
     */
    readonly(): this;

    /**
     * 设置悬停提示（鼠标悬停在积木上时显示的内容（可通过\n换行））
     * @param text 提示文本
     */
    tips(text: string): this;

    /**
     * 隐藏积木（不生成积木属性的 "设置" 和 "读取" 积木）
     */
    noBlock(): this;

    /**
     * 隐藏 "设置" 积木
     */
    noSet(): this

    /**
     * 隐藏 "读取" 积木
     */
    noGet(): this

    /**
     * 设置积木间隔（积木在列表中与下一个积木的间隔）
     * @param value 间隔值
     */
    space(value: number): this;

    /**
     * 设置积木行文本（积木列表中，该积木上方分割线中的文本）
     * @param text 文本
     */
    line(text: string): this;

    /**
     * 设置 "读取" 积木行文本（属性的返回值积木上的文本）
     * @param text 文本
     */
    lineGet(text: string): this;

    /**
     * 合并积木
     * @param arr 属性键数组
     */
    keys(arr: string[]): this;

    /**
     * 初始化控件数据（在这里可以通过 this 访问控件中定义的数据）
     * @param func 初始化函数
     */
    init(func: () => void): void;

    /**
     * 创建事件
     * @param label 事件名称 
     * @param key 事件键名 
     * @param options 事件配置
     */
    event(label: string, key: string, options?: IEventType): void;

    /**
     * 创建方法
     * @param label 方法名称 
     * @param key 方法键名 
     * @param options 方法配置
     * @param func 方法执行的函数
     */
    method(label: string, key: string, options: IMethodType, func: (...args: any[]) => any): void;
    
    /**
     * 创建内部方法（不会生成积木，用于内部逻辑）
     * @param key 方法名称 
     * @param func 方法执行的函数
     */
    inMethod(key: string, func: (...args: any[]) => any): void;

    /**
     * 导出控件配置
     */
    types(): object
}


/**
 * 创建不可见控件
 */
export declare class CoCoInvisibleWidget extends BaseWidget {
    /**
     * 配置控件信息
     * @param options 控件配置
     */
    config(options: IInvisibleWidgetConfig): void

    /**
     * 导出控件实例
     */
    build(): any
}


/**
 * 创建可见控件
 */
export declare class CoCoVisibleWidget extends BaseWidget {
    /**
     * 配置控件信息
     * @param options 控件配置
     */
    config(options: IVisibleWidgetConfig): void

    /**
     * 渲染控件
     */
    render(elementFunc: () => any): void

    /**
     * 导出控件实例
     */
    build(): any
}


/**
 * 不可见控件配置类型
 */
interface IInvisibleWidgetConfig {
    /** 控件的名称 */
    name: string;
    /** 控件的ID（不能和其他控件重复） */
    id: string;
    /** 控件的版本号（格式: 1.0.0，版本号可以在打包时自动添加到文件名中） */
    version: string;
    /** 控件的图标链接 */
    icon?: string;
    /** 事件积木的图标链接 */
    eventIcon?: string;
    /** 控件的文档链接 */
    docs?: string;
    /** 是否为全局控件 */
    isGlobal?: boolean;
}


/**
 * 可见控件配置类型
 */
interface IVisibleWidgetConfig {
    /** 控件的名称 */
    name: string;
    /** 控件的ID（不能和其他控件重复） */
    id: string;
    /** 控件的版本号（格式: 1.0.0，版本号可以在打包时自动添加到文件名中） */
    version: string;
    /** 控件的图标链接 */
    icon?: string;
    /** 事件积木的图标链接 */
    eventIcon?: string;
    /** 控件的文档链接 */
    docs?: string;
    /** 控件的宽度 */
    width: number;
    /** 控件的高度 */
    height: number;
    /** 是否开启任意控件功能 */
    anyWidget?: boolean;
    /** 是否添加 "返回控件ID" 积木 */
    returnId?: boolean;
}


// 事件配置类型
interface IEventType {
    /** 事件的参数列表 */
    params?: IParamsType[];
    /** 事件的下拉菜单配置 */
    dropdown?: object;
    /** 鼠标悬停在积木上的提示 */
    tips?: string;
    /** 积木在列表中与下一个积木的间隔 */
    space?: number;
    /** 在积木列表中，该积木上方分割线中的文本 */
    line?: string;
    /** 积木的顺序 */
    order?: number;
    /** 事件积木的图标 */
    icon?: string;
}


// 方法配置类型
interface IMethodType {
    /** 方法的参数列表 */
    params?: IParamsType[];
    /** 方法的的返回值类型（设置后积木会变为 "读取" 类型） */
    returnType?: string | Array<string>;
    /** 鼠标悬停在积木上的提示 */
    tips?: string;
    /** 方法积木的颜色 */
    color?: string;
    /** 积木在列表中与下一个积木的间隔 */
    space?: number;
    /** 积木列表中，该积木上方分割线中的文本 */
    line?: string;
    /** 积木前的 "调用" 文本，输入字符串可以自定义，布尔值可以显示或隐藏  */
    methodLabel?: string | boolean;
    /** 是否为一行积木 */
    inline?: boolean;
    /** 积木的顺序 */
    order?: number;
    /** 方法积木的图标 */
    icon?: string;
}


// 参数列表配置类型
interface IParamsType {
    /** 参数的键名 */
    key?: string;
    /** 参数的描述文本 */
    label?: string;
    /** 参数的后缀文本 */
    labelAfter?: string;
    /** 参数的默认值 */
    defaultValue?: any;
    /** 参数的类型 */
    valueType?: string | string[];
    /** 参数的下拉菜单 */
    dropdown?: object;
}
