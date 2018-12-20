# RDP Javascript Pay [Modal]

Allows the Red Dot Payment (RDP) hosted payment and card capture page to be embedded to an HTML page.

## Limitation

- Supports ONLY modern browsers (Google Chrome, Firefox, Microsoft Edge, Safari, Opera). To validate the end-users browsers, [outdatedbrowser.com](http://outdatedbrowser.com/en/how) offers a library.

## Example

- [example.html](https://reddotpay.github.io/jspay/example.html)

## Usage

### modal
~~~
<!doctype html>
<html lang="en">
  <head>
    ...
    <!-- Use an optional -->
    <link rel="stylesheet" type="text/css" media="screen,print" href="https://reddotpay.github.io/jspay/modal.loader2.css3.css">
  </head>
  <body>
    <button type="button" id="pay">Pay</button> 

    <script src="https://reddotpay.github.io/jspay/src/jspay.js"></script>
    <script type="text/javascript">
        // You can overwrite the base CSS file:
        // RDP.modal.init('https://myowndomain.com/assets/modal.css3.css');
        RDP.modal.init();

        // To switch to PRODUCTION:
        // RDP.authDomain = 'https://connect.api.reddotpay.com';
        // RDP.domain = 'https://connect.reddotpay.com';
        document.getElementById('pay').addEventListener('click', function (e) {
            RDP.modal.pay(
                "OID" + (new Date()).getTime(), // Order ID
                "00000000-0000-0000-0000-000000000000", // Merchant ID
                37.76, // Amount
                "SGD", // SGD
                { promo: "HAPPYNEWYEAR01" } // Other details
            );
        });
    </script>
  </body>
</html>
~~~

## Open-source

1. Support only modern browsers
2. Do not add any library dependencies
3. Use only vanilla codes
4. Do not do any post processing (obfuscation, minimizing, etc.)
5. Have fun with the preloaders

