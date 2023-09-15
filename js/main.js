import HeaderComponent from "./components/header";
import Lenis from '@studio-freight/lenis';
import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger); 
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

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

//Home
function calculate() {
    if ($(window).width() - $('.container').width() >= 0) {
        let scalefactor = $(window).width()/$('.container').width()
        console.log(scalefactor)
        $('.home-tech__bg-tri-inner').css('transform', `translate(-50%, -50%) scale(${scalefactor})`)
    }
    console.log($('.container').outerWidth())
}
calculate()
$(window).on('resize', function(e) {
    calculate()
})

let typeOpts = { types: 'lines, chars, words', splitClass: 'typejs' };
let gOpts = {
    ease: 'power2.easeOut'
}
function homeHero() {
    const homeHeroTitle = new SplitType('.home-hero__title', typeOpts);
    const homeHeroLabel = new SplitType('.home-hero__backer-label', typeOpts);
    const homeHeroBacker = $('.home-hero__backer-item')
    const homeHeroSub = new SplitType('.home-hero__sub-txt', {types: 'words, lines', splitClass: 'typejs'});
    const homeHeroCaption = new SplitType('.home-hero__sub-caption', typeOpts);
    

    let tl = gsap.timeline({
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            SplitType.revert('.home-hero__title');
            SplitType.revert('.home-hero__backer-label');
            SplitType.revert('.home-hero__sub-caption');
            $('.home-hero__sub-caption-item').addClass('anim')
        }
    })
    tl
    .from(homeHeroTitle.chars, {yPercent: 60, autoAlpha: 0, duration: 1, stagger: .02})
    .from(homeHeroLabel.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    .from(homeHeroBacker, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .1}, '<=.2')
    .from(homeHeroSub.words, {yPercent: 60, autoAlpha: 0, duration: .7, stagger: .02}, '<=.2')
    .from(homeHeroCaption.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    
    let tlScrub = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: .4
        }
    })
    tlScrub
    .to('.home-hero', {backgroundPositionY: '-150%', ease: 'none'})
    .to('.home-hero__title', {yPercent: 25, ease: 'none'}, '0')
    .to('.home-hero__sub', {yPercent: -25, ease: 'none'}, '0')

}
homeHero()

function homeIntro() {
    const homeIntroLabel = new SplitType('.home-intro__label', typeOpts)
    const homeIntroTitle = new SplitType('.home-intro__title', {types: 'words, lines', splitClass: 'typejs'})
    const homeIntroRichh3 = new SplitType('.home-intro__richtext-h3', { types: 'lines, words', splitClass: 'typejs' })
    const homeIntroRichp = new SplitType('.home-intro__richtext-p', { types: 'lines, words', splitClass: 'typejs' })
    const homeIntroRichlink = new SplitType('.home-intro__richtext-link', { types: 'lines, words', splitClass: 'typejs' })

    gsap.set('.home-intro__richtext-img, .home-intro__img', {clipPath: 'inset(10%)'})
    gsap.set('.home-intro__richtext-img img, .home-intro__img img', {scale: 1.4, autoAlpha: 0})

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-intro',
            start: 'top top+=50%',
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            SplitType.revert('.home-intro__label')
            SplitType.revert('.home-intro__title')
            SplitType.revert('.home-intro__richtext-h3')
            SplitType.revert('.home-intro__richtext-p')
            SplitType.revert('.home-intro__richtext-link')
        }
    })
    tl
    .from(homeIntroLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(homeIntroTitle.words, {yPercent: 60, autoAlpha: 0, duration: 1, stagger: .1}, '<=0')
    .to('.home-intro__img', { clipPath: 'inset(0%)', duration: 1.4, ease: 'expo.out'}, '<=.4')
    .to('.home-intro__img img', { scale: 1, duration: 1.4, autoAlpha: 1, ease: 'expo.out', clearProps: 'all'}, '<=0')
    .to('.home-intro__richtext-img', { clipPath: 'inset(0%)', duration: 1.4, ease: 'expo.out'}, '0')
    .to('.home-intro__richtext-img img', { scale: 1, duration: 1.4, autoAlpha: 1, ease: 'expo.out', clearProps: 'all'}, '<=0')
    .from(homeIntroRichh3.words, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .02}, '<=.2')
    .from(homeIntroRichp.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    .from(homeIntroRichlink.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '>=-.2')

    let tlScrub = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-intro__richtext',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    })
    tlScrub.fromTo('.home-intro__richtext', {yPercent: -7}, { yPercent: 7, ease: 'none'})

    let tlScrubImg = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-intro__img',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    })
    tlScrubImg.fromTo('.home-intro__img', {yPercent: 15}, { yPercent: -15, ease: 'none'})
}
homeIntro()

function homeProb() {
    const homeProbLabel = new SplitType('.home-prob__label', typeOpts)
    const homeProbTitle = new SplitType('.home-prob__title', {types: 'words, lines', splitClass: 'typejs'})

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-prob',
            start: 'top top+=50%',
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            SplitType.revert('.home-prob__label')
            SplitType.revert('.home-prob__title')
        }
    })
    tl
    .from(homeProbLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(homeProbTitle.words, {yPercent: 60, autoAlpha: 0, duration: 1, stagger: .1}, '<=0')

    const homeProbItems = $('.home-prob__main-item')
    homeProbItems.each((index, el) => {
        gsap.set(el.querySelector('.home-prob__main-item-img'), {clipPath: 'inset(20%)'})
        gsap.set(el.querySelector('.home-prob__main-item-img img'), {scale: 1.4, autoAlpha: 0})
        const homeProbItemTitle = new SplitType(el.querySelector('.home-prob__main-item-title'), {types: 'words, lines', splitClass: 'typejs'})
        const homeProbItemSub = new SplitType(el.querySelector('.home-prob__main-item-txt'), {types: 'words, lines', splitClass: 'typejs'})
        const homeProbItemTl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top top+=50%',
            },
            onComplete: () => {
                SplitType.revert(el.querySelector('.home-prob__main-item-title'))
                SplitType.revert(el.querySelector('.home-prob__main-item-txt'))
            }
        })
        homeProbItemTl
        .to(el.querySelector('.home-prob__main-item-img'), { clipPath: 'inset(0%)', duration: 1.4, ease: 'expo.out'})
        .to(el.querySelector('.home-prob__main-item-img img'), { scale: 1, duration: 1.4, autoAlpha: 1, ease: 'expo.out', clearProps: 'all'}, '0')
        .from(homeProbItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
        .from(homeProbItemSub.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')

        const homeProbItemTlScrub = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        })
        let dir = index % 2 == 0 ? 1 : -1;
        homeProbItemTlScrub
        .fromTo(el, {yPercent: 10 * dir}, { yPercent: -10 * dir, ease: 'none'})
    })
}
homeProb()

function homeSolu() {
    const homeSoluLabel = new SplitType('.home-solu__label', typeOpts)
    const homeSoluTitle = new SplitType('.home-solu__title', {types: 'words, lines', splitClass: 'typejs'})

    gsap.set('.home-solu .p-line-top, .home-solu .p-line-bottom', {transformOrigin: 'center top'})

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-solu__head',
            start: 'top top+=50%',
            onComplete: () => {
                SplitType.revert('.home-solu__label')
                SplitType.revert('.home-solu__title')
            }
        }
    })
    tl
    .from('.home-solu__head-img-wrap', {yPercent: 45, autoAlpha: 0, duration: 1.2, ease: 'power2.easeInOut'}, 0)
    .from(homeSoluLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    .from(homeSoluTitle.words, {yPercent: 60, autoAlpha: 0, duration: 1, stagger: .1}, '<=.2')
    .from('.home-solu .p-line-top', {autoAlpha: 0, scaleY: 0, duration: .6 })
    .from('.home-solu .p-line-bottom', {autoAlpha: 0, scaleY: 0, duration: .8 }, '>=.4')

    let tlScrub = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-solu__head',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    })
    tlScrub
    .fromTo('.home-solu__head-txt-wrap', {yPercent: 14}, { yPercent: -6, ease: 'none'})


    const homeSoluBody = new SplitType('.home-solu__body-txt', {types: 'words, lines, chars', splitClass: 'typejs'});

    let tlScrubText = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-solu__body',
            start: 'top top+=75%',
            end: 'bottom top+=65%',
            scrub: .6,
        }
    })
    tlScrubText
    .from(homeSoluBody.chars, {color: '#B8B8B8', duration: .1, stagger: 0.02, ease: 'power1.out'}, '0')

    const homeSoluItems = $('.home-solu__main-item')
    homeSoluItems.each((index, el) => {
        const homeSoluItemTitle = new SplitType(el.querySelector('.home-solu__main-item-title'), {types: 'words, lines', splitClass: 'typejs'})
        const homeSoluItemSub = new SplitType(el.querySelector('.home-solu__main-item-txt'), {types: 'words, lines', splitClass: 'typejs'})
        const homeSoluItemTl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top top+=50%',
            },
            onComplete: () => {
                SplitType.revert(el.querySelector('.home-solu__main-item-title'))
                SplitType.revert(el.querySelector('.home-solu__main-item-txt'))
            }
        })
        homeSoluItemTl
        .from(homeSoluItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02, delay: index % 2 == 1 ? .3 : 0})
        .from(homeSoluItemSub.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    })

    let tlImg = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-solu__main-img-wrap',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    })
    tlImg.fromTo('.home-solu__main-img-wrap img', {yPercent: 10}, {yPercent: -10, ease: 'none'})

    let tlImgBg = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-solu__bg-img',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    })
    tlImgBg.fromTo('.home-solu__bg-img img', {objectPosition: '50% 0%'}, {objectPosition: '50% 100%', ease: 'none'})

    let tlBtn = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-solu__main-btn',
            start: 'top top+=75%',
        }
    })
    tlBtn.from('.home-solu__main-btn', {yPercent: 100, autoAlpha: 0, duration: .6, ease: 'none'})
}
homeSolu()

function homeTech() {
    const homeTechLabel = new SplitType('.home-tech__label', typeOpts)
    const homeTechTitle = new SplitType('.home-tech__title', {types: 'lines, words', splitClass: 'typejs'});
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-tech__head',
            start: 'top top+=50%',
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            SplitType.revert('.home-tech__label')
            SplitType.revert('.home-tech__title')
        }
    })
    tl
    .from(homeTechLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(homeTechTitle.words, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .08}, '<=.2')

    const homeTechItems = $('.home-tech__item');
    homeTechItems.each((index, el) => {
        let tlHomeTechItem = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top top+=65%'
            }
        })
        tlHomeTechItem
        .from(el, {autoAlpha: 0, duration: 1, delay: index == 0 ? 0 : index % 2 == 0 ? .3 : 0})
    })

    let tlShip = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-tech__ship',
            start: 'top bottom+=25%',
            end: 'bottom top',
            scrub: true,
        }
    })
    tlShip.from('.home-tech__ship img', {xPercent: 55, yPercent: -35, ease: 'none'})
}
homeTech()

function homeWhy() {
    const homeWhyLabel = new SplitType('.home-why__label', typeOpts)
    const homeWhyTitle = new SplitType('.home-why__title', {types: 'lines, words', splitClass: 'typejs'});
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-why__head',
            start: 'top top+=50%',
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            SplitType.revert('.home-why__label')
            SplitType.revert('.home-why__title')
        }
    })
    tl
    .from(homeWhyLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(homeWhyTitle.words, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .08}, '<=.2')
    .from('.home-why__btn', {yPercent: 60, autoAlpha: 0, duration: .6}, '>=-.2')

    const homeWhyItems = $('.home-why__main-item');
    homeWhyItems.each((index, el) => {
        let tlHomeWhyItem = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top top+=65%'
            }
        })
        tlHomeWhyItem
        .from(el, {autoAlpha: 0, duration: 1, delay: index == 0 ? 0 : index % 2 == 0 ? .3 : 0})
    })

    const tlHead = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-why__head',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    })
    tlHead
    .fromTo('.home-why__head', {yPercent: -10}, {yPercent: 25, ease: 'none'})
}
homeWhy()

function homePart() {
    const homePartLabel = new SplitType('.home-part__label', typeOpts)
    const homePartTitle = new SplitType('.home-part__title', {types: 'lines, words', splitClass: 'typejs'});
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-part__head',
            start: 'top top+=65%',
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            SplitType.revert('.home-part__label')
            SplitType.revert('.home-part__title')
        }
    })
    tl
    .from(homePartLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(homePartTitle.words, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .08}, '<=.2')

    let tlItems = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-part__main',
            start: 'top top+=65%',
        }
    })
    tlItems
    .from('.home-part__main-item', {autoAlpha: 0, duration: .8, yPercent: 25, stagger: .08, clearProps: 'all'})
}
homePart()

function homeFaq() {
    const homeFaqTitle = new SplitType('.home-faq__title', {types: 'lines, words', splitClass: 'typejs'});
    const homeFaqSub = new SplitType('.home-faq__sub', {types: 'lines, words', splitClass: 'typejs'});
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-faq__head',
            start: 'top top+=55%',
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            SplitType.revert('.home-faq__label')
            SplitType.revert('.home-faq__title')
        }
    })
    tl
    .from(homeFaqTitle.words, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .08})
    .from(homeFaqSub.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .06}, '<=.6')
    .from('.home-faq__link', {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .08}, '<=.2')

    const tlHead = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-faq__head',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    })
    tlHead
    .fromTo('.home-faq__head', {yPercent: 0}, {yPercent: 30, ease: 'none'})

    let tlItems = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-faq__main',
            start: 'top top+=55%',
        }
    })
    tlItems
    .from('.home-faq__main .faq-item', {autoAlpha: 0, duration: 1, yPercent: 25, stagger: .2, clearProps: 'all'})

}
homeFaq()


let homeTechItems = $('.home-tech__item');
homeTechItems.on('mouseenter', function(e) {
    e.preventDefault()
    $('.home-tech__item-sub').slideUp({duration: 300})
    $(this).find('.home-tech__item-sub').slideDown({duration: 300})
})
homeTechItems.on('mouseleave', function(e) {
    e.preventDefault()
    $('.home-tech__item-sub').slideUp({duration: 300})
})

let homeWhyItems = $('.home-why__main-item');
homeWhyItems.on('mouseenter', function(e) {
    e.preventDefault()
    $('.home-why__main-item-sub').slideUp({duration: 300})
    $(this).find('.home-why__main-item-sub').slideDown({duration: 300})
})
homeWhyItems.on('mouseleave', function(e) {
    e.preventDefault()
    $('.home-why__main-item-sub').slideUp({duration: 300})
})

let homeFaqItem = $('.faq-item__head');
homeFaqItem.on('click', function(e) {
    e.preventDefault();
    if ($(this).parent().hasClass('active')) {
        console.log(true)
        homeFaqItem.parent().removeClass('active')
        $('.faq-item__body .txt').slideUp()
    } else {
        homeFaqItem.parent().removeClass('active')
        $('.faq-item__body .txt').slideUp()
        $(this).parent().addClass('active')
        $(this).parent().find('.faq-item__body .txt').slideDown()
    }
})
