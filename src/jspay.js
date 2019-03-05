"use strict";

const RDP = (() => {
    const Modal = class {
        // modal;
        // closeButton;
        // spinner;
        // frame;
        
        // cssHidden;
        // cssDisplayNone;
        // opening;

        constructor(id, css) {
            this.cssHidden = 'hidden';
            this.cssDisplayNone = 'displaynone';
            this.opening = false;
            this.id = id;

            this.installCSS(css);
        }

        init() {
            const modal = !this.modal ? this.createElement(this.id): document.getElementById(this.id);
            this.modal = modal;
            

            this.closeButton = modal.querySelector('.close');
            this.spinner = modal.querySelector('.loader');
            this.frame = modal.getElementsByTagName('iframe')[0];
            this.attachBasicBehaviours();
        }

        installCSS(css) {
            const link = document.createElement('LINK');
                link.setAttribute('href', css);
                link.setAttribute('type', 'text/css');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('media', 'screen,print');
            
            document.getElementsByTagName('head')[0].appendChild(link);
        }

        createElement(id) {
            const modal = document.createElement('DIV');
            modal.setAttribute('id', id);
            modal.classList.add(this.cssHidden);
            modal.innerHTML = '<div class="content"><span class="close hidden">×</span><div class="frame"><div class="loader"></div><iframe class="hidden"></iframe></div></div>';
            
            document.getElementsByTagName('body')[0].appendChild(modal);

            return modal;
        }
        
        attachBasicBehaviours() {
            const modal = this.modal;
            const frame = this.frame;
            const spinner = this.spinner;
            const closeButton = this.closeButton;
            const close = this.close.bind(this);
            const hidden = this.cssHidden;
            const displayNone = this.cssDisplayNone;

            modal.addEventListener('click', e => {
                [modal, closeButton].forEach(el => {
                    if (e.target === el) {
                        close();
                        return false;
                    }
                });
            });
        
            modal.addEventListener(this.getTransitionEvents().end, e => {
                const cl = modal.classList;
                if (cl.contains(hidden) && !cl.contains(displayNone)) cl.add(displayNone);
            });
        
            frame.addEventListener('load', e => {
                if (!e.target.src || spinner.classList.contains(hidden)) return;
                frame.classList.remove(hidden);
                closeButton.classList.remove(hidden);
                spinner.classList.add(hidden);
            });
        }

        close() {
            const hidden = this.cssHidden;
            if (!this.modal.classList.contains(hidden)) this.modal.classList.add(hidden);
            this.frame.src = "";
        }

        open() {
            if (!this.modal) this.init();
            const cl = this.modal.classList;
            const hidden = this.cssHidden;
            const displayNone = this.cssDisplayNone;

            if (!this.opening && cl.contains(hidden)) {
                this.opening = true;
                cl.remove(displayNone);
                this.spinner.classList.remove(hidden);
                this.frame.classList.add(hidden);
                this.closeButton.classList.add(hidden);

                setTimeout(() => {
                    // delay hack for smoother transition while removing display:none
                    cl.remove(hidden);
                    this.opening = false;
                }, 1);
            }
        }

        toggle() {
            this.modal.classList.toggle(this.cssHidden);
        }

        getTransitionEvents() {
            const el = document.createElement('DIV');
            const transitions = {
                    'transition': ['transitionstart', 'transitionend'],
                    'OTransition': ['otransitionstart', 'otransitionend'], // oTransitionEnd in very old Opera
                    'MozTransition': ['transitionstart', 'transitionend'],
                    'WebkitTransition': ['webkitTransitionStart', 'webkitTransitionEnd']
                };
            
            let i;
            for (i in transitions) {
                if (el.hasOwnProperty(i) || el.style.hasOwnProperty(i) || i in el.style) {
                    return {'start': transitions[i][0], 'end': transitions[i][1]};
                }
            }
            
            return console.error('transitionend event not supported. browser update required');
        }
    }

    const Pay = class {
        // merchant;
        // domain;

        constructor(merchant, domain) {
            this.domain = domain;
            this.merchant = merchant;
        }

        do(accessToken, id, amount, currency, options) {
            if ('object' != options) options = {};
            options['orderId'] = id;
            options['amount'] = amount;
            options['currency'] = currency;

            return fetch(this.domain + '/v1/payments/token/' + this.merchant, {
                method: 'POST',
                credentials: 'same-origin',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': accessToken
                },
                body: JSON.stringify(options)
            })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.status + ':' +res.statusText);
                }
                return res.json();
            });
        }
    }

    let modal;

    const lib = {
        domain: 'https://connect.reddotpay.sg',

        auth: (client, secret) => {
            return fetch(lib.domain + '/v1/authenticate', {
                method: 'POST',
                credentials: 'same-origin',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({
                    'clientId': client,
                    'secret': secret
                })
            }).then(res => {
                if (!res.ok) {
                    throw Error(res.status + ':' + res.statusText);
                }

                return res.json();
            })
        },

        modal: {
            init: (css) => {
                modal = new Modal('rdp-modal', css ? css: 'https://reddotpay.github.io/jspay/modal.css3.css');
            },

            pay: (accessToken, id, merchant, amount, currency, options) => {
                modal.open();
                return lib
                    .pay(accessToken, id, merchant, amount, currency, options)
                    .then(auth => {
                        modal.frame.setAttribute('src', auth.payUrl);
                        return auth;
                    })
                    .catch(e => { 
                        modal.close();
                        throw e;
                    });
            },
        },

        pay(accessToken, id, merchant, amount, currency, options) {
            const pay = new Pay(merchant, lib.domain);
            return pay
                .do(accessToken, id, amount, currency, options)
                .then(auth => {
                    if (!auth || !auth.token) {
                        throw Error("0: auth token is empty");
                    }

                    auth.payUrl = lib.domain + '/m/' + merchant + '#/pay/' + auth.token;
                    return auth;
                });
        }
    };

    return lib;
})();