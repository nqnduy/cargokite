import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit, createToc } from './untils';
import lenis from './vendors/lenis';

function privSetup() {
    
}

function privToc() {
    let html = $('.priv-hero__nav-toc-item').eq(0).clone();
    createToc(lenis, '.priv-hero__main-richtext','.priv-hero__nav-toc', html)
}

export default privacyScript = {
    namespace: 'privacy',
    afterEnter() {
        console.log('enter privacy')
        privSetup()
        setTimeout(() => {
            privToc()
        }, 100);
    },
    beforeLeave() {
        console.log('leave privacy')
    }
}