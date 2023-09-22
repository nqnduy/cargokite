import Lenis from '@studio-freight/lenis';
import $ from "jquery";

const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

export default lenis;