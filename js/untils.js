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

const lerp = (a,b,t = 0.08) => {
    return a + (b - a) * t;
}
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}
let pointer = {x: 0, y: 0};
$(window).on('pointermove', function(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
})
const pointerCurr = () => {
    return pointer
}
const xSetter = (el) => gsap.quickSetter(el, 'x', `px`);
const ySetter = (el) => gsap.quickSetter(el, 'y', `px`);

const xGetter = (el) => gsap.getProperty(el, 'x')
const yGetter = (el) => gsap.getProperty(el, 'y')

function toHTML(richTextArray, pClass, linkClass) {
    let html = '';
    for (const block of richTextArray) {
        switch (block.type) {
        case 'paragraph':
            let string = block.text;
            for (const span of block.spans) {
                switch (span.type) {
                    case 'label':
                        let tag;
                        switch (span.data.label) {
                            case 'contact':
                            tag = "contact"
                        }
                        string = string.replace(block.text.substring(span.start, span.end),`<a href="#" class="${linkClass}" data-popup="${tag}" >${block.text.substring(span.start, span.end)}</a>`);
                    break;
                    case 'hyperlink':
                        let link = new URL(span.data.url)
                        string = string.replace(block.text.substring(span.start, span.end),`<a href="${window.location.origin}${link.pathname}${link.hash}" class="${linkClass}">${block.text.substring(span.start, span.end)}</a>`);
                    break;
                    default:
                    break;
                }
            }
            html += `<p class="${pClass}">${string}</p>`;
        break;
        case 'list-item':
            let listString = block.text;
            for (const span of block.spans) {
                switch (span.type) {
                    case 'label':
                        let tag;
                        switch (span.data.label) {
                            case 'contact':
                            tag = "contact"
                        }
                        listString = listString.replace(block.text.substring(span.start, span.end),`<a href="#" class="${linkClass}" data-popup="${tag}" >${block.text.substring(span.start, span.end)}</a>`);
                    break;
                    case 'hyperlink':
                        let link = new URL(span.data.url)
                        listString = listString.replace(block.text.substring(span.start, span.end),`<a href="${window.location.origin}${link.pathname}${link.hash}" class="${linkClass}">${block.text.substring(span.start, span.end)}</a>`);
                    break;
                    default:
                    break;
                }
            }
            html += `<li class="txt txt-16 txt-li">${listString}</li>`;
        break;
        default:
            console.error(`Unsupported block type: ${block.type}`);
        }
    }
    return html;
}
function sortAsc(arr) {
    return arr.sort((a,b) => {
        if (a.data.order === null) {
            return 1;
        }
        if (b.data.order === null) {
            return -1;
        }
        if (a.data.order === b.data.order) {
            return 0;
        }
        return a.data.order < b.data.order ? -1 : 1;
    })
}

export { nestedLinesSplit, createToc, lerp, isTouchDevice, pointerCurr, xSetter, ySetter, xGetter, yGetter, toHTML, sortAsc }