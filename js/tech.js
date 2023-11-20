import $ from "jquery";
import * as THREE from 'three';
import * as L from 'leaflet';
import portData from '../data/port.json'
import lenis from './vendors/lenis';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import gsap from "gsap";
import Flip from "./vendors/Flip";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { lerp, isTouchDevice, xGetter, yGetter, xSetter, ySetter, pointerCurr } from './untils';
import swiper from "./components/swiper";
import { childrenSelect } from "./common/utils/childrenSelector";

import { viewport, viewportBreak } from "./common/helpers/viewport";

gsap.registerPlugin(ScrollTrigger, Flip);

function convertToTitleCase(str) {
    if (!str) {
        return ""
    }
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

gsap.registerPlugin(ScrollTrigger, SplitText);
let typeOpts = {
    lines: { type: 'lines', linesClass: 'g-lines'},
    words: { type: 'words,lines', linesClass: 'g-lines'},
    chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
};
let gOpts = {
    ease: 'power2.easeOut'
}

let map;
class techDemoWebGL {
    constructor() {
        this.container = $('.tech-demo__canvas-inner');
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
        let fov = (Math.atan(this.viewport.height / 2 / this.perspective) * 2) * 180 / Math.PI;
        fov = this.viewport.width > 767 ? 32.26880414280885 : 32.26880414280885 * 1;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 10000);
        if ($(window).width() > 767) {
            this.camera.position.set(
                100.63897705078125,
                16.265151023864746,
                viewportBreak({ md: -51.48991394042969, sm:  -68.48991394042969 })
            )
            this.lookAtTarget = new THREE.Vector3(65.7516, 24.93049, -1.35464
            )
        } else {
            this.camera.position.set(
                85.63897705078125,
                14.265151023864746,
                -68.48991394042969
            )
            this.lookAtTarget = new THREE.Vector3(55.7516, 16.9304, -1.35464
            )
        }
        this.camera.lookAt(this.lookAtTarget)

        //renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    createMesh() {
        let url = new URL('../assets/cargo-demo-4.glb', import.meta.url)
        url = "" + url;
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();

        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        this.dracoLoader.setDecoderConfig({type: 'js'})
        this.loader.setDRACOLoader( this.dracoLoader )

        // if ($(window).width() <= 767) {
        //     const parent = childrenSelect('.tech-demo__main');
        //     swiper.initClassName(parent);
        // }
        this.loader.load(url,
        (glb) => {
            this.model = glb.scene;
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
            this.darkContMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#2B2C2F'),
                envMapIntensity: 3,
                roughness: .70,
                metalness: 1,
                transparent: true
            })
            this.darkBattMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#2B2C2F'),
                envMapIntensity: 3,
                roughness: .70,
                metalness: 1,
                transparent: true
            })

            this.model.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    if (obj.name === 'kite') {
                        obj.material = this.orangeMat;
                    } else if (obj.name == 'Propeller1') {
                        this.prop1 = obj
                        obj.material = this.darkMat;
                    } else if (obj.name == 'Propeller2') {
                        this.prop2 = obj
                        obj.material = this.darkMat;
                    } else if (obj.name === 'Battery') {
                        obj.material = this.darkBattMat;
                    } else if (obj.name.includes('container')) {
                        obj.material = this.darkContMat;
                    } else {
                        obj.material = this.darkMat;
                    }
                }

                if (obj.name === 'container-grp') {
                    this.containerGrp = obj.children;
                } else if (obj.name === 'Battery') {
                    this.battery = obj
                }
            })
            const light = new THREE.PointLight(new THREE.Color('white'), 10, 10, 2)
            light.position.set(10, 10, 10)
            this.scene.add(light)
            this.scene.add(this.model)
            this.animate()
            this.scrollAnimate()
        },
        (xhr) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        (error) => {
            console.log( error );
        })
    }
    onWindowResize() {
        this.camera.aspect = this.viewport.aspectRatio;
        this.renderer.setSize(this.viewport.width, this.viewport.height)
        this.camera.updateProjectionMatrix();
    }
    animate() {
        if (!$('[data-barba-namespace="tech"]').length) {

        } else {
            this.prop1.rotation.x += 0.05
            this.prop2.rotation.x += 0.05
            //this.composer.render()
            this.renderer.render(this.scene, this.camera)
        }
        requestAnimationFrame(this.animate.bind(this))
    }
    scrollAnimate() {
        if (this.viewport.width > 767) {
            let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.tech-demo__main',
                start: 'top bottom',
                end: 'bottom top+=25%',
                scrub: true,
                onUpdate: () => {
                    this.camera.lookAt( this.lookAtTarget );
                }
            },
            defaults: {
                ease: 'none'
            }
        })
        tl
        //dummy start 100vh
        // .to('.popup', { duration: 1 })
        .to(this.camera.position, {
            x: viewportBreak({ md: 74.63897705078125, sm: 85.63897705078125 }),
            y: viewportBreak({ md: 16.265151023864746, sm: 10.265151023864746 }),
            z: viewportBreak({ md: -51.48991394042969, sm:  -68.48991394042969 }),
            duration: 1
        })
        .to(this.lookAtTarget, {
            x: viewportBreak({ md: 49.7516, sm: 45.7516 }),
            y: viewportBreak({ md: 24.93049, sm: 21.9304 }),
            z: -1.35464,
            duration: 1
        }, '<=0')
        //end dummy start 100vh
        .to(this.camera.position, {
            x: viewportBreak({ md: -43.3858, sm: -75.3858 }),
            y: viewportBreak({ md: -3.16929, sm: -1.16929 }),
            z: viewportBreak({ md: -17.9227, sm: -38.9227 }),
            duration: 1
        })
        .to(this.lookAtTarget, {
            x: viewportBreak({ md: -19.2134, sm: -24.2134 }),
            y: viewportBreak({ md: 5.46543, sm: 4.46543 }),
            z: -0.014547,
            duration: 1
        }, '<=0')
        .to('.tech-demo__main-inner .tech-demo__main-item', {
            yPercent: -100,
            duration: 1
        }, '<=0')
        .to(this.camera.position, {
            x: viewportBreak({ md: -36.182, sm: -75.182 }),
            y: viewportBreak({ md: 28.6084, sm: 40.6084, }),
            z: viewportBreak({ md: 52.1051, sm: 100.1051 }),
            duration: 1
        })
        .to(this.lookAtTarget, {
            x: viewportBreak({ md: 11.3448, sm: 20.3448 }),
            y: 6.2503,
            z: 0.056603,
            duration: 1
        }, '<=0')
        .to('.tech-demo__main-inner .tech-demo__main-item', {
            yPercent: -200,
            duration: 1
        }, '<=0')
        this.containerGrp.forEach((el, idx) => {
            let delayTime;
            if (idx == 0) {
                delayTime = '<=.4'
            } else {
                delayTime = '<=0'
            }
            tl.to(el.position, {
                y: `${10 + 3 * (Math.random() - .5) * 2}`,
                duration: .6,
            }, delayTime)
            .to(el.material, {
                opacity: 0,
                duration: .6
            }, '<=0')
        })
        tl.to(this.camera.position, {
            x: viewportBreak({ md: -10.3768, sm: -20.182 }),
            y: viewportBreak({ md: 14.7438, sm: 15.6084}),
            z: viewportBreak({ md: 8.8912, sm: 10.1051 }),
            duration: 1
        })
        .to(this.lookAtTarget, {
            x: viewportBreak({ md: 5.3448, sm: 7.3448 }),
            y: 6.2503,
            z: 0.056603,
            duration: 1
        }, '<=0')
        .to(this.darkMat, {
            opacity: 0,
            duration: 1,
        }, '<=0')
        .to('.tech-demo__main-inner .tech-demo__main-item', {
            yPercent: -300,
            duration: 1
        }, '<=0')
        //dummy end 100vh
        tl.to(this.camera.position, {
            x: viewportBreak({ md: -10.3768, sm: -25.182 }),
            y: viewportBreak({ md: 14.7438, sm: 15.6084}),
            z: viewportBreak({ md: 4.8912, sm: 10.1051 }),
            duration: 1
        })
        .to(this.lookAtTarget, {
            x: viewportBreak({ md: 5.3448, sm: 7.3448 }),
            y: 6.2503,
            z: 0.056603,
            duration: 1
        }, '<=0')
        // tl.to('.popup', {duration: 1})
        //end dummy end 100vh

        }
        else {
            let pointer = [
                {
                    position: {
                        x: 85.63897705078125,
                        y: 14.265151023864746,
                        z: -68.48991394042969
                    },
                    lookAt: {
                        x: 55.7516,
                        y: 16.9304,
                        z: -1.35464
                    }
                },
                {
                    position: {
                        x: -50.3858,
                        y: 4.16929,
                        z: -30.9227,
                    },
                    lookAt: {
                        x: -11.2134,
                        y: 1.46543,
                        z: -1.014547,
                    }
                },
                {
                    position: {
                        x: -72.182,
                        y: 58.6084,
                        z: 90.1051
                    },
                    lookAt: {
                        x: 0.3448,
                        y: -4.2503,
                        z: 0.056603
                    }
                },
                {
                    position: {
                        x: -20.182,
                        y: 12.6084,
                        z: 10.1051
                    },
                    lookAt: {
                        x: 0.65,
                        y: 6.7503,
                        z: 0.056603
                    }
                }
            ]
            let activeIndex = 0;
            let prog;
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.tech-demo__main',
                    start: 'top top+=50%',
                    end: 'bottom top+=50%',
                    scrub: true,
                    snap: {
                        snapTo: [.125, .375, .625, .875],
                        duration: { min: 0.2, max: 3 },
                        delay: 0.1,
                        onComplete: (self) => {

                        }
                    },
                    onUpdate: (self) => {
                        this.camera.lookAt( this.lookAtTarget );
                        prog = self.progress.toFixed(2);
                        if (prog <= .25) {
                            activeIndex = 0
                        } else if (prog > .25 && prog <= .5) {
                            activeIndex = 1
                        } else if (prog > .5 && prog <= .75) {
                            activeIndex = 2
                        } else if (prog > .75) {
                            activeIndex = 3
                        }
                        $('.tech-demo__main-item').removeClass('active')
                        $('.tech-demo__main-item').eq(activeIndex).addClass('active')
                    },
                    onEnter: () => {
                        $('.header').addClass('force-hidden')
                    },
                    onLeave: () => {
                        $('.header').removeClass('force-hidden')
                    },
                    onEnterBack: () => {
                        $('.header').addClass('force-hidden')
                    },
                    onLeaveBack: () => {
                        $('.header').removeClass('force-hidden')
                    }
                },
                defaults: {
                    ease: 'none'
                }
            })
            tl
            //Start
            .to('.popup', { duration: .5 })
            .addLabel("demo0")
            .to(this.camera.position, {
                x: pointer[1].position.x,
                y: pointer[1].position.y,
                z: pointer[1].position.z,
                duration: 1
            })
            .to(this.lookAtTarget, {
                x: pointer[1].lookAt.x,
                y: pointer[1].lookAt.y,
                z: pointer[1].lookAt.z,
                duration: 1
            }, '<=0')
            .addLabel("demo1")
            .to(this.camera.position, {
                x: pointer[2].position.x,
                y: pointer[2].position.y,
                z: pointer[2].position.z,
                duration: 1
            })
            .to(this.lookAtTarget, {
                x: pointer[2].lookAt.x,
                y: pointer[2].lookAt.y,
                z: pointer[2].lookAt.z,
                duration: 1
            }, '<=0')
            this.containerGrp.forEach((el, idx) => {
                let delayTime;
                if (idx == 0) {
                    delayTime = '<=.4'
                } else {
                    delayTime = '<=0'
                }
                tl.to(el.position, {
                    y: `${10 + 3 * (Math.random() - .5) * 2}`,
                    duration: .6,
                }, delayTime)
                .to(el.material, {
                    opacity: 0,
                    duration: .6
                }, '<=0')
            })
            tl.addLabel("demo2")
            tl.to(this.camera.position, {
                x: pointer[3].position.x,
                y: pointer[3].position.y,
                z: pointer[3].position.z,
                duration: 1
            })
            .to(this.darkMat, {
                opacity: 0,
                duration: 1,
            }, '<=0')
            .to(this.lookAtTarget, {
                x: pointer[3].lookAt.x,
                y: pointer[3].lookAt.y,
                z: pointer[3].lookAt.z,
                duration: 1
            }, '<=0')
            .addLabel("demo3")

            //End
            .to('.popup', { duration: .5 })

            $('.tech-demo__main-item-toggle').on('click', function(e) {
                e.preventDefault()
                $('.tech-demo__popup-item').eq(activeIndex).addClass('active')
                console.log(activeIndex)
            })
            $('.tech-demo__popup-close').on('click', function(e) {
                e.preventDefault()
                $('.tech-demo__popup-item').removeClass('active')
                console.log(activeIndex)
            })

            $('.tech-demo__main-item-title').on('click', function(e) {
                e.preventDefault();
                let target = $(this).closest('.tech-demo__main-item').index();
                //console.log(target)
                lenis.scrollTo(tl.scrollTrigger.labelToScroll(`demo${target}`), {force: true})
            })

        }
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

function techHero() {
    const techHeroLabel = new SplitText('.tech-hero__label', typeOpts.chars);
    const techHeroTitle = new SplitText('.tech-hero__title', typeOpts.words);
    const techHeroSub = new SplitText('.tech-hero__sub', typeOpts.words);

    let tl = gsap.timeline({
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            techHeroTitle.revert();
            new SplitText('.tech-hero__title', typeOpts.lines);
            techHeroLabel.revert();
        },
        delay: 1.2
    })
    tl
    .from(techHeroLabel.chars, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '<=.2')
    .from(techHeroTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .03}, '<=.2')
    .from(techHeroSub.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
}
function techVideo() {
    const techVidLabel = new SplitText('.tech-vid__label', typeOpts.words);
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.tech-vid__label',
            start: 'top top+=75%',
        },
        defaults: {
            ease: gOpts.ease
        },
        onComplete: () => {
            techVidLabel.revert();
            $('.tech-vid__label-item').addClass('anim')
        },
    })
    tl
    .from(techVidLabel.words, {yPercent: 60, autoAlpha: 0, duration: .8, stagger: .04})
    .from('.tech-vid__main-inner', {yPercent: 60, autoAlpha: 0, duration: .6}, '<=.2')
}
function techVideoInteraction() {
    const container = $('.tech-vid')
    const item = $('.tech-vid__main-inner');
    let offset = ($(window).height() - $('.tech-vid__holder').height())  / 2;
    if (viewport.width > 767) {
        container.addClass('end-state')
        let state = Flip.getState(item);
        container.removeClass('end-state')
        // goal value = 1 - 0.3 = 0.7
        gsap.quickSetter('.tech-vid__play-btn', 'scaleX', ``)(.7);
        gsap.quickSetter('.tech-vid__play-btn', 'scaleY', ``)(.7);
        Flip.to(state, {
            simple: true,
            scrollTrigger: {
                trigger: '.tech-vid__main',
                start: `top top+=${offset}`,
                end: `top -=${viewportBreak({ md: 150, sm: 40 })}%`,
                scrub: true,
                pin: true,
                onUpdate: (self) => {
                    // goal value = 1 - 0.3 = 0.7
                    let val = 1 - ((1 - self.progress) * .3)
                    gsap.quickSetter('.tech-vid__play-btn', 'scaleX', ``)(val);
                    gsap.quickSetter('.tech-vid__play-btn', 'scaleY', ``)(val);
                }
            }
        })
        ScrollTrigger.create({
            trigger: '.tech-vid',
            start: 'top top',
            end: 'bottom top',
            onLeave: () => {
                videoAction.pause('#vidTech')
            }
        })
    }

    const videoAction = {
        play: (video) => {
            if (!video) return;
            let el = $(video).get(0);
            el.play()

            $('.tech-vid__play-btn').addClass('playing');
            $('.tech-vid__main-vid').addClass('playing');
        },
        pause: (video) => {
            if (!video) return;
            let el = $(video).get(0);
            el.pause()

            $('.tech-vid__play-btn').removeClass('playing');
            $('.tech-vid__main-vid').removeClass('playing');
        }
    }
    let clearThumb = (wrap) => wrap.hasClass('clear-thumb') ? true : wrap.addClass('clear-thumb');
    let playBtn = '.tech-vid__play-btn'
    $(playBtn).on('click', function(e) {
        e.preventDefault();
        videoAction.play('#vidTech');

        if (!clearThumb(item)) return;
        let target;
        if ($(window).width() > 991 ) {
            target = $('.tech-vid').offset().top + $('.tech-vid').outerHeight() - $(window).height() - offset;
        } else {
            target = $('.tech-vid__holder').offset().top + $('.tech-vid__holder').outerHeight() - $(window).height() - offset;
        }
        clearThumb(item);
        lenis.scrollTo(target)
    })

    if (viewport.width > 991) {
        if (!isTouchDevice()) {
            function techVideoHandle() {
                function moveCursor() {
                    let iconsX = xGetter(playBtn);
                    let iconsY = yGetter(playBtn);
                    let vidBoundary = $('.tech-vid__main-inner').get(0);
                    let vidRect = vidBoundary.getBoundingClientRect()
                    let ctrlHeight = 65;

                    if ($('.tech-vid__main-inner').length) {
                        if ($('.tech-vid__main-inner:hover').length) {
                            xSetter(playBtn)(lerp(iconsX, pointerCurr().x - vidRect.left - vidRect.width / 2), 0.01);
                            ySetter(playBtn)(lerp(iconsY, pointerCurr().y - vidRect.top - vidRect.height / 2), 0.01);
                            if (pointerCurr().y - vidRect.top  >= vidRect.height - ctrlHeight) {
                                gsap.to(playBtn, { opacity: 0, duration: 0.3 })
                            } else {
                                gsap.to(playBtn, { opacity: 1, duration: 0.3 })
                            }
                        } else {
                            if ($(playBtn).hasClass('playing')) {
                                gsap.to(playBtn, { opacity: 0, duration: 0.3 })
                            } else {
                                gsap.to(playBtn, { opacity: 1, duration: 0.3 })
                            }

                            xSetter(playBtn)(lerp(iconsX, 0), 0.01);
                            ySetter(playBtn)(lerp(iconsY, 0), 0.01);
                        }
                    }
                }
                moveCursor();

                function checkVidPlaying() {
                    if ($('#vidTech').get(0).paused) {
                        videoAction.pause('#vidTech');
                    }
                    else {
                        videoAction.play('#vidTech');
                    }
                }
                checkVidPlaying();
                requestAnimationFrame(techVideoHandle)
            }
            requestAnimationFrame(techVideoHandle)
        }
    }
}
function removeTechMap() {
    map.remove();
}

function techDemo() {
    let techWebGL = new techDemoWebGL();
    techWebGL.init()
    techWebGL.reset()
    techWebGL.onWindowResize()

    let techDemoItems = $('.tech-demo__main-item');

    if (viewport.width > 767) {
        requestAnimationFrame(() => {
            techDemoItems.each((idx, el) => {
                const techDemoItemTitle = new SplitText(el.querySelector('.tech-demo__main-item-title'), typeOpts.words)
                const techDemoItemSub = new SplitText(el.querySelector('.tech-demo__main-item-richtext'), typeOpts.words)
                const techDemoItemTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: $(el).find('.tech-demo__main-item-title'),
                        start: 'top top+=75%',
                    },
                    onComplete: () => {
                        techDemoItemTitle.revert()
                        new SplitText(el.querySelector('.tech-demo__main-item-title'), typeOpts.lines)
                        techDemoItemSub.revert()
                    }
                })
                techDemoItemTl
                .from(techDemoItemTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02}, '0')
                .from(techDemoItemSub.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
            })
        })
    }
}
function techMap() {
    function reverseLineStringCoordinates(lineString) {
        const reversedCoordinates = lineString.coordinates.map(coord => [coord[1], coord[0]]);
        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: reversedCoordinates,
            },
        };
    }
    let routeLayer;

    // Plot the route on the map
    function plotRoute(map, geojsonData) {
        // Add a GeoJSON layer to the map
        const reversedGeoJson = reverseLineStringCoordinates(geojsonData.geometry);

        if (!routeLayer) {
            routeLayer = L.layerGroup().addTo(map);
        } else {
            routeLayer.clearLayers();
        }

        let strokeWidth;
        if ($(window).width() >= 767) {
            strokeWidth = 4;
        } else {
            strokeWidth = 8;
        }
        const geoJsonLayer = L.geoJSON(reversedGeoJson, {
            style: {
                color: '#0074D9',
                weight: strokeWidth,
            },
        }).addTo(routeLayer);

        // Fit the map to the route's bounding box
        const bounds = L.geoJSON(reversedGeoJson).getBounds();
        if ($(window).width() > 767) {
            map.fitBounds(bounds, {
                padding: [20, 20]
            });
        } else {
            map.fitBounds(bounds, {
                padding: [100, 100]
            });
        }

        const popup = L.popup();

        // Add mousemove event handler to the GeoJSON layer
        if ($(window).width() > 767) {
            geoJsonLayer.on('mousemove', handleMouseMove);
        } else {
            geoJsonLayer.on('click', handleMouseMove);
        }

        // Remove popup when mouse leaves the GeoJSON layer
        geoJsonLayer.on('mouseout', handleMouseOut);

        function handleMouseMove(e) {
            console.log('move')
            const { duration_hr, distance_km, average_speed_km_h } = geojsonData.properties;
            const days = Math.floor(duration_hr / 24);
            const hours = Math.floor(duration_hr % 24);
            const minutes = Math.floor(((duration_hr % 24) % 1) * 60);

            const popupContent = `
            <div class="txt txt-14 leaflet-popup-content-inner">
            <div class="route-info-item">
            Estimated Median Duration:<br>
            <span class="txt-bold">${days} days ${hours} hours ${minutes} minutes</span>
            </div>
            <div class="route-info-item">
            Estimated Median Distance:<br>
            <span class="txt-bold">${distance_km.toFixed(2)} km</span>
            </div>
            <div class="route-info-item">
            Estimated Average Speed:<br>
            <span class="txt-bold">${average_speed_km_h.toFixed(2)} km/h</span>
            </div
            </div>
            `;
            console.log(e.latlng)
            popup.setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(map);
        }

        function handleMouseOut() {
            map.closePopup();
        }
    }

    async function getRouteData(startPortId, endPortId) {
        const backendUrl = 'https://qqezpzkio3.execute-api.eu-central-1.amazonaws.com/prod/route-planner/median-route'; // Replace with your actual backend endpoint

        // Construct the URL with query parameters
        const queryParams = `?startPortId=${startPortId}&destinationPortId=${endPortId}`;
        const routeUrl = backendUrl + queryParams;

        const response = await fetch(routeUrl);

        if (response.status === 204) {
            // No route available (HTTP 204)
            alert('No route available for the selected ports yet.');
            return null;
        } else if (response.status >= 300) {
            // Something went wrong (HTTP 300+)
            alert('An error occurred while fetching the route data.');
            return null;
        } else {
            // Valid response, update the map
            const geojsonData = await response.json();
            return geojsonData;
        }
    }

    // Initialize Leaflet map
    const key = 'foURK5elDM5gPh7BhbIO';
    map = L.map('techMap').setView([0, 20], 2);
    map.scrollWheelZoom.disable()
    if ($(window).width() <= 767) {
        map.dragging.disable()
    }

    // Default center coordinates and zoom level
    L.tileLayer(`https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=${key}`, {
        minZoom: 1,
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map); // Replace with your desired tile layer


    const updateButton = document.getElementById('updateRoute');

    // Event listener for the button click
    updateButton.addEventListener('click', async () => {
        // Get the start and end port IDs from the input fields
        const startPortId = document.getElementById('startPort').value;
        const endPortId = document.getElementById('endPort').value;

        // Check if both input fields are filled
        if (!startPortId || !endPortId) {
            alert('Please enter both start and end port IDs.');
            return;
        }
        $(updateButton).addClass('loading')
        const geojsonData = await getRouteData(startPortId, endPortId);

        if (geojsonData) {
            $(updateButton).removeClass('loading')
            plotRoute(map, geojsonData);
        }
    });

    function createPortItem(item, template) {
        let html = template.clone()
        html.find('.port-item-id').text(item.id)
        html.find('.port-item-name').text(convertToTitleCase(item.portName))
        return html;
    }
    function updatePortList() {
        let template = $('.port-item').eq(0).clone();
        $('.input-drop-inner').html('');
        let portList = portData.ports

        portList.forEach((el) => {
            createPortItem(el, template).appendTo('.input-drop-inner')
        })

        $('.port-item').on('click', function(e) {
            e.preventDefault();
            let name = $(this).find('.port-item-name').text();
            let id = $(this).find('.port-item-id').text();
            $(this).closest('.input-wrap').find('.input-field').val(name)
            $(this).closest('.input-wrap').find('.input-hidden').val(id)

            if ($(this).closest('.input-wrap').hasClass('input-wrap-start')) {
                $('.input-wrap-end .port-item').removeClass('hidden-dup')
                $('.input-wrap-end .port-item').each((idx, el) => {
                    if ($(el).find('.port-item-id').text() === id) {
                        $(el).addClass('hidden-dup')
                    }
                })
            } else {
                $('.input-wrap-start .port-item').removeClass('hidden-dup')
                $('.input-wrap-start .port-item').each((idx, el) => {
                    if ($(el).find('.port-item-id').text() === id) {
                        $(el).addClass('hidden-dup')
                    }
                })
            }
        })
    }
    updatePortList()

    let techMapInput = $('.tech-map .input-field');

    techMapInput.on('keyup', function(e) {
        let itemList = $(this).closest('.input-wrap').find('.port-item');
        let value = $(this).val().toLowerCase().trim();
        if (value == '') {
            itemList.removeClass('hidden-srch')
        } else {
            itemList.each((idx, el) => {
                let compVal = $(el).find('.port-item-name').text()
                if (compVal.toLowerCase().includes(value)) {
                    $(el).removeClass('hidden-srch');
                    $(el).slideDown()
                } else {
                    $(el).addClass('hidden-srch');
                    $(el).slideUp()
                }
            })
            if ($(this).closest('.input-wrap').find('.port-item:not(".hidden-srch"):not(".hidden-dup")').length == 0) {
                $(this).closest('.input-wrap').find('.port-item-empty-txt').slideDown()
            } else {
                $(this).closest('.input-wrap').find('.port-item-empty-txt').slideUp()
            }
        }
    })
    techMapInput.on('focus', function(e) {
        $(this).parent('.input-wrap').find('.input-drop').slideDown()
    })
    techMapInput.on('blur', function(e) {
        $(this).parent('.input-wrap').find('.input-drop').slideUp()
        $(this).closest('.input-wrap').find('.port-item').removeClass('hidden-srch')
    })

}
function techMapInteraction() {
    const techMapTitle = new SplitText('.tech-map__title', typeOpts.words)
    const techMapSub = new SplitText('.tech-map__sub', typeOpts.words)
    const techMapTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.tech-map__head',
            start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
        },
        onComplete: () => {
            techMapTitle.revert()
            new SplitText('.tech-map__title', typeOpts.lines)
            techMapSub.revert()
        }
    })
    techMapTl
    .from(techMapTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(techMapSub.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')
    .from('.tech-map__form > *', {yPercent: 25, autoAlpha: 0, duration: .6, stagger: .2, clearProps: 'all'}, '>=-.2')
}
function techControl() {
    const techControlTitle = new SplitText('.tech-control__title', typeOpts.words)
    const techControlSub = new SplitText('.tech-control__richtext', typeOpts.words)
    const techControlTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.tech-control__head',
            start: `top top+=${$(window).width() > 767 ? 65 : 75}%`
        },
        onComplete: () => {
            techControlTitle.revert()
            new SplitText('.tech-control__title', typeOpts.lines)
            techControlSub.revert()
        }
    })
    techControlTl
    .from(techControlTitle.words, {yPercent: 60, autoAlpha: 0, duration: .6, stagger: .02})
    .from(techControlSub.words, {yPercent: 60, autoAlpha: 0, duration: .4, stagger: .02}, '<=.2')

    // if (viewport.width > 767) {
        const tlScrub = gsap.timeline({
            scrollTrigger: {
                trigger: '.tech-control__img',
                start: 'top bottom',
                endTrigger: '.footer',
                end: 'bottom bottom',
                scrub: true,
            }
        })

        requestAnimationFrame(() => {
            tlScrub
            .from('.tech-control__img', {yPercent: 35, ease: 'none'})
        })
    // }
}

const techScript = {
    namespace: 'tech',
    afterEnter() {
        console.log('enter tech')
        setTimeout(() => {
            techHero()
            techVideo()
            techVideoInteraction();
            techDemo()
            techMap()
            techMapInteraction()
            techControl()


        }, 100);
    },
    beforeLeave() {
        console.log('leave tech')
        removeTechMap()
    }
}

export default techScript