import $ from "jquery";
import * as THREE from 'three';
import * as L from 'leaflet';
import portData from '../data/port.json'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";
import Flip from "./vendors/Flip";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

gsap.registerPlugin(ScrollTrigger, Flip); 

function convertToTitleCase(str) {
    if (!str) {
        return ""
    }
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}
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

        const geoJsonLayer = L.geoJSON(reversedGeoJson, {
            style: {
                color: '#0074D9',
                weight: 4,
            },
        }).addTo(routeLayer);

        // Fit the map to the route's bounding box
        const bounds = L.geoJSON(reversedGeoJson).getBounds();
        map.fitBounds(bounds, {
            padding: [20, 20],
        });

        const popup = L.popup();

        // Add mousemove event handler to the GeoJSON layer
        geoJsonLayer.on('mousemove', handleMouseMove);

        // Remove popup when mouse leaves the GeoJSON layer
        geoJsonLayer.on('mouseout', handleMouseOut);

        function handleMouseMove(e) {
            const { duration_hr, distance_km, average_speed_km_h } = geojsonData.properties;
            const days = Math.floor(duration_hr / 24);
            const hours = Math.floor(duration_hr % 24);
            const minutes = Math.floor(((duration_hr % 24) % 1) * 60);

            const popupContent = `
            <div class="txt txt-16">
            <span class="txt-bold">Estimated Median Duration:</span> ${days} days ${hours} hours ${minutes} minutes<br>
            <span class="txt-bold">Estimated Median Distance:</span> ${distance_km.toFixed(2)} km<br>
            <span class="txt-bold">Estimated Average Speed:</span> ${average_speed_km_h.toFixed(2)} km/h
            </div>
        `;

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
            alert('No route available for the selected ports.');
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
    let map = L.map('techMap').setView([0, 20], 2);
    // Default center coordinates and zoom level
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 19,
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
                console.log('start')
                $('.input-wrap-end .port-item').removeClass('hidden-dup')
                $('.input-wrap-end .port-item').each((idx, el) => {
                    if ($(el).find('.port-item-id').text() === id) {
                        $(el).addClass('hidden-dup')
                    }
                })
            } else {
                console.log('end')
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

    $('.tech-map .input-field').on('keyup', function(e) {
        let itemList = $(this).closest('.input-wrap').find('.port-item');
        let value = $(this).val().toLowerCase().trim();
        if (value == '') {
            itemList.removeClass('hidden-srch')
            itemList.each((el) => console.log(el))
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
    $('.tech-map .input-field').on('focus', function(e) {
        $(this).parent('.input-wrap').find('.input-drop').slideDown()
    })
    $('.tech-map .input-field').on('blur', function(e) {
        $(this).parent('.input-wrap').find('.input-drop').slideUp()
        $(this).closest('.input-wrap').find('.port-item').removeClass('hidden-srch')
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
            techMap()
        }, 100);
    },
    beforeLeave() {
        console.log('leave tech')
    }
}

export default techScript