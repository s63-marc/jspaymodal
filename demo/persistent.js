RDP.modal.init('modal.css3.css');
let el = id => { return document.getElementById(id) };
let getDomain = () => { return window.location.protocol + '//' + window.location.host };
el('paymentRef').innerText = "OID" + (new Date()).getTime();
el('domainName').innerText = getDomain();
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
        el('totalCcy').innerText = qsccy;
    }

    if (qsamt) {
        el('amount').value = qsamt;
        el('totalAmount').innerText = qsamt;
    }
}

RDP.domain = 'https://connect.api.reddotpay' + (el('isProduction').checked ? '.com': '.sg');
RDP.auth(el('clientKey').value, el('clientSercret').value)
.then(res => {
    RDP.pay(
        res.accessToken,
        el('paymentRef').innerText,
        el('merchant').value, 
        el('totalAmount').innerText,
        el('totalCcy').innerText,
        {}
    )
    .then(auth => {
        el('payframe').src = auth.payUrl;
        el('payframe').classList.remove('d-none');
        el('loading').classList.add('d-none');
    })
    .catch(e => {
        console.log(e);
        el('loading').innerText = "Something went wrong. Please refresh";
    })
    .finally(() => {
        const oid = "OID" + (new Date()).getTime();
        console.log("setting oid: " + oid);
        el('paymentRef').innerText = oid;
    });
})
.catch(e => {
    console.log(e);
});

$('#configForm').on('submit', e => {
    e.stopPropagation();
    e.preventDefault();

    window.location.href = '?client=' + el('clientKey').value + ':' + el('clientSercret').value +
        '&merchant=' + el('merchant').value + 
        '&production=' + (el('isProduction').checked? 'Y': 'N') +
        '&currency=' + el('currency').value +
        '&amount=' + el('amount').value;

    false;
});