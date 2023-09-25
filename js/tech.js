import $ from "jquery";
import * as THREE from 'three';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

class techDemoWebGL {
    constructor() {
        this.container = $('.tech-demo__canvas-inner');
        this.scene = new THREE.Scene();
        this.perspective = 1000;
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
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 1000);
        this.camera.position.set(0,0,this.perspective);

        //renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
    }
    onWindowResize() {
        this.camera.aspect = this.viewport.aspectRatio;
        this.camera.fov = (Math.atan(this.viewport.height / 2 / this.perspective) * 2) * 180 / Math.PI;
        this.renderer.setSize(this.viewport.width, this.viewport.height)
        this.camera.updateProjectionMatrix();
    }
    animate() {
        if (!$('[data-barba-namespace="tech"]').length) {

        } else {
            this.renderer.render(this.scene, this.camera)
            console.log('rendering')
        }
        requestAnimationFrame(this.animate.bind(this))
    }
    init() {
        this.setupCamera()
        this.animate()
    }
    reset() {
        this.onWindowResize()
        this.container.append(this.renderer.domElement);
    }
}

function techHero() {

}

let techWebGL = new techDemoWebGL();
techWebGL.init()
function techDemo() {
    techWebGL.reset()
}

export default techScript = {
    namespace: 'tech',
    afterEnter() {
        console.log('enter tech')
        setTimeout(() => {
            techHero()
            techDemo()
            console.log('hello')
        }, 100);
    },
    beforeLeave() {
        console.log('leave tech')
    }
}