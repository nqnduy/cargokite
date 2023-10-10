import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from "./untils";

gsap.registerPlugin(ScrollTrigger, SplitText);
let typeOpts = {
    lines: { type: 'lines', linesClass: 'g-lines'},
    words: { type: 'words,lines', linesClass: 'g-lines'},
    chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
};
let gOpts = {
    ease: 'power2.easeOut'
}

function abtHero() {
    const abtHeroLabel = new SplitText('.abt-hero__label', typeOpts.chars);
    const abtHeroTitle = new SplitText('.abt-hero__title', typeOpts.words);

    let tl = gsap.timeline({
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            abtHeroTitle.revert();
            new SplitText('.abt-hero__title', typeOpts.lines);
            abtHeroLabel.revert();
        },
        delay: 1.2
    })
    tl
    .from(abtHeroLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    .from(abtHeroTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .03}, '<=.2')

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
    const abtInfoQuoteTxt = new SplitText('.abt-info__quote-txt', typeOpts.words);
    const abtInfoQuoteAuthor = new SplitText('.abt-info__quote-author', typeOpts.words);
    const abtInfoQuoteJob = new SplitText('.abt-info__quote-job', typeOpts.words);

    let tlQuote = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-info__quote',
            start: `top top+=${$(window).width > 767 ? 65 : 70}%`,
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            abtInfoQuoteTxt.revert()
            new SplitText('.abt-info__quote-txt', typeOpts.lines);
            abtInfoQuoteAuthor.revert()
            abtInfoQuoteJob.revert()
        },
        delay: $(window).width() > 767 ? false : 1.2
    })
    tlQuote
    .from('.abt-info__quote-icon', {yPercent: 60, autoAlpha: 0, duration: .6})
    .from(abtInfoQuoteTxt.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
    .from(abtInfoQuoteAuthor.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '>=-.2')
    .from(abtInfoQuoteJob.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')

    const abtAddItems = $('.abt-info__add-item')
    abtAddItems.each((index, el) => {
        const abtAddItemLabel = new SplitText($(el).find('.abt-info__add-item-label'), typeOpts.words);
        const abtAddItemTxt = new SplitText($(el).find('.abt-info__add-item-txt'), typeOpts.words);
        let tlAddItem = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top top+=50%',
            },
            defaults: {
                ease: gOpts.ease
            },
            onComplete: () => {
                abtAddItemLabel.revert()
                abtAddItemTxt.revert()
            }
        })
        tlAddItem
        .from(abtAddItemLabel.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
        .from(abtAddItemTxt.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
    })

    const abtInfoMemberNum = new SplitText('.abt-info__add-member-amount', typeOpts.chars);
    const abtInfoMemberLabel = new SplitText('.abt-info__add-member-label', typeOpts.words);

    const tlInfoMember = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-info__add-member-inner',
            start: 'top top+=65%',
        },
        onComplete: () => {
            abtInfoMemberNum.revert()
            abtInfoMemberLabel.revert()
        }
    })
    tlInfoMember
    .from('.abt-info__add-member-inner', {autoAlpha: 0, duration: .4})
    .from(abtInfoMemberNum.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '>=-.2')
    .from(abtInfoMemberLabel.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')

    gsap.set('.abt-info__richtext-img', {clipPath: 'inset(10%)'})
    gsap.set('.abt-info__richtext-img img', {scale: 1.4, autoAlpha: 0})
    const abtRichTextTitle = new SplitText('.abt-info__richtext-h3', typeOpts.words)
    const abtRichTextTxt = new SplitText('.abt-info__richtext-p', typeOpts.words)
    const tlInfoRichtext = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-info__richtext',
            start: 'top top+=50%'
        },
        onComplete: () => {
            abtRichTextTitle.revert()
            new SplitText('.abt-info__richtext-h3', typeOpts.lines)
            abtRichTextTxt.revert()
        }
    })
    tlInfoRichtext
    .to('.abt-info__richtext-img', { clipPath: 'inset(0%)', duration: 1, ease: 'expo.out'}, '0')
    .to('.abt-info__richtext-img img', { scale: 1, duration: 1, autoAlpha: 1, ease: 'expo.out', clearProps: 'all'}, '<=0')
    .from('.abt-info__richtext-decor', {scale: .8, autoAlpha: 0, duration: .4}, '<=.2')
    .from(abtRichTextTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
    .from(abtRichTextTxt.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .015}, '<=.2')

    const abtVisTitle = new SplitText('.abt-info__vis-title', typeOpts.chars)
    const abtVisTxt = new SplitText('.abt-info__vis-txt', typeOpts.words)
    const tlAbtVis = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-info__vis',
            start: 'top top+=65%',
        },
        onComplete: () => {
            abtVisTitle.revert()
            abtVisTxt.revert()
        }
    })
    tlAbtVis
    .from(abtVisTitle.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
    .from(abtVisTxt.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
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

    const abtMilLabel = new SplitText('.abt-mil__label', typeOpts.chars);
    const abtMilTitle = nestedLinesSplit('.abt-mil__title', typeOpts.words);
    let tlHead = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-mil__head',
            start: 'top top+=65%'
        },
        onComplete: () => {
            abtMilLabel.revert();
            new SplitText('.abt-mil__title', typeOpts.lines);
        }
    })
    tlHead
    .from(abtMilLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(abtMilTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .03}, '<=.2')
    .from('.abt-mil__progress', {yPercent: 15, autoAlpha: 0, duration: .4}, '<=.2')
}

function abtTeam() {
    const abtTeamTitle = new SplitText('.abt-team__title', typeOpts.words);
    const abtTeamTxt = new SplitText('.abt-team__richtext-p', typeOpts.words);
    const abtTeamLink = new SplitText('.abt-team__richtext-link', typeOpts.words);
    let tlHead = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-team__title',
            start: 'top top+=65%'
        },
        onComplete: () => {
            abtTeamTitle.revert();
            abtTeamTxt.revert();
            abtTeamLink.revert();
        }
    })
    requestAnimationFrame(() => {
        tlHead
        .from(abtTeamTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .03})
        .from(abtTeamTxt.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
        .from(abtTeamLink.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .03}, '>=-.2')
    })

    const abtTeamItem = $('.abt-team__main-item');
    const abtTeamImg = $('.abt-team__main-img');
    const abtTeamImgItem = $('.abt-team__main-img-item');
    const abtTeamInfo = $('.abt-team__main-img-info');
    if ($(window).width() > 991) {
        abtTeamItem.on('mouseenter', function(e) {
            e.preventDefault()
            e.stopPropagation()
            let index = $(this).index()
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
    else {
        abtTeamItem.on('click', function () {
            const info = {
                name: $(this).find('.abt-team__main-item-name').text().trim(),
                job: $(this).find('.abt-team__main-item-job').text().trim(),
                icon: $(this).find('.abt-team__main-item-icon').attr('href')
            }
            const replaceInfo = (val) => {
                if (val === 'icon') {
                    abtTeamImg.find(`.abt-team__main-img-${val}`).attr('href', info[val])
                }
                else {
                    abtTeamImg.find(`.abt-team__main-img-${val}`).html(info[val])
                }
            };
            replaceInfo('name');
            replaceInfo('job');
            replaceInfo('icon');
            gsap.set('.abt-team__main-img-inner', { y: 0 });
            gsap.from('.abt-team__main-img-inner', { y: 5 });
            abtTeamImgItem.eq($(this).index()).addClass('selected');
            abtTeamImg.addClass('active');
        })
        $('.abt-team__main-img-close').on('click', function(e){
            e.preventDefault();
            if (!abtTeamImg.hasClass('active')) return;

            gsap.set('.abt-team__main-img-inner', { y: 0 });
            gsap.to('.abt-team__main-img-inner', { y: 5 });
            abtTeamImgItem.removeClass('selected');
            abtTeamImg.removeClass('active');
        })
    }

    const tlTeamList = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-team__main-list',
            start: 'top top+=65%'
        }
    })
    tlTeamList
    .from('.abt-team__main-item', {autoAlpha: 0, duration: .8, yPercent: 25, stagger: .15, clearProps: 'all'})
}

function abtJob() {
    const abtJobLabel = new SplitText('.abt-job__label', typeOpts.chars)
    const abtJobTitle = new SplitText('.abt-job__title', typeOpts.words)
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-job__title',
            start: 'top top+=65%'
        }
    })
    tl
    .from(abtJobLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(abtJobTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .03}, '<=.2')

    const abtJobItems = $('.abt-job__main-item')
    const tlJobList = gsap.timeline({
        scrollTrigger: {
            trigger: '.abt-job__main',
            start: 'top top+=65%',
        }
    })
    requestAnimationFrame(() => {
        tlJobList
        .from(abtJobItems, {autoAlpha: 0, duration: .8, yPercent: 25, stagger: .1, clearProps: 'all'})
    })
}
const aboutScript = {
    namespace: 'about',
    afterEnter() {
        console.log('enter about')
        setTimeout(() => {
            abtHero()
            abtInfo()
            abtMiles()
            abtTeam()
            abtJob()
        }, 100);
    },
    beforeLeave() {
        console.log('leave about')
    }
}

export default aboutScript