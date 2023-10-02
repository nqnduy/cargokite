import $ from "jquery";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";
import Flip from "./vendors/Flip";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

gsap.registerPlugin(ScrollTrigger, Flip); 

class techDemoWebGL {
    constructor() {
        this.container = $('.tech-demo__canvas-inner');
        this.scene = new THREE.Scene();
        this.hdri = new THREE.CubeTextureLoader()
        .load([
            new URL('../assets/map/px.png', import.meta.url),
            new URL('../assets/map/nx.png', import.meta.url),
            new URL('../assets/map/py.png', import.meta.url),
            new URL('../assets/map/ny.png', import.meta.url),
            new URL('../assets/map/pz.png', import.meta.url),
            new URL('../assets/map/nz.png', import.meta.url)
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
        fov = 32.26880414280885;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 10000);
        this.camera.position.set(74.63897705078125, 16.265151023864746, -51.48991394042969)
        this.lookAtTarget = new THREE.Vector3(49.7516, 24.9304, -1.35464)
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
        let url = new URL('../assets/cargo-demo-3.gltf', import.meta.url)
        url = "" + url;
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        this.dracoLoader.setDecoderConfig({type: 'js'})
        this.loader.setDRACOLoader( this.dracoLoader )
        
        this.loader.load(url, 
        (glb) => {
            console.log(glb)
            this.model = glb.scene;
            this.scene.environment = this.hdri;
            //this.scene.fog = new THREE.Fog( 0x212121, 0, 120 );
            let orangeMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#FF471D'),
                envMapIntensity: 4,
                roughness: .35,
                metalness: 0
            })
            let darkMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#2B2C2F'),
                envMapIntensity: 4,
                roughness: .6,
                metalness: 0
            })
            this.model.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    if (obj.name === 'kite') {
                        obj.material = orangeMat;
                    } else if (obj.name == 'Propeller1') {
                        this.prop1 = obj
                        obj.material = darkMat;
                    } else if (obj.name == 'Propeller2') {
                        this.prop2 = obj
                        obj.material = darkMat;
                    } else {
                        obj.material = darkMat;
                    }
                }
            })
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
            this.renderer.render(this.scene, this.camera)
        }
        requestAnimationFrame(this.animate.bind(this))
    }
    scrollAnimate() {
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.tech-demo__main',
                start: 'top top',
                end: 'bottom bottom',
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
        .to(this.camera.position, {
            x: -43.3858,
            y: 3.16929,
            z: -17.9227,
            duration: 1
        }, '0')
        .to(this.lookAtTarget, {
            x: -19.2134,
            y: 5.46543,
            z: -0.014547,
            duration: 1
        }, '<=0')
        .to(this.camera.position, {
            x: -36.182,
            y: 28.6084,
            z: 52.1051,
            duration: 1
        })
        .to(this.lookAtTarget, {
            x: 11.3448,
            y: 6.2503,
            z: 0.056603,
            duration: 1
        }, '<=0')
    }
    init() {
        this.setupCamera()
        this.createMesh()
        //this.animate()
    }
    reset() {
        this.container.append(this.renderer.domElement);
        this.onWindowResize()
    }
}

function techHero() {

}
function techVideo() {
    const container = $('.tech-vid')
    const item = $('.tech-vid__main-inner');
    container.addClass('end-state')
    let state = Flip.getState(item)
    container.removeClass('end-state')
    Flip.to(state, {
        simple: true,
        scrollTrigger: {
            trigger: '.tech-vid__main',
            start: `top top+=${($(window).height() - $('.tech-vid__holder').height())  / 2}`,
            end: 'top -=150%',
            scrub: true,
            pin: true,
            // pinSpacing: true
        }
    })
}



function techDemo() {
    let techWebGL = new techDemoWebGL();
    techWebGL.init()
    techWebGL.reset()
}

const techScript = {
    namespace: 'tech',
    afterEnter() {
        console.log('enter tech')
        setTimeout(() => {
            console.log('hello')
            techHero()
            techVideo()
            techDemo()
        }, 100);
    },
    beforeLeave() {
        console.log('leave tech')
    }
}

export default techScript