import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "./vendors/SplitText";
import { nestedLinesSplit } from './untils';

function techHero() {

}

export default techScript = {
    namespace: 'tech',
    afterEnter() {
        console.log('enter tech')
        setTimeout(() => {
            techHero()
            console.log('hello')
        }, 100);
    },
    beforeLeave() {
        console.log('leave tech')
    }
}