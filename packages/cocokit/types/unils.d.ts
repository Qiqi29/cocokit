/**
 * 积木颜色
 */
export declare const Color: {
    // 自定义颜色
    blue: string;
    blue_light: string;
    green: string;
    yellow: string;
    pink: string;
    // 官方颜色
    event: string;
    control: string;
    feature: string;
    calc: string;
    variable: string;
    array: string;
    object: string;
    function: string;
    props: string;
}

/**
 * 属性类型
 */
export declare const VType: {
    string: string;
    number: string;
    boolean: string;
    color: string;
    array: Array<string>;
    object: Array<string>;
    any: Array<string>;
}

/**
 * 编辑器类型
 */
export declare const EType: {
    TextArea: string;
    Option: string;
    Slider: string;
    TextGroup: string;
    ButtonGroup: string;
    Align: string;
    HorAlign: string;
    VerAlign: string;
    Direction: string;
    RichText: string;
    AudioVolume: string;
    AudioRate: string;
    HttpHeader: string;
}



/**
 * 获取值的类型
 * @param value 要检查的值
 */
export declare function getType(value: any): string | Array<string>;


/**
 * 判断字符串是否为一个颜色值
 * @param string 要检查的字符串
 */
export declare function isColor(string: string): boolean;


/**
 * 验证字符串是否为 URL
 * @param string 要检查的字符串
 */
export declare function isUrl(string: string): boolean;


/**
 * 将字符串中的 `\\n` 替换为 `\n`
 * @param content 要处理的字符串
 */
export declare function replaceNewline(content: string): string;


/**
 * 控件日志输出
 */
export declare class WiegetLog {
    private timeMeasurements;
    /**
     * 替换数据中的对象为字符串
     * @private
     * @param args 要处理的数据
     */
    private replaceData;
    /**
     * 打印信息
     * @param thisWidget 当前组件实例（传入 this）
     * @param args 日志参数
     */
    info(thisWidget: any, ...args: any[]): void;
    /**
     * 打印警告信息
     * @param thisWidget 当前组件实例（传入 this）
     * @param args 日志参数
     */
    warn(thisWidget: any, ...args: any[]): void;
    /**
     * 打印错误信息
     * @param thisWidget 当前组件实例（传入 this）
     * @param args 日志参数
     */
    error(thisWidget: any, ...args: any[]): void;
}