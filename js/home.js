import $ from "jquery";
import * as THREE from 'three';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { nestedLinesSplit, toHTML, lerp, pointerCurr, ySetter, yGetter } from './untils';
import lenis from './vendors/lenis';
import SplitText from "./vendors/SplitText";
import { childrenSelect } from './common/utils/childrenSelector'
import swiper from './components/swiper';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getAllDataByType } from "./common/prismic_fn";

gsap.registerPlugin(ScrollTrigger, SplitText);

//Home
function calculate() {
    if ($(window).width() - $('.container').width() >= 0) {
        let scalefactor = $(window).width()/$('.container').width()
        console.log($('.container').width())
        console.log(scalefactor)
        $('.home-tech__bg-tri-inner').css('transform', `translate(-50%, -50%) scale(${scalefactor})`)
    }
    console.log($('.container').outerWidth())
}
$(window).on('resize', function(e) {
    calculate()
})

let typeOpts = {
    lines: { type: 'lines', linesClass: 'g-lines'},
    words: { type: 'words,lines', linesClass: 'g-lines'},
    chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
};
let gOpts = {
    ease: 'power2.easeOut'
};

class homeHeroWebGL {
    constructor() {
        this.container = $('.home-hero__canvas');
        this.scene = new THREE.Scene();
        this.hdri = new THREE.CubeTextureLoader()
        .load([
            new URL('../assets/map/high/px.png', import.meta.url),
            new URL('../assets/map/high/nx.png', import.meta.url),
            new URL('../assets/map/high/py.png', import.meta.url),
            new URL('../assets/map/high/ny.png', import.meta.url),
            new URL('../assets/map/high/pz.png', import.meta.url),
            new URL('../assets/map/high/nz.png', import.meta.url)
        ])
    }
    get viewport() {
        let width = this.container.width();
        let height = this.container.height();
        let aspectRatio = width / height;
        return {
            width,
            height,
            aspectRatio
        }
    }
    setupCamera() {
        //Resize
        window.addEventListener('resize', this.onWindowResize.bind(this))
        //camera
        this.perspective = this.viewport.height;
        let fov = (Math.atan(this.viewport.height / 2 / this.perspective) * 2) * 180 / Math.PI;
        // fov = this.viewport.width > 767 ? 67.21006304397703 : 67.21006304397703 * 1;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 10000);
        this.camera.position.set(0,0,this.perspective)
        this.camera.lookAt(0,0,0)
        //renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);


    }
    createMesh() {
        let url = new URL('../assets/cargo-hero-deform.glb', import.meta.url)
        url = "" + url;
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();

        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        this.dracoLoader.setDecoderConfig({type: 'js'})
        this.loader.setDRACOLoader( this.dracoLoader )
        this.loader.load(url,
            (glb) => {
                this.model = glb.scene;
                let scaleFactorShip;
                if ($(window).width() > 991 ) {
                    scaleFactorShip = $(window).width() * .003472 > 8 ? 8 : $(window).width() * .003472
                } else if ($(window).width() > 768) {
                    scaleFactorShip = $(window).width() * .003472 > 3 ? 3 : $(window).width() * .003472
                } else {
                    scaleFactorShip = $(window).height() * .003472 * 2 > 2.2 ? 2.2 : $(window).height() * .003472 * 2
                    console.log('scale: ' + scaleFactorShip)
                }
                this.model.scale.set(scaleFactorShip,scaleFactorShip,scaleFactorShip)
                this.model.position.y = -this.viewport.height * .2086 * 1;
                console.log(this.viewport.height)
                this.model.position.x = this.viewport.width * .0045;
                this.scene.environment = this.hdri;
                this.orangeMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#FF471D'),
                    envMapIntensity: 4,
                    roughness: .35,
                    metalness: 0
                })
                this.darkMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#2B2C2F'),
                    envMapIntensity: 3,
                    roughness: .70,
                    metalness: 1,
                    transparent: true,
                })
                this.clock = new THREE.Clock()
                this.model.traverse((obj) => {
                    if (obj instanceof THREE.Mesh) {
                        if (obj.name === 'kite') {
                            obj.material = this.orangeMat;
                            console.log(obj)
                        } else if (obj.name.includes('str')) {
                            obj.material = this.darkMat;
                        }
                        if (obj.name === 'chamfer') {
                            obj.scale.set(1.3,1.3,1.3)
                        }
                    }
                    this.bone = this.model.children[0]
                    this.boneX = this.bone.position.x
                })
                this.lerpFactor = 0;
                this.scene.add(this.model)
                this.animate()
            },
            (xhr) => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            (error) => {
                console.log( error );
        })

    }
    onWindowResize() {
        if (this.model) {
            console.log('resize')
            let scaleFactorShip;
            if ($(window).width() > 991 ) {
                scaleFactorShip = $(window).width() * .003472 > 8 ? 8 : $(window).width() * .003472
            } else if ($(window).width() > 768) {
                scaleFactorShip = $(window).width() * .003472 > 3 ? 3 : $(window).width() * .003472
                console.log(scaleFactorShip)
            } else {
                scaleFactorShip = $(window).height() * .003472 * 2 > 2.2 ? 2.2 : $(window).height() * .003472 * 2
                console.log('scale: ' + scaleFactorShip)
            }
            this.model.scale.set(scaleFactorShip,scaleFactorShip,scaleFactorShip)
        }
        this.camera.aspect = this.viewport.aspectRatio;
        this.renderer.setSize(this.viewport.width, this.viewport.height)
        this.camera.updateProjectionMatrix();
    }
    mousMove() {
        if (this.model) {
            let windOffsetPan = Math.cos(this.clock.getElapsedTime() * 2) * Math.PI / 90 * (this.lerpFactor * 100);
            let windOffsetTilt = Math.sin(this.clock.getElapsedTime() * 2 * 2) * Math.PI / 180 * (this.lerpFactor * 100);
            let windOffsetRot = Math.sin(this.clock.getElapsedTime() * 2) * Math.PI / 45 * (this.lerpFactor * 100);
            let moveFactor;
            if ($(window).width() > 991) {
                if ($('.home-hero__bg-wrap-inner').hasClass('done-anim')) {
                    if (this.lerpFactor < 0.01) {
                        this.lerpFactor += 0.0001
                    }
                }

                if ($('.home-hero__bg-wrap-inner').hasClass('done-anim')) {
                    //Pan
                    let pastX = this.bone.rotation.y;
                    this.bone.rotation.y = lerp(pastX, (pointerCurr().x / $(window).width() - 0.5) * 2 * Math.PI / 4 * -1, this.lerpFactor)
                    //Tilt
                    let pastZ = this.bone.rotation.z;
                    this.bone.rotation.z = lerp(pastZ, (pointerCurr().x / $(window).width() - 0.5) * 2 * Math.PI / 6 * -1, this.lerpFactor)

                } else {
                    this.bone.rotation.y = 0
                    this.bone.rotation.z = 0
                    this.bone.rotation.x = 1.57
                }
                //Rotate
                this.bone.rotation.x = 1.57 - Math.abs(Math.sin(this.clock.getElapsedTime() * .8)) * Math.PI / 36 * (this.lerpFactor * 100);

                // Pan
                if ($('.home-hero__bg-wrap-inner').hasClass('done-anim')) {
                    this.model.children[0].children[0].rotation.z = 2.028715267360886e-17 + windOffsetPan
                } else {
                    this.model.children[0].children[0].rotation.z = 2.028715267360886e-17
                }

                // Rotate
                if ($('.home-hero__bg-wrap-inner').hasClass('done-anim')) {
                    this.model.children[0].children[0].rotation.y = -9.27239782033422e-17 + windOffsetRot
                } else {
                    this.model.children[0].children[0].rotation.y = -9.27239782033422e-17
                }
                // Tilt
                this.model.children[0].children[0].rotation.x = -1.1400032464213996 + windOffsetTilt

                moveFactor = $(window).height() * .018;

            } else {
                this.bone.rotation.y = Math.cos(this.clock.getElapsedTime() * .4) * Math.PI / 6;
                this.bone.rotation.z = Math.cos(this.clock.getElapsedTime() * .4) * Math.PI / 8;
                this.bone.rotation.x = 1.57 - Math.abs(Math.sin(this.clock.getElapsedTime() * .8)) * Math.PI / 36;

                this.model.children[0].children[0].rotation.z = 2.028715267360886e-17 + windOffsetPan
                this.model.children[0].children[0].rotation.y = -9.27239782033422e-17 + windOffsetRot
                this.model.children[0].children[0].rotation.x = -1.1400032464213996 + windOffsetTilt

                moveFactor = this.viewport.height * .01;
            }
            ySetter('.home-hero__bg-ship, .home-hero__canvas')(Math.sin(this.clock.getElapsedTime()) * moveFactor)
            gsap.set('.home-hero__bg-ship, .home-hero__canvas', {scale: 1 + Math.sin(this.clock.getElapsedTime()) * .01} )
        }
    }
    animate() {
        if (!$('[data-barba-namespace="home"]').length) {

        } else {
            this.mousMove()
            this.renderer.render(this.scene, this.camera)
        }
        requestAnimationFrame(this.animate.bind(this))
    }
    init() {
        this.setupCamera()
        this.createMesh()
    }
    reset() {
        this.container.append(this.renderer.domElement);
        this.onWindowResize()
    }
}

function homeHero() {let homeheroWebGL = new homeHeroWebGL();
    homeheroWebGL.init()
    homeheroWebGL.reset()
    homeheroWebGL.onWindowResize()

    const homeHeroTitle = new SplitText('.home-hero .home-hero__title', typeOpts.chars);
    const homeHeroLabel = new SplitText('.home-hero .home-hero__backer-label', typeOpts.words);
    const homeHeroBacker = $('.home-hero .home-hero__backer-item')
    const homeHeroSub = nestedLinesSplit('.home-hero__sub-txt', typeOpts.words);
    const homeHeroCaption = new SplitText('.home-hero__sub-caption', typeOpts.words);

    let tl = gsap.timeline({
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            homeHeroTitle.revert();
            new SplitText('.home-hero .home-hero__title', typeOpts.lines);
            homeHeroLabel.revert();
            new SplitText('.home-hero .home-hero__backer-label', typeOpts.lines);
            homeHeroCaption.revert();
            $('.home-hero__sub-caption-item').addClass('anim')
        },
        delay: 1.2
    })
    tl
    .from(homeHeroTitle.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .01})
    .from(homeHeroLabel.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    .from(homeHeroBacker, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .1}, '<=.2')
    .from(homeHeroSub.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '.2')
    .from(homeHeroCaption.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')

    if ($(window).width() > 767) {
        let tlScrub = gsap.timeline({
            scrollTrigger: {
                trigger: '.home-hero__wrap',
                start: 'top top',
                end: 'top top-=100%',
                scrub: true,
            }
        })
        tlScrub
        .to('.home-hero__bg-wrap', {yPercent: 15, ease: 'none'})
        if ($(window).width() > 991) {
            tlScrub
            .to('.home-hero .home-hero__title', {yPercent: -65, ease: 'none'}, '0')
            .to('.home-hero .home-hero__sub', { yPercent: -200, ease: 'none' }, '0')
        }
    }
}
function homeIntro() {
    ScrollTrigger.create({
        trigger: '.home-intro',
        start: 'top bottom',
        once: true,
        onEnter: () => {
            const homeIntroLabel = new SplitText('.home-intro__label', typeOpts.chars)
            const homeIntroTitle = new SplitText('.home-intro__title', typeOpts.words)
            const homeIntroRichh3 = new SplitText('.home-intro__richtext-h3', typeOpts.words)
            const homeIntroRichp = new SplitText('.home-intro__richtext-p', typeOpts.words)
            const homeIntroRichlink = new SplitText('.home-intro__richtext-link', typeOpts.words)

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
                    homeIntroLabel.revert()
                    homeIntroTitle.revert()
                    new SplitText('.home-intro__title', typeOpts.lines)
                    homeIntroRichh3.revert()
                    new SplitText('.home-intro__richtext-h3', typeOpts.lines)
                    homeIntroRichp.revert()
                    homeIntroRichlink.revert()
                }
            })
            tl
            .from(homeIntroLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
            .from(homeIntroTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            .to('.home-intro__img', { clipPath: 'inset(0%)', duration: 1, ease: 'expo.out'}, '<=.4')
            .to('.home-intro__img img', { scale: 1, duration: 1, autoAlpha: 1, ease: 'expo.out', clearProps: 'all'}, '<=0')
            .to('.home-intro__richtext-img', { clipPath: 'inset(0%)', duration: 1, ease: 'expo.out'}, '0')
            .to('.home-intro__richtext-img img', { scale: 1, duration: 1, autoAlpha: 1, ease: 'expo.out', clearProps: 'all'}, '<=0')
            .from(homeIntroRichh3.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            .from(homeIntroRichp.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .015}, '<=.2')
            .from(homeIntroRichlink.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .03}, '>=-.2')
            .from('.home-intro__richtext-link', {'--line-width': '0%', duration: .6}, '<=.2')
        }
    })

    let tlScrub = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-intro__richtext',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    })
    tlScrub.fromTo('.home-intro__richtext', {yPercent: -7}, { yPercent: 7, ease: 'none'})

    let tlScrubImg = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-intro__img',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    })
    tlScrubImg.fromTo('.home-intro__img', {yPercent: 15}, { yPercent: -15, ease: 'none'})
}
function homeProb() {
    ScrollTrigger.create({
        trigger: '.home-prob',
        start: 'top bottom',
        once: true,
        onEnter: () => {
            const homeProbLabel = new SplitText('.home-prob__label', typeOpts.chars)
            const homeProbTitle = new SplitText('.home-prob__title', typeOpts.words)

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-prob',
                    start: 'top top+=50%',
                },
                defaults: {
                    ease: gOpts.ease
                },
                onComplete: () => {
                    homeProbLabel.revert()
                    homeProbTitle.revert()
                    new SplitText('.home-prob__title', typeOpts.lines)
                }
            })
            tl
            .from(homeProbLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
            .from(homeProbTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')

            const homeProbItems = $('.home-prob__main-item')
            homeProbItems.each((index, el) => {
                gsap.set(el.querySelector('.home-prob__main-item-img'), {clipPath: 'inset(20%)'})
                gsap.set(el.querySelector('.home-prob__main-item-img img'), {scale: 1.4, autoAlpha: 0})
                const homeProbItemTitle = new SplitText(el.querySelector('.home-prob__main-item-title'), typeOpts.words)
                const homeProbItemSub = nestedLinesSplit(el.querySelector('.home-prob__main-item-txt'), typeOpts.words)
                const homeProbItemTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: 'top top+=50%',
                    },
                    onComplete: () => {
                        homeProbItemTitle.revert()
                        new SplitText(el.querySelector('.home-prob__main-item-title'), typeOpts.lines)
                        homeProbItemSub.revert()
                    }
                })
                homeProbItemTl
                .to(el.querySelector('.home-prob__main-item-img'), { clipPath: 'inset(0%)', duration: 1.4, ease: 'expo.out'})
                .to(el.querySelector('.home-prob__main-item-img img'), { scale: 1, duration: 1.4, autoAlpha: 1, ease: 'expo.out', clearProps: 'all'}, '0')
                .from(homeProbItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
                .from(homeProbItemSub.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
                if ($(window).width > 991) {
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
                }
            })
        }
    })

}
function homeSolu() {
    ScrollTrigger.create({
        trigger: '.home-solu__head',
        start: 'top bottom',
        once: true,
        onEnter: () => {
            const homeSoluLabel = new SplitText('.home-solu__label', typeOpts.chars)
            const homeSoluTitle = new SplitText('.home-solu__title', typeOpts.words)

            gsap.set('.home-solu .p-line-top, .home-solu .p-line-bottom', {transformOrigin: 'center top'})
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-solu__head',
                    start: 'top top+=50%',
                    onComplete: () => {
                        homeSoluLabel.revert()
                        homeSoluTitle.revert()
                        new SplitText('.home-solu__title', typeOpts.lines)
                    }
                }
            })
            tl
            .from('.home-solu__head-img-wrap', {yPercent: 45, autoAlpha: 0, duration: 1, ease: 'power2.out'}, 0)
            .from(homeSoluLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            .from(homeSoluTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            .from('.home-solu .p-line-top', {autoAlpha: 0, scaleY: 0, duration: .4 })
            .from('.home-solu .p-line-bottom', {autoAlpha: 0, scaleY: 0, duration: .6 }, '>=.2')



            const homeSoluBody = new SplitText('.home-solu__body-txt', {types: 'words, lines, chars', linesClass: 'g-lines'});

            let tlScrubText = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-solu__body-txt',
                    start: 'top bottom-=25%',
                    end: 'bottom top+=25%',
                    scrub: .4,
                }
            })
            requestAnimationFrame(() => {
                tlScrubText
                .from(homeSoluBody.chars, {color: '#B8B8B8', duration: .1, stagger: 0.02, ease: 'power1.out'}, '0')
            })

            const homeSoluItems = $('.home-solu__main-item')
            homeSoluItems.each((index, el) => {
                const homeSoluItemTitle = new SplitText(el.querySelector('.home-solu__main-item-title'), typeOpts.words)
                const homeSoluItemSub = new SplitText(el.querySelector('.home-solu__main-item-txt'), typeOpts.words)
                const homeSoluItemTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: 'top top+=50%',
                    },
                    onComplete: () => {
                        homeSoluItemTitle.revert()
                        new SplitText(el.querySelector('.home-solu__main-item-title'), typeOpts.lines)
                        homeSoluItemSub.revert()
                    }
                })
                homeSoluItemTl
                .from(homeSoluItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02, delay: index % 2 == 1 ? .2 : 0})
                .from(homeSoluItemSub.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
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
        }
    })
    let tlScrub = gsap.timeline({
        scrollTrigger: {
            trigger: '.home-solu__head',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    })
    tlScrub
    .fromTo('.home-solu__head-img-wrap img', {yPercent: 15}, { yPercent: -6, ease: 'none'})
}
function homeShift() {
    requestAnimationFrame(() => {
        let bigShipPath = $('.home-shift__main-part--big-ship .home-shift__img-wrap').width() + $(window).width()
        let smallShipPath = $('.home-shift__main-part--small-ship .home-shift__img-wrap').width() + $(window).width() + $('.home-shift__small-txt').width()
        gsap.set('.home-shift__main-part--big-txt', {clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'})
        gsap.set('.home-shift__main-part--small-txt', {clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'})
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home-shift__main',
                start: 'top top',
                end: `bottom bottom`,
                scrub: .6,
            },
            defaults: {
                ease: 'none'
            }
        })
        tl
        .to('.home-shift__main-part--big-txt', {clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', duration: 1.2})
        .to('.home-shift__main-part--big-ship .home-shift__img-wrap', {x: -bigShipPath, duration: 1.2}, 0)
        .to('.home-shift__main-part--small-txt', {clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1}, 0)
        .to('.home-shift__main-part--small-ship .home-shift__img-wrap', {x: -smallShipPath, duration: 1.2})

        requestAnimationFrame(() => {
            let tlInit = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-shift__main-part--big-txt',
                    start: 'top bottom',
                    end: 'top top',
                    scrub: true
                }
            })
            requestAnimationFrame(() => {
                tlInit.from('.home-shift__main-part--big-txt', {yPercent: -10, ease: 'none'})
            })

            let tlImgBg = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-ship__bg-img',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            })
            tlImgBg.fromTo('.home-ship__bg-img img', {objectPosition: '50% 0%'}, {objectPosition: '50% 100%', ease: 'none'})
        })
    })

}
function homeTech() {
    ScrollTrigger.create({
        trigger: '.home-tech',
        start: 'top bottom',
        once: true,
        onEnter: () => {
            const homeTechLabel = new SplitText('.home-tech__label', typeOpts.chars)
            const homeTechTitle = new SplitText('.home-tech__title', typeOpts.words);
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-tech__head',
                    start: 'top top+=50%',
                },
                defaults: {
                    ease: gOpts.ease
                },
                onComplete: () => {
                    homeTechLabel.revert()
                    homeTechTitle.revert()
                    new SplitText('.home-tech__title', typeOpts.lines);
                }
            })
            tl
            .from(homeTechLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
            .from(homeTechTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')

            const homeTechItems = $('.home-tech__item:not(".home-tech__link")');
            homeTechItems.each((index, el) => {
                let homeTechItemTitle = new SplitText(el.querySelector('.home-tech__item-title'), typeOpts.words)
                let tlHomeTechItem = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
                    },
                    onComplete: () => {
                        homeTechItemTitle.revert()
                    }
                })
                tlHomeTechItem
                .from(el, {autoAlpha: 0, duration: .8, delay: index == 0 ? 0 : index % 2 == 0 ? .3 : 0})
                .from(el.querySelector('.home-tech__item-icon'), {autoAlpha: 0, yPercent: 25, duration: .4}, '<=.2')
                .from(homeTechItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            })

            let homeTechItemLinkTitle = new SplitText('.home-tech__link-title', {type: 'words, lines'})
                let tlHomeTechItemLink = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.home-tech__link',
                        start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
                    },
                    onComplete: () => {
                        homeTechItemLinkTitle.revert()
                    }
                })
                tlHomeTechItemLink
                .from('.home-tech__link', {autoAlpha: 0, duration: .8})
                .from('.home-tech__link .arr-wrap', {autoAlpha: 0, yPercent: 25, duration: .4}, '<=.2')
                .from(homeTechItemLinkTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')


            let tlShip = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-tech__ship',
                    start: 'top bottom+=15%',
                    end: 'bottom top-=35%',
                    scrub: .4,
                }
            })
            tlShip.fromTo('.home-tech__ship img', {
                xPercent: $(window).width() > 767 ? 65 : 55, yPercent: -35
            }, {
                xPercent: $(window).width() > 767 ? -65 : -55, yPercent: 35, ease: 'none'
            })
        }
    })
}
function homeWhy() {
    ScrollTrigger.create({
        trigger: '.home-why',
        start: 'top bottom',
        once: true,
        onEnter: () => {
            const homeWhyLabel = new SplitText('.home-why__label', typeOpts.chars)
            const homeWhyTitle = new SplitText('.home-why__title', typeOpts.words);
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-why__head',
                    start: 'top top+=50%',
                },
                defaults: {
                    ease: gOpts.ease
                },
                onComplete: () => {
                    homeWhyLabel.revert()
                    homeWhyTitle.revert()
                    new SplitText('.home-why__title', typeOpts.lines)
                }
            })
            tl
            .from(homeWhyLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
            .from(homeWhyTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            .from('.home-why__btn', {yPercent: 60, autoAlpha: 0, duration: .4}, '>=-.2')

            const homeWhyItems = $('.home-why__main-item');
            homeWhyItems.each((index, el) => {
                let homeWhyItemTitle
                if ($(window).width() > 767) {
                    homeWhyItemTitle = new SplitText(el.querySelector('.home-why__main-item-title'), typeOpts.words)
                }
                let tlHomeWhyItem = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
                    },
                    onComplete: () => {
                        if ($(window).width() > 767) {
                            homeWhyItemTitle.revert()
                            new SplitText(el.querySelector('.home-why__main-item-title'), typeOpts.lines)
                        }
                    }
                })
                tlHomeWhyItem
                .from(el, {autoAlpha: 0, duration: 1, delay: index == 0 ? 0 : index % 2 == 0 ? .3 : 0})
                .from(el.querySelector('.home-why__main-item-icon'), {autoAlpha: 0, yPercent: 25, duration: .4, clearProps: 'transform'}, '<=.2')
                if ($(window).width() > 767) {
                    tl.from(homeWhyItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
                } else {
                    tl
                    .from(el.querySelector('.home-why__main-item-title'), {yPercent: 60, autoAlpha: 0, duration: .4}, '<=.2')
                    .from(el.querySelector('.home-why__main-item-sub'), {yPercent: 60, autoAlpha: 0, duration: .4}, '<=.2')
                }

            })
        }
    })

    if ($(window).width() > 991) {
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
    else if ($(window).width() > 767){

    }
    else {
        $('.home-why__main-wrapper').addClass('swiper')
        $('.home-why__main-list').addClass('swiper-wrapper')
        $('.home-why__main-item').addClass('swiper-slide')
        const parent = childrenSelect('.home-why__main');
        swiper.setup(parent, {
            touchMove: true,
            spaceBetween: 20,
        })
    }
}
function homePart() {
    ScrollTrigger.create({
        trigger: '.home-part',
        start: 'top bottom',
        once: true,
        onEnter: () => {
            const homePartLabel = new SplitText('.home-part__label', typeOpts.chars)
            const homePartTitle = new SplitText('.home-part__title', typeOpts.words);
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-part__head',
                    start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
                },
                defaults: {
                    ease: gOpts.ease
                },
                onComplete: () => {
                    homePartLabel.revert()
                    homePartTitle.revert()
                    new SplitText('.home-part__title', typeOpts.lines);
                }
            })
            tl
            .from(homePartLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
            .from(homePartTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            .from('.home-part__btn', {yPercent: 60, autoAlpha: 0, duration: .4}, '<=.2')

            //Update width base on container's current width
            let tlDur
            if ($(window).width() <= 767) {
                $('.home-part__marquee-wrapper .home-part__main-item').css('width', `${$('.home-part .container').width() / 3}px`)
                tlDur = 20
            } else if ($(window).width() <= 991 ) {
                $('.home-part__marquee-wrapper .home-part__main-item').css('width', `${$('.home-part .container').width() / 5}px`)
                tlDur = 30
            } else {
                $('.home-part__marquee-wrapper .home-part__main-item').css('width', `${$('.home-part .container').width() / 6}px`)
                tlDur = 40
            }

            let cloneItem = $('.home-part__marquee-wrapper .home-part__marquee-item').eq(0).clone();
            cloneItem.clone().appendTo('.home-part__marquee-wrapper.--right')
            cloneItem.clone().appendTo('.home-part__marquee-wrapper.--left')

            let tlMarquee = gsap.timeline({
                repeat: -1,
                onUpdate: () => {
                    let tlDir = lenis.direction >= 0 ? 1 : -1;
                    gsap.to(tlMarquee, {timeScale: tlDir * Math.min(Math.max(lenis.velocity/2, 1), 4), duration: .1, ease: 'none'})
                }
            })
            tlMarquee.seek(28800)
            tlMarquee
            .to('.home-part__marquee-wrapper.--right .home-part__marquee-item', {xPercent: -100, duration: tlDur,  ease: 'none'})
            .to('.home-part__marquee-wrapper.--left .home-part__marquee-item', {xPercent: 100, duration: tlDur,  ease: 'none'}, 0)

            let tlItems = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-part__main-supporters',
                    start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
                }
            })
            tlItems
            .from('.home-part__main-supporters .home-part__marquee-wrapper.--right .home-part__main-item', {autoAlpha: 0, duration: .8, yPercent: 25, stagger: .04, clearProps: 'transform'})
            .from('.home-part__main-supporters .home-part__marquee-wrapper.--left .home-part__main-item', {autoAlpha: 0, duration: .8, yPercent: 25, stagger: .04, clearProps: 'transform'}, 0)

            let tlSubTitle = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-part__investor',
                    start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
                }
            })
            tlSubTitle.from('.home-part__investor-title', {yPercent: 60, autoAlpha: 0, duration: .4, ease: 'none'})

            let tlItemInvest = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-part__main-investors',
                    start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
                }
            })
            tlItemInvest
            .from('.home-part__main-investors .home-part__main-item', {autoAlpha: 0, duration: .8, yPercent: 25, stagger: .04, clearProps: 'all'})
        }
    })
}
function homeFaq() {
    ScrollTrigger.create({
        trigger: '.home-faq',
        start: 'top bottom',
        once: true,
        onEnter: () => {
            const homeFaqTitle = new SplitText('.home-faq__title',typeOpts.words);
            const homeFaqSub = new SplitText('.home-faq__sub',typeOpts.words);
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-faq__head',
                    start: 'top top+=55%',
                },
                defaults: {
                    ease: gOpts.ease
                },
                onComplete: () => {
                    homeFaqTitle.revert()
                    new SplitText('.home-faq__title',typeOpts.lines);
                    homeFaqSub.revert()
                }
            })
            tl
            .from(homeFaqTitle.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02})
            .from(homeFaqSub.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            .from('.home-faq__link', {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .04}, '<=.2')
            .from('.home-faq__link.hover-un', {'--line-width': '0%', duration: .6}, '<=.2')

            let tlItems = gsap.timeline({
                scrollTrigger: {
                    trigger: '.home-faq__main',
                    start: 'top top+=55%',
                }
            })
            tlItems
            .from('.home-faq__main .faq-item', {autoAlpha: 0, duration: 1, yPercent: 25, stagger: .2, clearProps: 'all'})
        }
    })
}
function homeTechInteraction() {
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
}
function homeWhyInteraction() {
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
}
function homeFaqInteraction() {
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
}
function getApi_homePart() {
    getAllDataByType('partner', 'asc').then((res) => {
        let allPart = res;
        let templatePart = $('.home-part__main-item').eq(0).clone();
        $('.home-part__main-supporters .home-part__marquee-wrapper .home-part__marquee-item').html('')
        $('.home-part__main-investors').html('')
        allPart.forEach((i) => {
            let htmlPart = templatePart.clone();
            htmlPart.find('img').attr('src',i.data.logo.url).attr('alt',i.data.logo.alt ? i.data.logo.alt : i.data.name)
            if (i.data.type == "Supporter") {
                htmlPart.appendTo('.home-part__main-supporters .home-part__marquee-wrapper .home-part__marquee-item');
            } else {
                htmlPart.appendTo('.home-part__main-investors');
            }
        })
        homePart()
    })

}
function getApi_homeFaq() {
    getAllDataByType('faq', 'asc').then((res) => {
        let allFaq = res;
        let templateFaq = $('.faq-item').eq(0).clone();
        $('.home-faq__main').html('')
        allFaq.forEach((i) => {
            let htmlFaq = templateFaq.clone();
            htmlFaq.find('.faq-item__head-txt').text(i.data.ques)
            htmlFaq.find('.faq-item__body').html(toHTML(i.data.ans, 'txt txt-16', 'txt-link hover-un'))
            htmlFaq.appendTo('.home-faq__main');
        })
        homeFaq()
        homeFaqInteraction()
        $('.home-faq__main [data-popup="contact"]').on('click', function(e) {
            e.preventDefault()
            $('.popup').addClass('active')
            lenis.stop()
        })
    })
}

const homeScript = {
    namespace: 'home',
    afterEnter() {
        console.log('enter home')
        setTimeout(() => {
            console.log('hello')
            calculate()

            homeHero()
            homeIntro()
            homeProb()
            homeSolu()
            homeShift()
            homeTech()
            homeWhy()
            //homePart()
            //homeFaq()

            getApi_homePart()
            getApi_homeFaq()
            if ($(window).width() > 991) {
                homeWhyInteraction();
            }
            //homeFaqInteraction()
        }, 100);
    },
    beforeLeave() {
        console.log('leave home')
    }
}
export default homeScript

