import PopupComponent from "./components/popup";
import LoaderComponent from "./components/loader";
import HeaderComponent from "./components/header";
import FooterComponent from "./components/footer";

import $ from "jquery";
import lenis from './vendors/lenis';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";

import homeScript from './home';
import aboutScript from './about';
import techScript from './tech';
import newsScript from './news';
import privacyScript from './privacy';

let CompArr = [PopupComponent, LoaderComponent, FooterComponent, HeaderComponent]
if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
}

barba.use(barbaPrefetch);
gsap.registerPlugin(ScrollTrigger, SplitText);

function debounce(func, delay = 100){
    let timer;
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, delay, event);
    };
}

function refreshOnBreakpoint() {
    let initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;
    // portrait mobile viewport initial, any change refresh
    if (initialViewportWidth < 480) {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth > 479) {
                location.reload();
            }
        }))
    }
    // landscape mobile viewport initial, any change refresh
    else if (initialViewportWidth < 768) {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth > 767) {
                location.reload();
            }
        }))
    }
    // tablet viewport initial, any change refresh
    else if (initialViewportWidth > 767 && initialViewportWidth < 992)  {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth < 768 || newViewportWidth > 991) {
                location.reload();
            }
        }))
    }
    // web viewport initial, any change refresh
    else if (initialViewportWidth > 991) {
        $(window).on('resize', debounce(function() {
            newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if (newViewportWidth < 992) {
                location.reload();
            }
        }))
    }
}
refreshOnBreakpoint();

//Header
const header = $('.header')
const hamburger = $('.header__toggle');
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
hamburger.on('click', function (e) {
    e.preventDefault();
    if (header.hasClass('open-nav')) {
        header.removeClass('open-nav');
        lenis.start();
    }
    else {
        header.addClass('open-nav');
        lenis.stop();
    }
})


function transitionOnce() {
    resetScroll()
    gsap.set('.trans__item', {transformOrigin: 'bottom', scaleY: 1})
    let tl = gsap.timeline({
    })
    tl
    .to('.trans__item', {delay: .4, scaleY: 0, duration: 1, stagger: {
        each: '.1',
    }, ease: "expo.in"}, 0)
    .to('.trans__logo', {rotateZ: '-7deg', autoAlpha: 0, duration: .6, yPercent: 30, ease: 'power2.in'}, '<=.4')
}

function transitionLeave(data) {
    console.log('leaveTrans')
    gsap.set(data.next.container, {display: 'none'})
    gsap.set('.trans__item', {
        transformOrigin: 'top',
        scaleY: 0
    })
    gsap.set('.trans__logo', {rotateZ: '7deg', autoAlpha: 0, yPercent: -40, ease: 'power2.out'})
    let tl = gsap.timeline({
        onComplete: () => {
            addNavActiveLink(data)
            gsap.set(data.next.container, { clearProps: 'display' })
            header.removeClass('open-nav');
            lenis.start();
        }
    })
    tl
    .to('.trans__item', {scaleY: 1, duration: 1, stagger: {
        each: '.1',
    }, ease: "expo.out"}, 0)
    .to('.trans__logo', {rotateZ: '0deg', autoAlpha: 1, duration: .6, yPercent: 0}, '>=-.8.5')

    return tl
}

function transitionEnter(data) {
    resetScroll()
    console.log('enterTrans')
    gsap.set(data.current.container, {opacity: 0, display: 'none'})

    gsap.set('.trans__item', {transformOrigin: 'bottom', scaleY: 1})
    let tl = gsap.timeline({
        delay: .5,
    })
    tl
    .to('.trans__item', {scaleY: 0, duration: 1, stagger: {
        each: '.1',
    }, ease: "expo.in"}, 0)
    .to('.trans__logo', {rotateZ: '-7deg', autoAlpha: 0, duration: .6, yPercent: 30, ease: 'power2.in'}, '<=.4')
    return tl
}

function addNavActiveLink(data) {
    header.removeClass('dark-mode')
    header.removeClass('mix-mode')
    if ($(data.next.container).attr('data-header') == 'dark') {
        header.addClass('dark-mode')
    } else if ($(data.next.container).attr('data-header') == 'mix') {
        header.addClass('mix-mode')
    }

    $('.header__link, .footer__link, .header__nav-item').removeClass('active')
    $(`.header__link[data-link="${data.next.namespace}"]`).addClass('active')
    $(`.footer__link[data-link="${data.next.namespace}"]`).addClass('active')
    $(`.header__nav-item[data-link="${data.next.namespace}"]`).addClass('active');
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
    let locationHash = window.location.hash;
    lenis.stop()
    if ($(locationHash).length) {
        console.log(locationHash)
        lenis.scrollTo(locationHash, {
            force: true,
            immediate: true,
        });
    } else {
        lenis.scrollTo(0, {
            force: true,
            immediate: true,
        });
    }
    lenis.start()
}
function handleScrollTo() {
    $('[data-scrollto]').on('click', function(e) {
        e.preventDefault();
        let target = $(this).attr('href')
        lenis.scrollTo(target)
    })
}
const handlePopup = {
    toggle: () => {
        $('[data-popup="contact"]').on('click', function(e) {
            e.preventDefault()
            $('.popup').addClass('active')
            lenis.stop()
        })
        $('[data-popup="close"]').on('click', function(e) {
            e.preventDefault()
            $('.popup').removeClass('active')
            lenis.start()
        })
    }
}
const VIEWS = [
    homeScript,
    aboutScript,
    newsScript,
    privacyScript,
    techScript
]

barba.init({
    preventRunning: true,
    transitions: [{
        name: 'opacity-transition',
        sync: true,
        once(data) {
            addNavActiveLink(data)
            handleScrollTo()
            transitionOnce(data)
            handlePopup.toggle()
        },
        async enter(data) {

        },
        async afterEnter(data) {
            await transitionEnter(data)
            handleScrollTo()
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
