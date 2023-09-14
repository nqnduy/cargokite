import HeaderComponent from "./components/header";
import Lenis from '@studio-freight/lenis';
import $ from "jquery";

const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

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
