import $ from "jquery";
import gsap from "gsap";
import SplitText from "./vendors/SplitText";
import { createToc } from './untils';
import lenis from './vendors/lenis';

let typeOpts = {
    lines: { type: 'lines', linesClass: 'g-lines'},
    words: { type: 'words,lines', linesClass: 'g-lines'},
    chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
};
let gOpts = {
    ease: 'power2.easeOut'
}

function privHero() {
    const newsPrivTitle = new SplitText('.priv-hero__title', typeOpts.words)
    const tl = gsap.timeline({
        delay: 1.4,
    })
    tl
    .from(newsPrivTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
    .from('.priv-hero__nav-inner', {autoAlpha: 0, duration: .6}, '0')
    .from('.priv-hero__main-richtext', {autoAlpha: 0, duration: .6}, '<=.2')
}

function privToc() {
    let html = $('.priv-hero__nav-toc-item').eq(0).clone();
    createToc(lenis, '.priv-hero__main-richtext','.priv-hero__nav-toc', html)
}
function removeRichtextContent(data) {
    $(data.current.container).find('.priv-hero__main-richtext > *').remove()
}

const privacyScript = {
    namespace: 'privacy',
    afterEnter() {
        console.log('enter privacy')
        privHero()
        setTimeout(() => {
            privToc()
        }, 100);
    },
    beforeLeave(data) {
        removeRichtextContent(data)
        console.log('leave privacy')
        
    }
}
export default privacyScript