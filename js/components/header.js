
export default class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <header class="header">
                <div class="container">
                    <a href="./" class="header__logo">
                        <svg width="168" height="32" viewBox="0 0 168 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M37.6538 15.322C37.6538 14.1039 37.8683 12.8858 38.2973 11.6754C38.7263 10.4649 39.3469 9.38472 40.1743 8.4271C40.994 7.47713 41.9976 6.69571 43.1927 6.09815C44.3878 5.50059 45.7438 5.19415 47.2684 5.19415C49.0764 5.19415 50.6239 5.60785 51.9033 6.43523C53.1827 7.26262 54.1326 8.3275 54.7608 9.62221L53.558 10.3117C53.198 9.60689 52.769 9.01699 52.2863 8.53435C51.8037 8.05937 51.2751 7.66866 50.7158 7.37754C50.1566 7.07876 49.5667 6.86425 48.9538 6.73401C48.3409 6.60378 47.7433 6.53483 47.1534 6.53483C45.8587 6.53483 44.7096 6.7953 43.7213 7.32391C42.7331 7.84486 41.8903 8.52669 41.2008 9.3694C40.5114 10.2121 39.9981 11.1544 39.6457 12.2193C39.2933 13.2765 39.1171 14.3414 39.1171 15.4063C39.1171 16.609 39.3239 17.7505 39.7453 18.8384C40.1666 19.9263 40.7335 20.8839 41.4613 21.7113C42.1891 22.5387 43.0472 23.2052 44.0354 23.7031C45.0237 24.2011 46.0962 24.4462 47.2377 24.4462C47.8506 24.4462 48.4788 24.3696 49.1223 24.2164C49.7735 24.0632 50.3941 23.8257 50.984 23.5039C51.5738 23.1822 52.1254 22.7685 52.6464 22.2629C53.1597 21.7572 53.5887 21.1597 53.9334 20.4778L55.1898 21.0754C54.8451 21.8415 54.3778 22.5157 53.7879 23.1056C53.198 23.6955 52.5391 24.1934 51.8113 24.5918C51.0835 24.9902 50.3174 25.289 49.5054 25.4958C48.6933 25.695 47.8966 25.7946 47.1151 25.7946C45.7208 25.7946 44.4491 25.4881 43.3 24.8753C42.1432 24.2624 41.1472 23.4733 40.3122 22.485C39.4695 21.5044 38.8183 20.3859 38.351 19.1372C37.8913 17.8961 37.6538 16.6244 37.6538 15.322Z" fill="white"/>
                            <path d="M62.0235 25.9095C61.334 25.9095 60.6981 25.7869 60.1082 25.5494C59.5183 25.3119 58.9974 24.9902 58.553 24.5765C58.101 24.1628 57.7563 23.6802 57.5111 23.1209C57.266 22.5617 57.1357 21.9564 57.1357 21.3052C57.1357 20.6541 57.289 20.0642 57.5954 19.5279C57.9018 18.9916 58.3232 18.532 58.8671 18.1413C59.4111 17.7505 60.0622 17.4441 60.8283 17.2296C61.5944 17.0074 62.4295 16.9002 63.3488 16.9002C64.1532 16.9002 64.9576 16.9691 65.762 17.1147C66.5741 17.2602 67.3019 17.4518 67.9531 17.7046V16.249C67.9531 14.8394 67.5547 13.7209 66.7503 12.8858C65.9459 12.0584 64.8657 11.6447 63.4867 11.6447C62.7589 11.6447 61.9928 11.7979 61.1807 12.1044C60.3687 12.4108 59.549 12.8475 58.7062 13.4221L58.1623 12.4491C60.0699 11.1544 61.8779 10.5032 63.594 10.5032C65.3866 10.5032 66.7963 11.0242 67.8305 12.0584C68.8571 13.1003 69.378 14.5329 69.378 16.3639V23.6265C69.378 24.1015 69.5849 24.339 70.0062 24.339V25.6261C69.9143 25.6414 69.807 25.6567 69.7074 25.672C69.6002 25.6797 69.5083 25.6873 69.4393 25.6873C69.0563 25.6873 68.7498 25.5571 68.5276 25.3043C68.2978 25.0438 68.1676 24.7374 68.1293 24.3773V23.1362C67.4398 24.0326 66.5664 24.7221 65.5016 25.197C64.4214 25.6644 63.2645 25.9095 62.0235 25.9095ZM62.3146 24.7604C63.4178 24.7604 64.4367 24.5535 65.3637 24.1322C66.2906 23.7108 66.9954 23.1592 67.4934 22.4697C67.7999 22.0713 67.9531 21.6883 67.9531 21.3282V18.7005C67.2636 18.4324 66.5511 18.2332 65.808 18.1029C65.0649 17.9727 64.2911 17.9038 63.4944 17.9038C62.7513 17.9038 62.0771 17.988 61.4642 18.1489C60.8513 18.3098 60.3304 18.532 59.8937 18.8231C59.457 19.1065 59.1199 19.4589 58.8748 19.865C58.6373 20.2787 58.5147 20.7307 58.5147 21.221C58.5147 21.7189 58.6067 22.1863 58.7982 22.6229C58.9897 23.0596 59.2578 23.435 59.6026 23.7491C59.9473 24.0632 60.3534 24.3084 60.8207 24.4922C61.2803 24.6761 61.7783 24.7604 62.3146 24.7604Z" fill="white"/>
                            <path d="M80.7623 12.0354C79.4293 12.0737 78.2571 12.4721 77.2612 13.2229C76.2576 13.9736 75.5605 15.0079 75.1621 16.3256V25.6184H73.7295V10.7484H75.1008V14.4103C75.6141 13.3608 76.2959 12.5104 77.1463 11.8515C77.9967 11.1927 78.9083 10.8173 79.8813 10.7177C80.0728 10.7024 80.2413 10.6871 80.3946 10.6871C80.5478 10.6871 80.6704 10.6871 80.77 10.6871V12.0354H80.7623Z" fill="white"/>
                            <path d="M88.7374 25.8482C87.7108 25.8482 86.7608 25.6337 85.9028 25.2047C85.0448 24.7757 84.3017 24.2011 83.6888 23.4886C83.0682 22.7762 82.5856 21.9564 82.2332 21.0448C81.8808 20.1331 81.7046 19.1832 81.7046 18.2102C81.7046 17.199 81.8731 16.226 82.2026 15.2914C82.5396 14.3567 83.007 13.5293 83.6198 12.8169C84.2327 12.1044 84.9605 11.5375 85.8109 11.1161C86.6613 10.6948 87.5959 10.4879 88.6301 10.4879C89.9248 10.4879 91.0587 10.825 92.0163 11.5068C92.9816 12.181 93.7936 13.0084 94.4602 13.9813V10.7484H95.7778V25.9095C95.7778 26.9208 95.5863 27.8094 95.2033 28.5679C94.8202 29.334 94.3146 29.9622 93.6711 30.4678C93.0352 30.9734 92.2921 31.3565 91.4417 31.6093C90.5913 31.8698 89.7027 31.9923 88.768 31.9923C87.91 31.9923 87.1362 31.9081 86.4544 31.7472C85.7649 31.5863 85.1597 31.3565 84.6388 31.0577C84.1178 30.7589 83.6505 30.3989 83.2368 29.9698C82.8231 29.5408 82.4707 29.0658 82.1642 28.5526L83.1372 27.8937C83.7271 28.905 84.5315 29.6404 85.5428 30.1077C86.554 30.5751 87.6342 30.8049 88.7757 30.8049C89.5418 30.8049 90.2619 30.6976 90.9361 30.4908C91.6103 30.2839 92.2002 29.9698 92.7058 29.5638C93.2114 29.1501 93.6098 28.6445 93.9086 28.0316C94.2073 27.4187 94.3529 26.7063 94.3529 25.8865V22.6229C93.74 23.5959 92.9356 24.3696 91.9244 24.9519C90.9054 25.5571 89.8482 25.8482 88.7374 25.8482ZM89.0821 24.6225C89.7103 24.6225 90.3232 24.4999 90.9284 24.2624C91.526 24.0249 92.0699 23.7108 92.5602 23.3354C93.0429 22.9524 93.4489 22.5233 93.763 22.0484C94.0771 21.5734 94.2763 21.0984 94.3529 20.6158V15.728C94.1231 15.1535 93.8166 14.6249 93.4412 14.1422C93.0582 13.6596 92.6292 13.2382 92.1389 12.9011C91.6562 12.5564 91.1276 12.2883 90.5684 12.0891C90.0091 11.8899 89.4422 11.7903 88.8676 11.7903C87.9713 11.7903 87.1669 11.9818 86.4621 12.3649C85.7573 12.7479 85.1597 13.2459 84.6771 13.8511C84.1944 14.464 83.819 15.1535 83.5585 15.9272C83.2981 16.701 83.1755 17.4747 83.1755 18.2562C83.1755 19.1142 83.3287 19.9263 83.6352 20.6847C83.9416 21.4508 84.363 22.125 84.8916 22.7149C85.4278 23.3048 86.056 23.7721 86.7762 24.1168C87.4886 24.4463 88.2624 24.6225 89.0821 24.6225Z" fill="white"/>
                            <path d="M106.473 25.9095C105.423 25.9095 104.458 25.7027 103.569 25.2966C102.68 24.8829 101.914 24.3313 101.263 23.6265C100.612 22.9217 100.106 22.102 99.7462 21.1673C99.3861 20.2327 99.2023 19.2521 99.2023 18.2179C99.2023 17.1683 99.3861 16.18 99.7615 15.2454C100.137 14.3108 100.643 13.491 101.294 12.7862C101.945 12.0814 102.711 11.5221 103.6 11.1161C104.488 10.7101 105.446 10.5032 106.473 10.5032C107.499 10.5032 108.457 10.7101 109.33 11.1161C110.203 11.5298 110.977 12.0814 111.636 12.7862C112.295 13.491 112.808 14.3108 113.184 15.2454C113.559 16.18 113.743 17.1683 113.743 18.2179C113.743 19.2444 113.559 20.2327 113.184 21.1673C112.808 22.102 112.303 22.9217 111.651 23.6265C111 24.3313 110.234 24.8906 109.345 25.2966C108.464 25.7027 107.507 25.9095 106.473 25.9095ZM100.643 18.2715C100.643 19.1525 100.796 19.9722 101.102 20.746C101.409 21.5198 101.822 22.1939 102.343 22.7608C102.864 23.3354 103.485 23.7874 104.19 24.1168C104.894 24.4539 105.645 24.6148 106.45 24.6148C107.254 24.6148 108.005 24.4463 108.71 24.1168C109.414 23.7874 110.035 23.3201 110.571 22.7302C111.107 22.1403 111.521 21.4585 111.828 20.6847C112.134 19.9109 112.287 19.0759 112.287 18.1796C112.287 17.3062 112.134 16.4788 111.828 15.7051C111.521 14.9313 111.1 14.2571 110.571 13.6749C110.035 13.0927 109.422 12.633 108.725 12.2882C108.028 11.9435 107.277 11.775 106.48 11.775C105.676 11.775 104.925 11.9435 104.22 12.2882C103.515 12.633 102.903 13.1003 102.374 13.6902C101.853 14.2801 101.432 14.9696 101.118 15.7663C100.796 16.5554 100.643 17.3905 100.643 18.2715Z" fill="white"/>
                            <path d="M117.229 25.6184V5.33973H120.431V15.7817L129.984 5.30908H133.531L125.526 14.2878L133.991 25.6184H130.413L123.549 16.2643L120.431 19.4973V25.6184H117.229Z" fill="white"/>
                            <path d="M135.707 8.20496V4.74219H138.856V8.20496H135.707ZM135.707 25.6184V10.6641H138.856V25.6261H135.707V25.6184Z" fill="white"/>
                            <path d="M150.952 24.8523C150.554 25.0438 150.002 25.2583 149.29 25.4958C148.585 25.7333 147.834 25.8559 147.03 25.8559C146.532 25.8559 146.065 25.7869 145.628 25.6567C145.191 25.5264 144.801 25.3272 144.471 25.0591C144.134 24.791 143.874 24.4462 143.682 24.0172C143.491 23.5882 143.399 23.0672 143.399 22.462V13.0926H141.422V10.6641H143.399V5.74573H146.547V10.6641H149.811V13.0926H146.547V21.4431C146.586 21.9794 146.754 22.3624 147.045 22.5999C147.344 22.8374 147.704 22.96 148.148 22.96C148.585 22.96 149.006 22.8834 149.405 22.7302C149.803 22.5769 150.102 22.4544 150.293 22.3548L150.952 24.8523Z" fill="white"/>
                            <path d="M159.533 25.9095C158.368 25.9095 157.311 25.7026 156.361 25.2966C155.411 24.8829 154.591 24.3313 153.917 23.6265C153.243 22.9217 152.714 22.102 152.347 21.1673C151.971 20.2327 151.787 19.2444 151.787 18.1949C151.787 17.1453 151.971 16.1494 152.347 15.2071C152.722 14.2648 153.243 13.4297 153.917 12.7172C154.591 12.0048 155.411 11.4379 156.361 11.0318C157.311 10.6181 158.384 10.4189 159.563 10.4189C160.728 10.4189 161.777 10.6258 162.727 11.0471C163.67 11.4685 164.474 12.0278 165.141 12.7172C165.807 13.4144 166.32 14.2265 166.673 15.1458C167.025 16.0728 167.201 17.038 167.201 18.0493C167.201 18.2791 167.194 18.4936 167.171 18.6928C167.148 18.892 167.132 19.0606 167.109 19.1908H155.128C155.181 19.8573 155.342 20.4625 155.603 20.9911C155.863 21.5197 156.192 21.9871 156.606 22.3778C157.012 22.7685 157.48 23.0673 158.008 23.2818C158.529 23.4886 159.081 23.5959 159.655 23.5959C160.077 23.5959 160.49 23.5422 160.896 23.435C161.31 23.3277 161.685 23.1745 162.023 22.9753C162.367 22.7761 162.674 22.531 162.942 22.2475C163.21 21.9641 163.417 21.65 163.57 21.3052L166.259 22.079C165.746 23.2052 164.888 24.1245 163.7 24.8369C162.497 25.5494 161.111 25.9095 159.533 25.9095ZM164.076 17.0151C164.022 16.3869 163.861 15.8046 163.601 15.2684C163.34 14.7321 163.011 14.2801 162.612 13.9124C162.214 13.537 161.747 13.2535 161.21 13.039C160.674 12.8322 160.115 12.7249 159.525 12.7249C158.935 12.7249 158.376 12.8322 157.855 13.039C157.334 13.2459 156.867 13.537 156.468 13.9124C156.07 14.2878 155.74 14.7397 155.495 15.2684C155.25 15.8046 155.097 16.3869 155.036 17.0151H164.076Z" fill="white"/>
                            <path d="M24.0709 24.0862C20.248 24.2011 15.9962 22.3548 12.6407 19.2138C11.8822 23.6265 12.8475 26.9821 15.3833 28.5372C18.1413 30.2303 22.1556 29.5025 25.3809 26.7216C26.5914 25.6414 27.6103 24.385 28.4223 22.983C27.1353 23.6648 25.672 24.0402 24.0709 24.0862Z" fill="white"/>
                            <path d="M11.1927 17.6892C10.0053 16.3179 9.017 14.8087 8.26622 13.2076C7.64568 11.8822 7.31626 10.8863 7.26263 10.1355C7.23965 10.1355 7.209 10.1355 7.18602 10.1355C2.50515 10.1355 0.421355 16.0345 0.030644 17.2832C0.015322 17.3139 0.007661 17.3445 0 17.3751L0.145559 18.2715C1.5322 25.4192 7.85252 30.6287 15.1688 30.6287C15.3526 30.6287 15.5288 30.621 15.7127 30.6134C15.2837 30.4448 14.8777 30.2533 14.4793 30.0081C11.0625 27.909 9.87503 23.4273 11.1927 17.6892Z" fill="white"/>
                            <path d="M28.5909 9.97462C28.5909 8.03639 26.4305 5.01796 25.9632 4.4587C23.075 1.58583 19.2445 0 15.1688 0C7.4695 0 1.08023 5.70745 0.00769043 13.108C1.43264 10.7331 3.27128 9.18554 5.32442 8.63395C8.72591 7.72229 12.6407 9.43069 16.9538 13.7055C16.9998 13.7515 17.0458 13.7975 17.0994 13.8434L17.2449 13.9966C18.463 15.4982 20.271 16.3562 22.2016 16.3562C25.7257 16.3562 28.5909 13.491 28.5909 9.97462Z" fill="white"/>
                        </svg>
                    </a>
                    <div class="header__links">
                        <a href="./" class="header__link txt txt-16" data-link="home">Home.</a>
                        <a href="./about.html" class="header__link txt txt-16" data-link="about">About us.</a>
                        <a href="./tech.html" class="header__link txt txt-16" data-link="tech">Technology.</a>
                        <a href="./news.html" class="header__link txt txt-16" data-link="news">News & Media.</a>
                    </div>
                    <div class="header_act">
                        <a href="#" class="btn btn-pri header__btn" data-popup="contact">
                            <div class="txt txt-16 txt-med">
                                Get in touch
                            </div>
                        </a>
                    </div>
                    <a href="#" class="header__toggle">
                        <span class="header__toggle-icon header__toggle-icon-1"></span>
                        <span class="header__toggle-icon header__toggle-icon-2"></span>
                        <span class="header__toggle-icon header__toggle-icon-3"></span>
                    </a>
                    <nav class="header__nav" data-lenis-prevent>
                        <ul>
                            <li class="header__nav-item"><a href="/" data-link="home" class="header__nav-link txt txt-16 txt-med">Home.</a></li>
                            <li class="header__nav-item"><a href="/about.html" data-link="about" class="header__nav-link txt txt-16 txt-med">About.</a></li>
                            <li class="header__nav-item"><a href="/tech.html" data-link="tech" class="header__nav-link txt txt-16 txt-med">Technology.</a></li>
                            <li class="header__nav-item"><a href="/news.html" data-link="news" class="header__nav-link txt txt-16 txt-med">News & Media.</a></li>
                            <li class="header__nav-item">
                                <a href="#" class="header__nav-cta heading h6">
                                    Get<br/>in touch
                                    <div class="icon arr-ic-main">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4401 3.68089L3.00001 31.121L0.878693 28.9997L28.3188 1.55957L30.4401 3.68089Z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 1.5H30.5V27.5H27.5V4.5H4.5V1.5Z" fill="white"/>
                                        </svg>
                                    </div>
                            </a></li>
                        </ul>
                    </nav>
                </div>
        </header>
        `
    }
}

customElements.define('header-component', HeaderComponent);

