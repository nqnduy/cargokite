import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

let typeOpts = { types: 'lines, chars, words'};
let gOpts = {
    ease: 'power2.easeOut'
}

function abtHero() {
    const abtHeroLabel = new SplitText('.abt-hero__label', typeOpts);
    const abtHeroTitle = new SplitText('.abt-hero__title', typeOpts);

    let tl = gsap.timeline({
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            abtHeroTitle.revert();
            abtHeroLabel.revert();
        },
        delay: 1
    })
    tl
    .from(abtHeroLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    .from(abtHeroTitle.words, {yPercent: 60, autoAlpha: 0, duration: 1, stagger: .1}, '<=.2')
    
    let tlScrub = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    })
    tlScrub
    .to('.abt-hero__title', {yPercent: 25, ease: 'none'}, '0')
    .to('.abt-hero__label', {yPercent: 25, ease: 'none'}, '0')
}
function abtInfo() {
    
}

function abtMiles() {
    //Setup
    let scrollDistance = ($('.abt-mil__main-item').length + .7) * 50;
    let shipDistance = $('.abt-mil__ship').height() / 2 + $('.abt-mil__ship img').height() / 10
    gsap.set('.abt-mil__ship-img', {y: -shipDistance})

    let tlShip = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-mil__wrap',
            start: 'top bottom',
            end: `bottom top-=${scrollDistance}%`,
            scrub: true
        }
    })
    tlShip
    .to('.abt-mil__ship-img', {y: shipDistance + $(window).height() * .35, ease: 'none'})
    //.from('.abt-mil__head', {yPercent: 20}, {yPercent: -20, ease: 'none'}, 0)

    let mainDistance = $('.abt-mil__main-inner').height() - $(window).height() * .3;
    let tlMain = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-mil__wrap',
            start: 'top top',
            end: `top top-=${scrollDistance}%`,
            scrub: true, 
            pin: '.abt-mil-pin-container',
        }
    })
    tlMain
    .to('.abt-mil__main-inner', {y: -mainDistance, ease: 'none'})
    .to('.abt-mil__progress-dot', {top: '100%', ease: 'none'}, 0)
}

function abtTeam() {
    const abtTeamItem = $('.abt-team__main-item');
    const abtTeamImgItem = $('.abt-team__main-img-item'); 
    $('.abt-team__main-img-item').eq(0).addClass('active');
    abtTeamItem.on('mouseenter', function(e) {
        e.preventDefault()
        e.stopPropagation()
        let index = $(this).index()
        //gsap.to('.abt-team__main-img-inner', {yPercent: -index * (100 / abtTeamItem.length), duration: .6, ease: 'power2'})
        abtTeamImgItem.removeClass('active')
        abtTeamImgItem.eq(index).addClass('active')
    })
    abtTeamItem.on('mouseleave', function(e) {
        e.preventDefault()
        e.stopPropagation();
        abtTeamImgItem.removeClass('active')
    })

    const tlTeamImg = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-team__main-list',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    })
    tlTeamImg
    .to('.abt-team__main-img', {yPercent: 35, ease: 'none'})
}

export default aboutScript = {
    namespace: 'about',
    afterEnter() {
        console.log('enter about')
        setTimeout(() => {
            abtHero()
            abtMiles()
            abtTeam()
        }, 100);
    },
    beforeLeave() {
        console.log('leave about')
    }
}