import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';
import lenis from './vendors/lenis';

function createToc(lenis, richtextEl, tocEl, htmlTemplate) {
    let headings = $(richtextEl).find('h2');
    let tocWrap = $(tocEl);
    let tocItem = htmlTemplate.attr('class')

    if (headings.length <= 1) {
        tocWrap.parent().remove();
    }

    tocWrap.html('');
    for (let i = 0; i < headings.length; i++) {
        headings.eq(i).attr('id', `toc-${i}`);
        let tocItem = htmlTemplate.clone();

        let tocOrdinal = i + 1 < 10 ? `0${i + 1}` : i + 1;
        let [ordinal, ...[title]] = headings.eq(i).text().split('. ');
        tocItem.find('[data-toc="number"]').text(tocOrdinal);
        tocItem.find('[data-toc="title"]').text(title);
        tocItem.attr('href',`#toc-${i}`)
        tocWrap.append(tocItem);
    }
    //mobile
    // $('.toc-head-txt').eq(index).text($('.toc-item-link[href="#toc-0"]').text());

    lenis.on('scroll', function (e) {
        let currScroll = e.scroll;
        for (let i = 0; i < headings.length; i++) {
            let top = headings.eq(i).get(0).getBoundingClientRect().top;
            if (top > 0 && top < ($(window).height() / 5)) {
                $(`.${tocItem}[href="#toc-${i}"]`).addClass('active');
                $(`.${tocItem}`).not(`[href="#toc-${i}"]`).removeClass('active');
                //mobile
                // $('.toc-head-txt').eq(index).text($(`.toc-item-link[href="#toc-${i}"]`).text());
            }
        }
    });

    $(`.${tocItem}`).on('click', function (e) {
        e.preventDefault();
        let target = $(this).attr("href");
        console.log($(this).attr)
        lenis.scrollTo(target, {
            offset: -100,
        })

        //history.replaceState({}, '', `${window.location.pathname + target}`)
        return false;
    })

    function updateToc() {
        const currentToc = window.location.hash;
        if (!currentToc) return;
        if ($(currentToc).length) {
            setTimeout(() => {
                $(`.toc-item-link[href="${currentToc}"]`).trigger('click');
            }, 10);
        } else {
            history.replaceState({}, '', window.location.pathname)
        }
    }
    updateToc();
}

function privToc() {
    let html = $('.priv-hero__nav-toc-item').eq(0).clone();
    createToc(lenis, '.priv-hero__main-richtext','.priv-hero__nav-toc', html)
}

export default privacyScript = {
    namespace: 'privacy',
    afterEnter() {
        console.log('enter privacy')
        setTimeout(() => {
            privToc()
            
        }, 100);
    },
    beforeLeave() {
        console.log('leave privacy')
    }
}