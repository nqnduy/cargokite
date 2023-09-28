
export default class LoaderComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="trans__wrapper">
            <div class="trans__logo">
                <img src="${new URL('../../imgs/logo-icon.svg', import.meta.url)}" alt="Logo icon" width="146" height="146">
            </div>
            <div class="trans__inner">
                <div class="trans__item"></div>
                <div class="trans__item"></div>
                <div class="trans__item"></div>
                <div class="trans__item"></div>
                <div class="trans__item"></div>
                <div class="trans__item"></div>
            </div>
        </div>
        `
    }
}

customElements.define('loader-component', LoaderComponent);

