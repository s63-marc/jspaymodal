var RDPModal = (function() {
    const csspath = 'modal.css3.css';
    const rdpid = 'rdp-modal';
    const hidden = 'hidden';
    const displaynone = 'displaynone'; // cleaning purposes
    
    const transitionEvents = (function(){
        var i, 
        el = document.createElement('DIV');
        transitions = {
            'transition': ['transitionstart', 'transitionend'],
            'OTransition': ['otransitionstart', 'otransitionend'], // oTransitionEnd in very old Opera
            'MozTransition': ['transitionstart', 'transitionend'],
            'WebkitTransition': ['webkitTransitionStart', 'webkitTransitionEnd']
        };
        
        for (i in transitions) {
            if (el.hasOwnProperty(i) || el.style.hasOwnProperty(i)) {
                return {'start': transitions[i][0], 'end': transitions[i][1]};
            }
        }
        
        return console.error('transitionend event not supported. browser update required');
    })();

    (function() {
        var link = document.createElement('link');
        link.href = csspath;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.media = 'screen,print';
        document.getElementsByTagName('head')[0].appendChild(link);
    })();
    
    var m = {
            modal: null,
            frame: null,
            spinner: null,
            close: null,
            closeTriggers:[],
            fn: {}
        };

    m.fn.init = function() {
        if (null != m.modal) {
            return
        }

        m.modal = document.createElement('DIV');
        m.modal.setAttribute('id', rdpid);
        m.modal.classList.add(hidden);
        m.modal.innerHTML = '<div class="content"><span class="close hidden">×</span><div class="frame"><div class="loader"></div><iframe class="hidden"></iframe></div></div>';
        m.close = m.modal.querySelector('.close');
        m.spinner = m.modal.querySelector('.loader');
        m.frame = m.modal.getElementsByTagName('iframe')[0];
        m.closeTriggers = [m.modal, m.close];
        document.getElementsByTagName('body')[0].appendChild(m.modal);

        m.modal.addEventListener('click', function(e) {
            m.closeTriggers.forEach(el => {
                if (e.target === el) {
                    m.fn.close();
                    return false;
                }
            });
        });

        m.modal.addEventListener(transitionEvents.end, function (e) {
            var cl = m.modal.classList;
            if (cl.contains(hidden) && !cl.contains(displaynone)) {
                cl.add(displaynone);
            }
        });

        m.frame.addEventListener('load', function (e) {
            if (!m.spinner.classList.contains(hidden)){
                m.frame.classList.remove(hidden);
                m.close.classList.remove(hidden);
                m.spinner.classList.add(hidden);
            }
        });
    };

    m.fn.close = function() {
        if (!m.modal.classList.contains(hidden)) {
            m.modal.classList.add(hidden);
        }
    };

    var opening = false;
    m.fn.open = function() {
        m.fn.init();
        var cl = m.modal.classList;

        if (!opening && cl.contains(hidden)) {
            opening = true;
            cl.remove(displaynone);
            m.frame.classList.add(hidden);
            m.close.classList.add(hidden);
            m.spinner.classList.remove(hidden);
            
            setTimeout(function () {
                // delay hack for smoother transition while removing display:none
                cl.remove(hidden);
                opening = false;
            }, 1);
            
        }
    };

    m.fn.toggle = function() {
        m.fn.init();
        m.modal.classList.toggle(hidden);
    };
    
    return {
        toggle: m.fn.toggle,
        pay: function ( options ) {
            m.fn.open();

            if ( typeof options != "object") {
                throw new Error("options are invalid, must pass an object");
            }

            if ( options.mid == undefined ) {
                throw new Error("mid is required");
            }

            if ( typeof options != "object" || options.payload == undefined ) {
                throw new Error("payload is required");
            } else {
                if ( options.payload.amount == undefined )
                    throw new Error("amount in payload is required");
                if ( options.payload.currency == undefined )
                    throw new Error("currency in payload is required");
                if ( options.payload.email == undefined )
                    throw new Error("email in payload is required");
                if ( options.payload.promotion == undefined )
                    options.payload.promotion = 0;
                if ( options.payload.orderId == undefined )
                    throw new Error("orderId in payload is required");
            }

            fetch(
                `https://api-pay-redirect.herokuapp.com/api/v1/payments/token/${options.mid}`,
                {
                  method: "POST",
                  credentials: "same-origin",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json; charset=utf-8"
                    // "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: JSON.stringify(options.payload)
                }
              )
              .then(response => {
                return response.json();
              })
              .then(data => {
            
                // Pass the hosted-page passing the `data.token` (response from the previous fetch call) as the parameter
            
                // Local development url
                // newTab.location.href = `http://localhost:8080/pay/${data.token}`;
            
                // Remote development environment or your production env
                // console.log(data)
                // newTab.location.href = 

                newTab.location.href = `http://connect.reddotpay.sg.s3.amazonaws.com/pay/${data.token}`;
            
              })
              .catch(function(error) {
                // Handle errors here
                status.innerText = error.message;
                console.log(
                  "There has been a problem with your fetch operation: ",
                  error.message
                );
              })
              .finally(() => {
                // check for payment status here...
              });
        }
    };
})();
