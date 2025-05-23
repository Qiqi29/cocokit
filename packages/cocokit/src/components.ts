import { isUrl } from './utils'

// 声明 React 为外部模块
declare const React: {
    createElement: (type: any, props?: any, ...children: any[]) => any
}


/**
 * 图标组件
 * @param {boolean} show 是否显示图标
 * @param {number} size 图标大小
 * @param {string} color 覆盖图标原本的颜色
 * @param {string} code 图标代码 / 图片链接
 * @example
 * // 使用示例
 * import { Icon } from 'cocokit'
 * <Icon show={...} size={20} color="#FF0000" code="..." />
 */
export function Icon({ show=true, size, color, code, ...otherProps }: any) {
    if (!show || !code) return null

    if (isUrl(code)) {
        return React.createElement('img', { 
            className: 'qii-icon', 
            src: code, 
            style: { width: size, height: size }, 
            ...otherProps
        })
    }

    const svgData = parseSvg(code)
    return React.createElement('svg', { 
        className: 'qii-icon', 
        width: size, height: size,
        viewBox: svgData.viewBox,
        xmlns: 'http://www.w3.org/2000/svg',
        ...otherProps,
    },
    svgData.paths.map((path, index) => (
        React.createElement('path', { 
            key: index, 
            d: path.d, 
            fill: path.fill !== 'none' && color !== '' ? color : path.fill,
            opacity: path.opacity,
            fillRule: path.fillRule,
        })
    )))
}


// 解析SVG字符串
const ERROR_ICON = {
    viewBox: '0 0 24 24',
    paths: [{
        d: 'm12 13.414 5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586 6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z',
        fill: '#FF6252', opacity: '1', fillRule: '',
    }]
}
const domParser = new DOMParser()
function parseSvg(svg: string) {
    try {
        const svgElement = domParser.parseFromString(svg, 'image/svg+xml').querySelector('svg')
        if (!svgElement) return ERROR_ICON
        const gElement = svgElement.querySelector('g')  // 适配mingcute图标库
        const paths = Array.from(svgElement.querySelectorAll('path')).map(path => ({
            d: path.getAttribute('d') || '',
            fill: path.getAttribute('fill') || 'none',
            opacity: path.getAttribute('opacity') || '1',
            fillRule: gElement?.getAttribute('fill-rule') || path.getAttribute('fill-rule') || '',
        }))
        return {
            viewBox: svgElement.getAttribute('viewBox') || '',
            paths: paths.length ? paths : ERROR_ICON.paths,
        }
    }
    catch {
        return ERROR_ICON
    }
}


/**
 * 加载图标组件
 * @param {boolean} show 是否显示图标
 * @param {number} size 图标大小
 * @example
 * // 使用示例
 * import { IconLoading } from 'cocokit'
 * <IconLoading show={...} size={20} />
 */
export function IconLoading({show=true, size=20, ...props}: any) {
    if (!show) return null
    return [
        React.createElement('svg', {
            className: "qii-icon loading",
            width: size, height: size,
            viewBox: "0 0 24 24",
            xmlns: 'http://www.w3.org/2000/svg',
            ...props,
        }, [
            React.createElement('path', { 
                key: 'path1', fill: "currentColor",
                d: 'm1.9 12c0 3.6 1.9 6.2 3 7.2 0.1 0.1 0.8 0.5 1.5 0 0.6-0.7 0.2-1.4 0-1.7-1.3-1.2-2.3-3.1-2.3-5.5 0-2.4 1-4.3 2.2-5.5 0.2-0.1 0.8-0.9 0.1-1.7-0.7-0.5-1.3-0.2-1.5 0-1 1-3 3.6-3 7.2z' 
            }),
            React.createElement('path', { 
                key: 'path2', fill: "currentColor", opacity: "0.2",
                d: 'm12 1.9c5.6 0 10.1 4.5 10.1 10.1 0 5.6-4.5 10.1-10.1 10.1-5.6 0-10.1-4.5-10.1-10.1 0-5.6 4.5-10.1 10.1-10.1zm-7.9 10.1c0 4.3 3.6 7.9 7.9 7.9 4.3 0 7.9-3.6 7.9-7.9 0-4.3-3.6-7.9-7.9-7.9-4.3 0-7.9 3.6-7.9 7.9zz' 
            })
        ]),
        React.createElement('style', {
            key: 'style',
            dangerouslySetInnerHTML: { __html: `
                .qii-icon.loading {
                    animation: icon-spin 0.8s infinite linear;
                }
                @keyframes icon-spin {
                    0% { transform: rotate(0deg) }
                    100% { transform: rotate(360deg) }
                }
            `}
        })
    ]
}