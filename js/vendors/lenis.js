import Lenis from '@studio-freight/lenis';
import $ from "jquery";

const lenis = new Lenis({
  content: $(window).width() > 767 ? document.documentElement : $('.wrapper').get(0),
})
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

export default lenis;