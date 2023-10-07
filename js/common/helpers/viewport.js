
let viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
}
const device = { lg: 1727, md: 991, sm: 767, xs: 476  }

const useRem = (vw, maxWidth) => {
    vw = viewport.width < maxWidth ? (vw * viewport.width) / 1000 : vw / 10;

    return (value) => Number((value * vw).toFixed(2));
};

/**
 * @param {Object} options - [viewport break]:
 * { md: (>991), sm: (<992), xs: (<768) }.
 */

const viewportBreak = (options) => {
    const { md, sm, xs } = options;
    let result;
    switch (true) {
        case viewport.width <= device.sm:
            result = xs;
            break;
        case viewport.width <= device.md:
            result = sm;
            break;
        case viewport.width <= device.lg:
            result = md;
            break;
        default:
            result = md;
            break;
    }
    return (result instanceof Function) ? result() : result;
}

const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

export { useRem, viewportBreak, viewport, isTouchDevice };