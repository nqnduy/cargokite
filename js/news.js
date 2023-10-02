import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

let typeOpts = {
    lines: { type: 'lines', linesClass: 'g-lines'},
    words: { type: 'words,lines', linesClass: 'g-lines'},
    chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
};
let gOpts = {
    ease: 'power2.easeOut'
}

function newsHero() {
    const newsHeroTitle = new SplitText('.news-hero__title', typeOpts.words)
    const tl = gsap.timeline({
        delay: 1.4,
    })
    tl
    .from(newsHeroTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
    .from('.news-hero__logo-default', {autoAlpha: 0, duration: .6, clearProps: 'all'}, '<=.2')

    const newsHeroItems = $('.news-hero__main-item')
    gsap.set('.news-hero__main', {pointerEvents: 'none'})
    newsHeroItems.each((index, el) => {
        if (index >= 3) return
        const newsHeroItemLabel = new SplitText(el.querySelector('.news-hero__main-item-label'), typeOpts.chars)
        const newsHeroItemTitle = new SplitText(el.querySelector('.news-hero__main-item-title'), typeOpts.words)
        const newsHeroItemSite = new SplitText(el.querySelector('.news-hero__main-item-site'), typeOpts.words)
        const newsHeroItemYear = new SplitText(el.querySelector('.news-hero__main-item-year'), typeOpts.chars)
        const tlItem = gsap.timeline({
            delay: (index * .4) + 1.6,
            onComplete: () => {
                newsHeroItemLabel.revert()
                newsHeroItemTitle.revert()
                new SplitText(el.querySelector('.news-hero__main-item-title'), typeOpts.lines)
                newsHeroItemSite.revert()
                newsHeroItemYear.revert()
                gsap.set('.news-hero__main', {clearProps: 'all'})
            }
        })
        tlItem
        .from(newsHeroItemLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .3, stagger: .01})
        .from(newsHeroItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
        .from(newsHeroItemYear.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
        .from(newsHeroItemSite.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
    })
}

function newsHeroInteraction() {
    let newsHeroItem = $('.news-hero__main-item')
    newsHeroItem.on('mouseenter', function(e) {
        e.preventDefault();
        let index = $(this).index();
        $('.news-hero__logo-default-item').removeClass('active')
        $('.news-hero__logo-ex-item').eq(index).addClass('active')
    })
    newsHeroItem.on('mouseleave', function(e) {
        e.preventDefault()
        $('.news-hero__logo-ex-item').removeClass('active')
        $('.news-hero__logo-default-item').addClass('active')
    })
    $('.news-hero__logo-default-item').addClass('active')   
}
function newsMainInteraction() {
    $('.news-hero__load-btn').on('click', function(e) {
        e.preventDefault();
        //Demo function
        let newItems = $('.news-hero__main').children().clone().css('display', 'none')
        console.log(newItems)
        newItems.appendTo('.news-hero__main')
        newItems.slideDown()
        $(this).addClass('disable')
    })
}

const newsScript = {
    namespace: 'news',
    afterEnter() {
        console.log('enter news')
        setTimeout(() => {
            newsHero()

            newsHeroInteraction()
            newsMainInteraction()
        }, 100);
    },
    beforeLeave() {
        console.log('leave news')
    }
}

export default newsScript