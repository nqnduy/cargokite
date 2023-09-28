export default class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <footer class="footer">
            <div class="container grid">
                <div class="footer__form-wrap">
                    <div class="icon icon-80 footer__form-icon">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M65 21.667L40 46.667L15 21.667" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
                            <path d="M70 10H9.99998C6.31808 10 3.33331 12.9848 3.33331 16.6667V63.3333C3.33331 67.0152 6.31808 70 9.99998 70H70C73.6819 70 76.6666 67.0152 76.6666 63.3333V16.6667C76.6666 12.9848 73.6819 10 70 10Z" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/>
                            <path d="M26.6667 46.667L15 58.3337" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
                            <path d="M53.3333 46.667L65 58.3337" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="heading h4 footer__form-title">
                        Subscribe Newsletters
                    </div>
                    <div class="txt txt-16 footer__form-sub">
                        Want to stay up to date? Sign up for CargoKite's biannual update.
                    </div>
                    <form class="footer__form-main">
                        <div class="input-wrap">
                            <input type="email" class="txt txt-16 input-field" placeholder="Enter your email">
                        </div>
                        <button class="btn btn-pri btn-lg input-submit" type="submit">
                            <div class="txt txt-18 txt-med">
                                Subscribe
                            </div>
                        </button>
                    </form>
                    <div class="txt txt-12 footer__form-caption">
                        Don't worry about spam. We hate it too!
                    </div>
                </div>
                <div class="footer__main">
                    <div class="footer__links">
                        <a href="./" class="footer__link txt txt-20 txt-med" data-link="home">Home.</a>
                        <a href="./about.html" class="footer__link txt txt-20 txt-med tag-wrap" data-link="about">
                            About.
                            <span class="tag-link">
                                we're hiring
                            </span>
                        </a>
                        <a href="./tech.html" class="footer__link txt txt-20 txt-med" data-link="tech">Technology.</a>
                        <a href="./news.html" class="footer__link txt txt-20 txt-med" data-link="news">News & Media.</a>
                        <a href="#" data-popup="contact" class="footer__link txt txt-20 txt-med" data-link="contact">Get in touch.</a>
                    </div>
                    <div class="footer__info grid">
                        <div class="footer__info-addr grid">
                            <div class="footer__info-addr-grp">
                                <div class="txt txt-16 footer__info-addr-label">
                                    Head office
                                </div>
                                <div class="txt txt-14 footer__info-addr-txt">
                                    CargoKite GmbH <br>
                                    Liebherrstraße 20 <br>
                                    80538 München <br>
                                    Germany
                                </div>
                            </div>
                            <div class="footer__info-addr-grp">
                                <div class="txt txt-16 footer__info-addr-label">
                                    Postal & Visitor address
                                </div>
                                <div class="txt txt-14 footer__info-addr-txt">
                                    CargoKite GmbH <br>
                                    Liebherrstraße 20 <br>
                                    80538 München <br>
                                    Germany
                                </div>
                            </div>
                        </div>
                        <div class="footer__info-contact">
                            <div class="footer__info-contact-grp">
                                <div class="txt txt-14 footer__info-contact-label">
                                    Email
                                </div>
                                <a href="mailto:info@cargokite.com" class="txt txt-28 footer__info-contact-link">
                                    info@cargokite.com
                                </a>
                            </div>
                            <div class="footer__info-contact-grp">
                                <div class="txt txt-14 footer__info-contact-label">
                                    Phone
                                </div>
                                <a href="tel:+49 89 52036527" class="txt txt-28 footer__info-contact-link">
                                    +49 89 52036527
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="footer__info grid">
                        <div class="txt txt-14 footer__info-copy">
                            © 2023, CargoKite. All Rights Reserved.
                        </div>
                        <div class="footer__info-legal">
                            <a href="#" class="txt txt-14 footer__info-legal-link">
                                Legal notice
                            </a>
                            <a href="./privacy.html" class="txt txt-14 footer__info-legal-link">
                                Privacy policy
                            </a>
                            <a href="#" class="txt txt-14 footer__info-legal-link">
                                Linkedin
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <a href="#" class="footer__marquee">
                <div class="footer__marquee-wrap">
                    <div class="heading footer__marquee-item">
                        Are you interested? Let's discuss today!
                    </div>
                    <div class="heading footer__marquee-item">
                        Are you interested? Let's discuss today!
                    </div>
                </div>
            </a>
        </footer>
        `
    }
}

customElements.define('footer-component', FooterComponent);

