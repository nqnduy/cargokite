import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

function newsHero() {
    $('.news-hero__logo-default-item').addClass('active')
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
}

export default newsScript = {
    namespace: 'news',
    afterEnter() {
        console.log('enter news')
        setTimeout(() => {
            newsHero()
        }, 100);
    },
    beforeLeave() {
        console.log('leave news')
    }
}