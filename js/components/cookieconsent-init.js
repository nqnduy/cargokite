import $ from "jquery";
import '../vendors/cookieconsent';

let cookieConsent = initCookieConsent();
let cookieAccepted = false;

const initCookie = () => {
    cookieConsent.run({
        current_lang: 'en',
        autoclear_cookies: true,                   // default: false
        page_scripts: true,                        // default: false
        gui_options: {
            consent_modal: {
                transition: 'slide',           // zoom/slide
            },
            settings_modal: {
                layout: 'bar',                 // box/bar
                position: 'right',              // left/right
                transition: 'slide'            // zoom/slide
            },
        },
        // mode: 'opt-in'                          // default: 'opt-in'; value: 'opt-in' or 'opt-out'
        // delay: 0,                               // default: 0
        // auto_language: null                     // default: null; could also be 'browser' or 'document'
        // autorun: true,                          // default: true
        // force_consent: false,                   // default: false
        // hide_from_bots: true,                   // default: true
        // remove_cookie_tables: false             // default: false
        // cookie_name: 'cc_cookie',               // default: 'cc_cookie'
        // cookie_expiration: 182,                 // default: 182 (days)
        // cookie_necessary_only_expiration: 182   // default: disabled
        // cookie_domain: location.hostname,       // default: current domain
        // cookie_path: '/',                       // default: root
        // cookie_same_site: 'Lax',                // default: 'Lax'
        // use_rfc_cookie: false,                  // default: false
        // revision: 0,                            // default: 0

        onFirstAction: function(user_preferences, cookie){
            // callback triggered only once
        },

        onAccept: function (cookie) {
            // ...
            cookieAccepted = true;
        },

        onChange: function (cookie, changed_preferences) {
            // ...
        },

        languages: {
            'en': {
                consent_modal: {
                    title: 'Cookies consent',
                    description: 'By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts. <button type="button" data-cc="c-settings" class="cc-link">Settings</button>',
                    // close_btn_label: 'Close',
                    close: '<button type="button" id="s-c-bn" class="c-bn" aria-label="Close"><span tabindex="-1"></span></button>',
                    primary_btn: {
                        text: 'Accept',
                        role: 'accept_all'              // 'accept_selected' or 'accept_all'
                    },
                    secondary_btn: {
                        text: 'Deny',
                        role: 'accept_necessary'        // 'settings' or 'accept_necessary'
                    },
                    close_btn_label: 'Close'
                },
                settings_modal: {
                    title: 'Cookie preferences',
                    save_settings_btn: 'Save settings',
                    accept_all_btn: 'Accept all',
                    reject_all_btn: 'Reject all',
                    close_btn_label: 'Close',
                    cookie_table_headers: [
                        {col1: 'Name'},
                        {col2: 'Domain'},
                        {col3: 'Expiration'},
                        {col4: 'Description'}
                    ],
                    blocks: [
                        {
                            title: 'Cookie usage 📢',
                            description: 'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="./privacy.html" data-close-cookie class="cc-link">privacy policy</a>.'
                        }, {
                            title: 'Strictly necessary cookies',
                            description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true          // cookie categories with readonly=true are all treated as "necessary cookies"
                            }
                        }, {
                            title: 'Performance and Analytics cookies',
                            description: 'These cookies allow the website to remember the choices you have made in the past',
                            toggle: {
                                value: 'analytics',     // your cookie category
                                enabled: false,
                                readonly: false
                            },
                            // cookie_table: [             // list of all expected cookies
                            //     {
                            //         col1: '^_ga',       // match all cookies starting with "_ga"
                            //         col2: 'google.com',
                            //         col3: '2 years',
                            //         col4: 'description ...',
                            //         is_regex: true
                            //     },
                            //     {
                            //         col1: '_gid',
                            //         col2: 'google.com',
                            //         col3: '1 day',
                            //         col4: 'description ...',
                            //     }
                            // ]
                        }, {
                            title: 'Advertisement and Targeting cookies',
                            description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false
                            }
                        }, {
                            title: 'More information',
                            description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" data-popup="contact" data-close-cookie href="#">contact us</a>.',
                        }
                    ]
                }
            }
        }
    });
}

export {
    cookieConsent,
    initCookie,
    cookieAccepted
};