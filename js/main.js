import $ from "jquery";
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

import homeScript from './home';
import aboutScript from './about';
import newsScript from './news';
import newsScript from './privacy';
import lenis from './vendors/lenis';

barba.use(barbaPrefetch);
gsap.registerPlugin(ScrollTrigger, SplitText); 

//Header
const header = $('.header')
lenis.on('scroll', function(inst) {
    if (inst.scroll > header.height()) {
        header.addClass('on-scroll')
        if (inst.direction == 1) {
            // down
            header.addClass('on-hide')
        } else if (inst.direction == -1) {
            // up
            header.removeClass('on-hide')
        }
    } else {
        header.removeClass('on-scroll on-hide')
    };
})

function transitionOnce() {
    resetScroll()
    gsap.set('.trans__item', {transformOrigin: 'bottom', scaleY: 1})
    let tl = gsap.timeline({
        delay: .6,
    })
    tl
    .to('.trans__item', {scaleY: 0, duration: 1, stagger: {
        each: '.1',
    }}, 0)
}

function transitionLeave(data) {
    console.log('leaveTrans')
    gsap.set('.trans__item', {
        transformOrigin: 'top',
        scaleY: 0
    })
    let tl = gsap.timeline({
        onComplete: () => {
            addNavActiveLink(data)
        }
    })
    tl
    .to('.trans__item', {scaleY: 1, duration: 1, stagger: {
        each: '.1',
    }, ease: 'Power1.inOut'}, 0)

    return tl
}

function transitionEnter(data) {
    resetScroll()
    console.log('enterTrans')
    gsap.set(data.current.container, {opacity: 0, display: 'none'})

    gsap.set('.trans__item', {transformOrigin: 'bottom', scaleY: 1})
    let tl = gsap.timeline({
        delay: .3,
    })
    tl
    .to('.trans__item', {scaleY: 0, duration: 1, stagger: {
        each: '.1',
    }}, 0)
    return tl
}

function addNavActiveLink(data) {
    if ($(data.next.container).attr('data-header') == 'dark') {
        header.addClass('dark-mode')
    } else if ($(data.next.container).attr('data-header') == 'mix') {
        header.addClass('mix-mode')
    } else {
        header.removeClass('dark-mode')
        header.removeClass('mix-mode')
    }
    
    $('.header__link, .footer__link').removeClass('active')
    $(`.header__link[data-link="${data.next.namespace}"]`).addClass('active')
    $(`.footer__link[data-link="${data.next.namespace}"]`).addClass('active')
}

function removeAllScrollTrigger() {
    console.log('remove scroll trigger')
    let triggers = ScrollTrigger.getAll();
    triggers.forEach(trigger => {
        trigger.kill();
    });
}
function resetBeforeLeave(data) {
    console.log('reset')
    addNavActiveLink(data);
}
function resetScroll() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
    });
}
const VIEWS = [
    homeScript,
    aboutScript,
    newsScript
]

if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
}

barba.init({
    preventRunning: true,
    transitions: [{
        name: 'opacity-transition',
        sync: true,
        once(data) {
            addNavActiveLink(data)
            transitionOnce(data)
        },
        async enter(data) {
            
        },
        async afterEnter(data) {
            await transitionEnter(data)
        },
        async beforeLeave(data) {
            resetBeforeLeave(data)
        },
        async leave(data) {
            await transitionLeave(data).then(() => {
                removeAllScrollTrigger()
            })
        },
        async afterLeave(data) {
        }
    }],
    views: VIEWS
})
