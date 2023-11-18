import 'swiper/swiper-bundle.min.css'
import 'leaflet/dist/leaflet.css'
import $ from "jquery";
import lenis from './vendors/lenis';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import CustomEase from 'gsap/CustomEase';
import { initCookie, cookieConsent, cookieAccepted } from './components/cookieconsent-init';
import { getAllDataByType } from './common/prismic_fn';
import { viewport } from './common/helpers/viewport';
import { xGetter, yGetter, xSetter, ySetter, pointerCurr, lerp } from './untils';

import homeScript from './home';
import aboutScript from './about';
import techScript from './tech';
import newsScript from './news';
import privacyScript from './privacy';

const scripts = () => {
    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }
    if (viewport.width <= 767) {
        ScrollTrigger.defaults({
            scroller: ".wrapper"
        });
    }

    barba.use(barbaPrefetch);
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

    function debounce(func, delay = 100){
        let timer;
        return function(event) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, delay, event);
        };
    }

    function refreshOnBreakpoint() {
        let initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;
        let newViewportWidth;
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

    const header = $('.header')

    let lastScrollTop = 0;
    const handleHeader = {
		toggleHide: (scrollPos) => {
			let headerHeight = header.height();
			if (scrollPos > lastScrollTop) {
				if (scrollPos > headerHeight) {
					header.addClass("on-hide");
				}
			} else {
				if (scrollPos > headerHeight) {
					header.addClass("on-hide");
					header.removeClass("on-hide");
				}
			}
			lastScrollTop = scrollPos;
		},
		onScrollDes: (scrollPos) => {
			let headerHeight = header.height();
			let logo = $(".header__logo");
			if (scrollPos > headerHeight * 2) {
				if (header.hasClass("open-ham")) {
					header.removeClass("open-ham");
				}
				if (!header.hasClass("on-scroll")) {
					setTimeout(() => {
						header.addClass("on-scroll");
					}, 900);
				}
				logo.addClass("scroll-mode");
			} else {
				header.removeClass("on-scroll");
				header.hasClass("open-ham");
				logo.removeClass("scroll-mode");
			}
		},
		onScrollMb: (scrollPos) => {
			let headerHeight = header.height();
			if (scrollPos > headerHeight) header.addClass("on-scroll");
			else header.removeClass("on-scroll");
		},
		toggleNav: () => {
			const hamburger = $(".header__toggle");
			hamburger.on("click", function (e) {
				e.preventDefault();
				if (header.hasClass("open-nav")) {
					if ($(window).width() <= 476) {
						let scrollY = $("body").css("top");
						$("body").css({
							position: "relative",
							top: "",
						});
						lenis.start();
						window.scrollTo(0, parseInt(scrollY || "0") * -1);
					}
					header.removeClass("open-nav");
					header.removeClass("force");
				} else {
					if ($(window).width() <= 476) {
						setTimeout(() => {
							$("body").css({
								position: "fixed",
								top: `-${window.scrollY}px`,
							});
						}, 500);
						lenis.stop();
					}
					header.addClass("open-nav");
					header.addClass("force");
				}
			});
		},
		toggleHam: () => {
			const hamburger = $(".header__hamburger");
			hamburger.on("click", function (e) {
				e.preventDefault();
				header.toggleClass("open-ham");
			});

			$(window).on("click", (e) => {
				if (!$(".header__hamburger:hover").length)
					if (!$(".header__link:hover").length) header.removeClass("open-ham");
					else {
						setTimeout(() => {
							header.removeClass("open-ham");
						}, 500);
					}
			});
		},
    };

    if (viewport.width > 991) {
		handleHeader.toggleHam();
	} else {
		handleHeader.toggleNav();
	}

    function scrollHeaderSwitch() {
        if (viewport.width > 767) {
            lenis.on("scroll", function (inst) {
				let scrollPos = inst.scroll;
				handleHeader.onScrollDes(scrollPos);
			});
        }
        else {
            $('.wrapper').on("scroll", function () {
                let scrollPos = $('.wrapper').scrollTop();
                handleHeader.addBG(scrollPos);
                handleHeader.toggleHide(scrollPos);
            });
        }
    }
    scrollHeaderSwitch();

    function transitionOnce(data) {
        resetScroll()
        gsap.set('.trans__item', {transformOrigin: 'bottom', scaleY: 1})
        let tl
        if (data.next.namespace == 'home') {
            //Setup css
            $('.trans__count').addClass('active');
            $('.trans__home').addClass('active');
            $('.home-hero .home-hero__title, .home-hero .home-hero__backer').addClass('force-hidden')
            // //Debug area
            // $('.trans__wrapper').remove()
            // $('.home-hero .home-hero__title, .home-hero .home-hero__backer').removeClass('force-hidden')
            // lenis.start()
            // // End Debug area

            let homeHeroTitleHeight = $('.home-hero__title').outerHeight();
            console.log(homeHeroTitleHeight)
            let transHomePaddingBottom = parseInt($('.trans__home-inner').css('padding-bottom'))
            console.log(transHomePaddingBottom)
            console.log(homeHeroTitleHeight)
            tl = gsap.timeline({
                onComplete: () => {
                    lenis.start()
                    if (!cookieAccepted) {
                        cookieConsent?.show(0);
                        gsap.fromTo('#cm', {yPercent: 25, autoAlpha: 0}, {yPercent: 0, autoAlpha: 1, duration: .4, delay: 2, ease: 'none'})
                    }
                },
                delay: .4
            })
            lenis.stop()
            const dur = {
                phase_1: 2.2,
                phase_2: 2.45,
                phase_3: 1.25,
            }
            const bezier = {
                bezier_1: CustomEase.create("cus1", "M0,0 C0.424,0.343 0.294,0.974 1,1 "),
                bezier_2: CustomEase.create("cus2", "M0,0 C0.634,0 0.927,0.604 1,1 "),
                bezier_3: CustomEase.create("cus3", "M0,0 C0.634,0 0.702,1 1,1 "),
            }
            let offsetVal_1, offsetVal_2
            if ($(window).width() > 991) {
                offsetVal_1 = .72
                offsetVal_2 = .9
            } else if ($(window).width() > 768) {
                offsetVal_1 = .76
                offsetVal_2 = 1.1
            } else {
                offsetVal_1 = .68
                offsetVal_2 = 1.1
            }

            let homeHeroTitleTrans = new SplitText('.trans__home .home-hero__title', { type: 'chars,words,lines', linesClass: 'g-lines'});
            let homeHeroLabelTrans = new SplitText('.trans__home .home-hero__backer-label', { type: 'words,lines', linesClass: 'g-lines'});
            let homeHeroBackerTrans = $('.trans__home .home-hero__backer-item')
            if ($(window).width() <= 991) {
                $('.trans__home .home-hero__backer').css('margin-top', `${$('.home-hero .home-hero__backer').get(0).getBoundingClientRect().top}px`)
            }

            let count = { val: 0 };
            //0-65 count + count move
            //0
            tl
                .to('.trans__count-bar-inner', {scaleX: .65, duration: dur.phase_1, ease: bezier.bezier_1})
                .to(count, {val: 65, roundProps: "val", duration: dur.phase_1, ease: bezier.bezier_1,
                    onUpdate: function () {
                        $('.trans__count-value').text(count.val < 10 ? `0${count.val}` : count.val)
                }}, "<=0")

                .to('.trans__count', {y: $(window).height() * offsetVal_1 - homeHeroTitleHeight, duration: dur.phase_1, ease: bezier.bezier_1}, "<=0")
                .to('.trans__home .home-hero__title', {y: $(window).height() * offsetVal_1 - homeHeroTitleHeight, duration: dur.phase_1 + .2, ease: bezier.bezier_1}, "<=0")
                // //65
                .to('.trans__count-bar-inner', {scaleX: 1, duration: dur.phase_2, ease: bezier.bezier_2})
                .to(count, {
                    val: 100, roundProps: "val", duration: dur.phase_2, ease: bezier.bezier_2,
                    onUpdate: function () {
                        $('.trans__count-value').text(count.val < 10 ? `0${count.val}` : count.val)
                    }
                }, "<=0")
                .to('.trans__count', {y: `-=${$(window).height() * offsetVal_2 - homeHeroTitleHeight}`, duration: dur.phase_2 +.1, ease: bezier.bezier_2}, "<=0")
                .to('.trans__home .home-hero__title', {y: 0, duration: dur.phase_2+.4, ease: bezier.bezier_3}, "<=0")

                .to('.trans__count', {autoAlpha: 0, duration: dur.phase_3, ease: 'power1.in'}, "<=1.3")
                .to('.trans__home .home-hero__backer', {y: 0, duration: dur.phase_3, ease: 'power1.in'}, "<=0")
                .from(homeHeroLabelTrans.words, {yPercent: 60, autoAlpha: 0, duration: .2, stagger: .01}, ">=0")
                .from(homeHeroBackerTrans, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .05}, "<=0")
                .to('.trans__item', {
                    scaleY: 0, duration: 1, stagger: { each: '.1' }, ease: "expo.in",
                    onComplete: () => {
                        $('.trans__home-inner').remove()
                        $('.home-hero .home-hero__title, .home-hero .home-hero__backer').removeClass('force-hidden')
                    }
                }, "<=-.25")
                .from('.home-hero__bg-wrap-inner ', {
                    y: `${$('.home-hero__bg-wrap-inner').height() - $('.home-hero__bg-wrap').height()}`,
                    duration: 2, ease: "Power2.out",
                    onComplete: () => {
                        $('.home-hero__bg-wrap-inner').addClass('done-anim')
                    }
                }, "<=.55")
        }
        else {
            $('.trans__logo').addClass('active');
            tl = gsap.timeline({
                onComplete: () => {
                    $('.trans__home-inner').remove()
                    if (!cookieAccepted) {
                        cookieConsent?.show(0);
                        gsap.fromTo('#cm', {yPercent: 25, autoAlpha: 0}, {yPercent: 0, autoAlpha: 1, duration: .4, delay: 2, ease: 'none'})
                    }
                }
            })
            tl
                .to('.trans__item', {delay: .4, scaleY: 0, duration: 1, stagger: { each: '.1' }, ease: "expo.in" }, 0)
                .to('.trans__logo', {rotateZ: '-7deg', autoAlpha: 0, duration: .6, yPercent: 30, ease: 'power2.in'}, '<=.4')
        }
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
                $("body").css({
                    'position': 'relative',
                    'top': ''
                });
                header.removeClass('open-nav');
                lenis.start();
            }
        })
        tl
            .to('.trans__item', {scaleY: 1, duration: 1, stagger: { each: '.1' }, ease: "expo.out"}, 0)
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
            onComplete: () => {
                addNavActiveLink(data);
                if (!cookieAccepted) {
                    cookieConsent?.show(0);
                    gsap.fromTo('#cm', {yPercent: 25, autoAlpha: 0}, {yPercent: 0, autoAlpha: 1, duration: .4, delay: 2, ease: 'none'})
                }
            }
        })
        tl
            .to('.trans__item', {scaleY: 0, duration: 1, stagger: { each: '.1' }, ease: "expo.in"}, 0)
            .to('.trans__logo', { rotateZ: '-7deg', autoAlpha: 0, duration: .6, yPercent: 30, ease: 'power2.in' }, '<=.4')

        if (data.next.namespace == 'home') {
            $('.home-hero__bg-wrap-inner').addClass('done-anim')
        }
        return tl
    }

    function addNavActiveLink(data) {
        header.removeClass('dark-mode')
        header.removeClass('mix-mode')

        if (viewport.width > 991) {
            header.addClass("open-ham");
        }

        if ($(data.next.container).attr('data-header') == 'dark') {
            header.addClass('dark-mode')
        } else if ($(data.next.container).attr('data-header') == 'mix') {
            header.addClass('mix-mode')
        }

        $('[data-link]').removeClass('active')
        $(`[data-link="${$(data.next.container).attr('data-namespace')}"]`).addClass('active')
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
        $('.header').removeClass('on-hide')
        $('.header').removeClass('force-hidden')
        $('.header').removeClass('force')
    }
    function resetScroll() {
        let locationHash = window.location.hash;
        lenis.stop()
        if ($(locationHash).length) {
            setTimeout(() => {
                lenis.scrollTo(locationHash, {
                    force: true,
                    immediate: true,
                });
            }, 300);
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
        },
        cookie: () => {
            $('[data-close-cookie]').on('click', function (e) {
                if ($(this).attr('href') === '#') {
                    e.preventDefault();
                }
                cookieConsent?.hideSettings();
            })
            let closeBtn = $('#s-c-bn').clone();
            closeBtn.css({
                position: 'absolute',
                top: `${viewport.width > 767 ? "0px" : "5px"}`,
                right: "0"
            })
            closeBtn.on('click', function (e) {
                cookieConsent?.hide();
            })
            $('#cm').append(closeBtn);
        }
    }

    function handleForm() {
        //Form utils
        function mapFormToObject(ele) {
            return (parsedFormData = [...new FormData(ele).entries()].reduce(
                (prev, cur) => {
                    const name = cur[0];
                    const val = cur[1];
                    return { ...prev, [name]: val };
                },
                {}
            ));
        }
        function initForm(form, options) {
            const { submitEle = {}, onSuccess, onError, handleSubmit, prepareMap, fields, pageName = "Form", hubspot } = options;
            const { ele, textEle } = submitEle;

            let submitBtn = $(form).find('button[type=submit]');
            if (ele) {
                submitBtn = $(form).find(ele);
            }
            let defaultText = submitBtn.clone().val();
            if (textEle) {
                defaultText = submitBtn.find(textEle).clone().text();
            }

            let url = $(form).attr('action');

            if (hubspot) {
                const { portalId, formId } = hubspot;
                url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
            }

            const setLoading = (isLoading) => {
                console.log(isLoading)
                if (isLoading) {
                    if (textEle) {
                        submitBtn.find(textEle).text('Please wait ...');
                    } else {
                        submitBtn.val('Please wait ...');
                    }

                    submitBtn.css({ 'pointer-events': 'none' })
                }
                else {
                    if (textEle) {
                        submitBtn.find(textEle).text(defaultText);
                    } else {
                        submitBtn.val(defaultText)
                    }
                    submitBtn.css({ 'pointer-events': '' })
                }
            }

            const showError = (message = "Something error") => {
                alert(message)
            }
            const mapField = (data) => {
                if (!fields.length) return [];
                const result = fields.map((field) => {
                    const { name, value, regexp } = field;
                    if (!value) {
                        return {
                            name,
                            value: data[name] || ""
                        }
                    }
                    else {
                        const getValue = value(data);
                        return {
                            name,
                            value: getValue || ''
                        }
                    }
                })
                return result;
            }
            const sendSubmission = (data) => {
                const mappedFields = mapField(data);
                console.log(mappedFields)
                const dataSend = {
                    fields: mappedFields,
                    context: {
                        pageUri: window.location.href,
                        pageName: pageName,
                    },
                };
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: JSON.stringify(dataSend),
                    dataType: 'json',
                    headers: {
                        accept: 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    contentType: 'application/json',
                    success: function (response) {
                        $(form).get(0).reset()
                        if (onSuccess) onSuccess(data);
                        setLoading(false);
                    },
                    error: function (error) {
                        if (error.readyState === 4) {
                            const errors = error.responseJSON.errors
                            const errorArr = errors[0].message.split('.')
                            const errorMess = errorArr[errorArr.length - 1]

                            showError(errorMess);
                        }
                        else {
                            showError('Something error');
                        }
                        setLoading(false)
                    },
                });
            }

            $(form).on("submit", function (e) {
                e.preventDefault();
                setLoading(true);
                if (prepareMap) {
                    prepareMap($(this));
                }
                const data = mapFormToObject(e.target);
                if (handleSubmit) handleSubmit(data);
                sendSubmission(data);
                return false;
            });
        }

        //form contact popup
        //$('.input-field').on('change keyup blur input', hanldeInput);
        $('.popup__main-form .popup__main-submit').on('click', function (e) {
            e.preventDefault();
            console.log('submiitttttttt')

            $('.popup__main-form').trigger('submit');
        })
        const formContact = initForm('.popup__main-form', {
            onSuccess: (data) => {
                // success form callback
                $('.popup__main-form').find('.popup__main-form-success-txt [data-form-name]').text(data.name)
                $('.popup__main-form').find('.popup__main-submit').addClass('on-complete')
                $('.popup__main-form').find('.popup__main-submit').attr('disabled',true)
                $('.popup__main-form').find('.popup__main-form-inner').addClass('hidden')
                $('.popup__main-form').find('.popup__main-form-success').removeClass('hidden')
            },
            hubspot: {
                portalId: '143433917',
                formId: '82503ac7-13c9-43df-9f9b-64ac8d19368f'
            },
            submitEle: {
                ele: '.popup__main-submit',
                textEle: '.popup__main-submit-inner-default .popup__main-submit-inner-txt',
            },
            pageName: document.title,
            prepareMap: (ele) => {
            },
            fields: [
                {
                    name: 'firstname',
                    value: (data) => data.name,
                },
                {
                    name: 'email',
                    value: (data) => data.email,
                },
                {
                    name: 'message',
                    value: (data) => data.message
                },
            ]
        })
        $('.footer__form-main .input-submit').on('click', function (e) {
            e.preventDefault();
            $('.footer__form-main').trigger('submit');
        })

        //form subscribe footer
        const formSubscribe = initForm('.footer__form-main', {
            onSuccess: (data) => {
                // success form callback
                $('.footer').find('.footer__form-title').text('Thanks for subscribing')
                $('.footer').find('.footer__form-sub').text("Congratulations! You're now on our list to stay informed about the latest news.")
                $('.footer__form-main').find('.input-submit').addClass('on-complete')
                $('.footer__form-main').find('footer__form-title')
                $('.footer__form-main').css('pointer-events', 'none')

                setTimeout(() => {
                    $('.footer').find('.footer__form-title').text('Subscribe to Newsletters')
                    $('.footer').find('.footer__form-sub').text("Want to stay up to date? Sign up for CargoKite's biannual update.")
                    $('.footer__form-main').css('pointer-events', 'auto')
                    $('.footer__form-main').trigger('reset')
                    $('.footer__form-main').find('.input-submit').removeClass('on-complete')
                }, 4000);
            },
            hubspot: {
                portalId: '143433917',
                formId: '20556b7f-85c2-4b55-9bdc-7b681d3a2285'
            },
            submitEle: {
                ele: '.input-submit',
                textEle: '.input-submit-txt',
            },
            pageName: document.title,
            prepareMap: (ele) => {
            },
            fields: [
                {
                    name: 'email',
                    value: (data) => data.email,
                },
            ]
        })


    }
    handleForm()

    function checkIfJobAvail() {
        getAllDataByType('job').then((res) => {
            if (res.length <= 0) {
                $('.footer .tag-link').addClass('hidden')
            }
        })
    }

    function handleFooterCursor() {
        const footerCursorWrap = '.footer__cursor';
        const footerCursor = '.footer__cursor-main';
        function mousMove() {
            if ($(footerCursor).length) {
                let iconsX = xGetter(footerCursor);
                let iconsY = yGetter(footerCursor);
                xSetter(footerCursor)(lerp(iconsX, pointerCurr().x), 0.01);
                ySetter(footerCursor)(lerp(iconsY, pointerCurr().y - $(footerCursorWrap).get(0).getBoundingClientRect().top), 0.01);
            }
            requestAnimationFrame(mousMove)
        }
        requestAnimationFrame(mousMove)
    }
    if ($(window).width() > 767) {
        handleFooterCursor()
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
                initCookie();
                handlePopup.toggle();
                handlePopup.cookie();
                checkIfJobAvail()
            },
            async enter(data) { },
            async afterEnter(data) {
                await transitionEnter(data)
                handleScrollTo()
            },
            async beforeLeave(data) {
                resetBeforeLeave(data)
            },
            async leave(data) {
                cookieConsent?.hide();
                await transitionLeave(data).then(() => {
                    removeAllScrollTrigger()
                })
            },
            async afterLeave(data) {  }
        }],
        views: VIEWS
    })
}

window.onload = scripts
