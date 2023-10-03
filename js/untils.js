import $ from "jquery";
import gsap from "gsap";
import SplitText from "./vendors/SplitText";

gsap.registerPlugin(SplitText)

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

function createToc(lenis, richtextEl, tocEl, htmlTemplate) {
    let headings = $(richtextEl).find('h2');
    let tocWrap = $(tocEl);
    let tocItem = htmlTemplate.attr('class')

    if (headings.length <= 1) {
        tocWrap.parent().remove();
    }

    tocWrap.html('');
    for (let i = 0; i < headings.length; i++) {
        headings.eq(i).attr('id', `toc-${i}`);
        let tocItem = htmlTemplate.clone();
        
        let tocOrdinal = i + 1 < 10 ? `0${i + 1}` : i + 1;
        tocItem.find('[data-toc="number"]').text(tocOrdinal);

        if (headings.eq(i).text().includes('. ')) {
            let [ordinal, ...[title]] = headings.eq(i).text().split('. ');
            tocItem.find('[data-toc="title"]').text(title);
        } else {
            tocItem.find('[data-toc="title"]').text(headings.eq(i).text());
        }
        tocItem.attr('href',`#toc-${i}`)
        tocWrap.append(tocItem);
    }
    //mobile
    // $('.toc-head-txt').eq(index).text($('.toc-item-link[href="#toc-0"]').text());

    lenis.on('scroll', function (e) {
        let currScroll = e.scroll;
        for (let i = 0; i < headings.length; i++) {
            let top = headings.eq(i).get(0).getBoundingClientRect().top;
            if (top > 0 && top < ($(window).height() / 5)) {
                $(`.${tocItem}[href="#toc-${i}"]`).addClass('active');
                $(`.${tocItem}`).not(`[href="#toc-${i}"]`).removeClass('active');
                //mobile
                // $('.toc-head-txt').eq(index).text($(`.toc-item-link[href="#toc-${i}"]`).text());
            }
        }
    });

    $(`.${tocItem}`).on('click', function (e) {
        e.preventDefault();
        let target = $(this).attr("href");
        lenis.scrollTo(target, {
            offset: -100,
        })

        //history.replaceState({}, '', `${window.location.pathname + target}`)
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
    //updateToc();
}

export { nestedLinesSplit, createToc }