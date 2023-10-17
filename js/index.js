import 'swiper/swiper-bundle.min.css'
import 'leaflet/dist/leaflet.css'
import $ from "jquery";
import lenis from './vendors/lenis';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { initCookie, cookieConsent, cookieAccepted } from './components/cookieconsent-init';
import { getAllDataByType } from './common/prismic_fn';
import { viewport } from './common/helpers/viewport';

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
    // lenis.on('scroll', function (inst) {
    //     if (inst.scroll > header.height()) {
    //         header.addClass('on-scroll')
    //         if (inst.direction == 1) {
    //             // down
    //             header.addClass('on-hide')
    //         } else if (inst.direction == -1) {
    //             // up
    //             header.removeClass('on-hide')
    //         }
    //     } else {
    //         header.removeClass('on-scroll on-hide')
    //     };
    // })
    let lastScrollTop = 0;
    const handleHeader = {
        toggleHide: (scrollPos) => {
            let headerHeight = header.height();
			if (scrollPos > lastScrollTop) {
				if (scrollPos > headerHeight) {
                    header.addClass('on-hide')
				}
			} else {
				if (scrollPos > headerHeight) {
					header.addClass("on-hide");
					header.removeClass("on-hide");
				}
			}
			lastScrollTop = scrollPos;
		},
		addBG: (scrollPos) => {
			if (scrollPos > header.height()) header.addClass("on-scroll");
			else header.removeClass("on-scroll");
        },
        toggleNav: () => {
            const hamburger = $('.header__toggle');
            hamburger.on('click', function (e) {
                e.preventDefault();
                if (header.hasClass('open-nav')) {
                    if ($(window).width() <= 476) {
                        let scrollY = $("body").css('top');
                        $("body").css({
                            'position': 'relative',
                            'top': ''
                        });
                        lenis.start();
                        window.scrollTo(0, parseInt(scrollY || '0') * -1);
                    }
                    header.removeClass('open-nav');
                    header.removeClass('force')
                }
                else {
                    if ($(window).width() <= 476) {
                        setTimeout(() => {
                            $("body").css({
                                'position': 'fixed',
                                'top': `-${window.scrollY}px`
                            });
                        }, 500)
                        lenis.stop();
                    }
                    header.addClass('open-nav');
                    header.addClass('force')
                }
            })
		},
    };

    handleHeader.toggleNav();
    function scrollHeaderSwitch() {
        if (viewport.width > 767) {
            lenis.on('scroll', function (inst) {
                let scrollPos = inst.scroll;
                handleHeader.addBG(inst.scroll);
                handleHeader.toggleHide(inst.scroll);
            })
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

    function transitionOnce() {
        resetScroll()
        gsap.set('.trans__item', {transformOrigin: 'bottom', scaleY: 1})
        let tl = gsap.timeline({})
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
                $("body").css({
                    'position': 'relative',
                    'top': ''
                });
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
            onComplete: () => {
                if (!cookieAccepted) {
                    cookieConsent?.show(1);
                }
            }
        })
        tl
        .to('.trans__item', {scaleY: 0, duration: 1, stagger: {
            each: '.1',
        }, ease: "expo.in"}, 0)
            .to('.trans__logo', { rotateZ: '-7deg', autoAlpha: 0, duration: .6, yPercent: 30, ease: 'power2.in' }, '<=.4')
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
        $('.header').removeClass('force-hidden')
        $('.header').removeClass('force')
        addNavActiveLink(data);
    }
    function resetScroll() {
        let locationHash = window.location.hash;
        lenis.stop()
        if ($(locationHash).length) {
            console.log(locationHash)
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
    // function changeScrollerContainer() {
    //     let triggers = ScrollTrigger.getAll();
    //     triggers.forEach(trigger => {
    //         trigger.scroller.customElements = '.wrapper'
    //         console.log(trigger);
    //     });
    // }
    function handleScrollTo() {
        $('[data-scrollto]').on('click', function(e) {
            //e.preventDefault();
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
                cookieConsent?.hide();
                await transitionLeave(data).then(() => {
                    removeAllScrollTrigger()
                })
            },
            async afterLeave(data) {
            }
        }],
        views: VIEWS
    })
}

window.onload = scripts
