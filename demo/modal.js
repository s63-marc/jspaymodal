RDP.modal.init('modal.css3.css');
let el = id => { return document.getElementById(id) };
let getDomain = () => { return window.location.protocol + '//' + window.location.host };

el('domainName').innerText = getDomain();
el('paymentRef').innerText = "OID" + (new Date()).getTime();

const qs = new URLSearchParams(window.location.search);

if (qs) {
    var qsc = qs.get('client');
    var qsm = qs.get('merchant');
    var qsp = qs.get('production');
    var qsccy = qs.get('ccy');
    var qsamt = qs.get('amt');
    
    if (qsc) {
        qsc = qsc.split(':');
        el('clientKey').value = qsc[0];
        if (1 < qsc.length) el('clientSercret').value = qsc[1];
    }

    if (qsm) {
        el('merchant').value = qsm;
    }

    if (qsp) {
        el('isProduction').checked = qsp == 'Y';
    }

    if (qsccy) {
        el('currency').value = qsccy;
    }

    if (qsamt) {
        el('amount').value = qsamt;
    }
}

el('pay').addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    el('pay').innerText = 'Processing...';
    el('pay').classList.remove('btn-success');
    el('pay').classList.add('btn-light');
    el('pay').disabled = true;

    RDP.domain = 'https://connect.api.reddotpay' + (el('isProduction').checked ? '.com': '.sg');

    if (el('amount').value != '') {
        el('totalAmount').innerText = el('amount').value;
    }

    if (el('currency').value != '') {
        el('totalCcy').innerText = el('currency').value;
    }

    RDP.auth(el('clientKey').value, el('clientSercret').value)
    .then(res => {
        console.log(res);
        RDP.modal.pay(
            res.accessToken,
            el('paymentRef').innerText,
            $('merchant').value, 
            el('totalAmount').innerText,
            el('totalCcy').innerText,
            {}
        )
        .catch(e => {
            console.log(e);
        })
        .finally(() => {
            const oid = "OID" + (new Date()).getTime();
            console.log("setting oid: " + oid);
            el('paymentRef').innerText = oid;
        });
    })
    .catch(e => {
        console.log(e);
    })
    .finally(() => {
        el('pay').innerText = 'Pay';
        el('pay').classList.add('btn-success');
        el('pay').classList.remove('btn-light');
        el('pay').disabled = false;
    });

    return false;    
});