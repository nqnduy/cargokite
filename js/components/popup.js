
export default class PopupComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="popup">
            <div class="popup__overlay"></div>
            <div class="popup__main">
                <form action="#" class="popup__main-form">
                    <div class="popup__main-head">
                        <h3 class="heading h4 popup__main-head-title heading-f-lh">
                            Get in touch with us!
                        </h3>
                        <div class="txt txt-18 popup__main-head-txt">
                            We are currently working at full speed on the development of the ship. Feel free to reach out to us if you are keen on finding out more about CargoKite.
                        </div>
                    </div>
                    <div class="popup__main-contact">
                        <div class="txt txt-18 popup__main-contact-label">
                            Or just wanna say hi?
                        </div>
                        <a href="#" class="txt txt-24 popup__main-contact-link hover-un">
                            info@cargokite.com
                        </a>
                    </div>
                    <div class="popup__main-form-inner">
                        <div class="input-wrap">
                            <input type="text" class="txt txt-18 input-field" placeholder="Your name">
                            <div class="input-field-line"></div>
                        </div>
                        <div class="input-wrap">
                            <input type="email" class="txt txt-18 input-field" placeholder="Your email">
                            <div class="input-field-line"></div>
                        </div>
                        <div class="input-wrap textarea-wrap">
                            <textarea name="message" cols="30" rows="3" class="txt txt-18 input-field" placeholder="Message"></textarea>
                            <div class="input-field-line"></div>
                        </div>
                    </div>
                    <button type="submit" class="popup__main-submit arr-hover">
                        <div class="popup__main-submit-inner">
                            <div class="heading h6 heading-bold">Send message</div>
                            <div class="arr-wrap arr-wrap-32">
                                <div class="icon icon-32 arr-ic-main">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4401 3.68089L3.00001 31.121L0.878693 28.9997L28.3188 1.55957L30.4401 3.68089Z" fill="currentColor"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 1.5H30.5V27.5H27.5V4.5H4.5V1.5Z" fill="currentColor"/>
                                    </svg>
                                </div>
                                <div class="icon icon-32 arr-ic-clone">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4401 3.68089L3.00001 31.121L0.878693 28.9997L28.3188 1.55957L30.4401 3.68089Z" fill="currentColor"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 1.5H30.5V27.5H27.5V4.5H4.5V1.5Z" fill="currentColor"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="popup__main-submit-aspect"></div>
                    </button>
                </form>
                
                <a href="#" class="popup__close" data-popup="close">
                    <div class="icon icon-32">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.1924 6.80664L6.80762 25.1914M6.80762 6.80664L25.1924 25.1914" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </div>
                </a>
            </div>
        </div>
        `
    }
}

customElements.define('popup-component', PopupComponent);

