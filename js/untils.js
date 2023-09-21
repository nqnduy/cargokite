import gsap from "gsap";
import SplitText from "./vendors/SplitText";
function nestedLinesSplit(target, vars) {
    target = gsap.utils.toArray(target);
    if (target.length > 1) {
    let splits = target.map(t => nestedLinesSplit(t, vars)),
        result = splits[0],
        resultRevert = result.revert;
    result.lines = splits.reduce((acc, cur) => acc.concat(cur.lines), []);
    result.revert = () => splits.forEach(s => s === result ? resultRevert() : s.revert());
    return result;
    }
    target = target[0];
    let contents = target.innerHTML;
    gsap.utils.toArray(target.children).forEach(child => {
    let split = new SplitText(child, {type: "lines"});
    split.lines.forEach(line => {
        let clone = child.cloneNode(false);
        clone.innerHTML = line.innerHTML;
        target.insertBefore(clone, child);
    });
    target.removeChild(child);
    });
    let split = new SplitText(target, vars),
        originalRevert = split.revert;
    split.revert = () => { 
    originalRevert.call(split); 
    target.innerHTML = contents; 
    };
    return split;
}

function createToc(lenis, richtextEl, tocEl) {
    let headings = $(richtextEl).find('h2');
    let tocWrap = $(tocEl);

    if (headings.length <= 1) {
        tocWrap.parent().remove();
    }

    tocWrap.html('');
    for (let i = 0; i < headings.length; i++) {
        headings.eq(i).attr('id', `toc-${i}`);
        let tocItem = $('<a></a>').addClass('toc-item-link').attr('href', `#toc-${i}`);
        let tocOrdinal = $('<div></div>').addClass('txt txt-12 toc-item-ordinal').text(`${i + 1 < 10 ? `0${i + 1}` : i + 1}`).appendTo(tocItem);
        let [ordinal, ...[title]] = headings.eq(i).text().split('. ');
        let tocName = $('<div></div>').addClass('txt txt-16 toc-item-txt').text(`${[ordinal].join('')}`).appendTo(tocItem);

        tocWrap.append(tocItem);
    }
    //mobile
    // $('.toc-head-txt').eq(index).text($('.toc-item-link[href="#toc-0"]').text());

    lenis.on('scroll', function (e) {
        let currScroll = e.scroll;
        for (let i = 0; i < headings.length; i++) {
            let top = headings.eq(i).get(0).getBoundingClientRect().top;
            if (top > 0 && top < ($(window).height() / 5)) {
                $(`.toc-item-link[href="#toc-${i}"]`).addClass('active');
                $(`.toc-item-link`).not(`[href="#toc-${i}"]`).removeClass('active');
                //mobile
                // $('.toc-head-txt').eq(index).text($(`.toc-item-link[href="#toc-${i}"]`).text());
            }
        }
    });

    $('.toc-item-link').on('click', function (e) {
        e.preventDefault();
        let target = $(this).attr("href");

        lenis.scrollTo(target, {
            offset: -100,
        })

        history.replaceState({}, '', `${window.location.pathname + target}`)
        return false;
    })

    function updateToc() {
        const currentToc = window.location.hash;
        if (!currentToc) return;
        if ($(currentToc).length) {
            setTimeout(() => {
                $(`.toc-item-link[href="${currentToc}"]`).trigger('click');
            }, 10);
        } else {
            history.replaceState({}, '', window.location.pathname)
        }
    }
    updateToc();
}

export { nestedLinesSplit, createToc }