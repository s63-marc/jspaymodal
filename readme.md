# RDP Javascript Pay [Modal]

Allows the Red Dot Payment (RDP) hosted payment and card capture page to be embedded to an HTML page.

## Limitation

- Supports ONLY modern browsers (Google Chrome, Firefox, Microsoft Edge, Safari, Opera). To validate the end-users browsers, [outdatedbrowser.com](http://outdatedbrowser.com/en/how) offers a library.
- The domain has to be registered in by the merchant to Red Dot Payment (Content Security Policy)[https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP].

## Example

- [example.html](https://reddotpay.github.io/jspay/example.html)

## Usage

### Modal

Enables the payment page to be loaded into the same webpage for a more seemless experience.

index.html
~~~HTML
<!doctype html>
<html lang="en">
  <head>
    ...
    <!-- Specify a spinner (preloader) style -->
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
                'OID' + (new Date()).getTime(), // Order ID
                '00000000-0000-0000-0000-000000000000', // Merchant ID
                37.76, // Amount
                'SGD', // SGD
                { promo: 'HAPPYNEWYEAR01' } // Other details
            );
        });
    </script>
  </body>
</html>
~~~

### Promises

Attach callbacks to various events when doing a payment

~~~Javascript
  RDP.modal.pay(
      'OID' + (new Date()).getTime(), // Order ID
      '00000000-0000-0000-0000-000000000000', // Merchant ID
      37.76, // Amount
      'SGD', // SGD
      { promo: 'HAPPYNEWYEAR01' } // Other details
  )
  .then((src, auth) => {
    console.log('Display full payment URL:');
    console.log(src);
    console.log('Auth response:');
    console.log(auth);
  })
  .catch(e => {
    console.log(e.message);
  })
  .finally(() => {
    console.log('End of request!');
  })
~~~

### Build-your-own

Create your own payment flow

~~~HTML
<!doctype html>
<html lang="en">
  <head>
    ...
  </head>
  <body>
    <h1>Payment</h1>
    <iframe id="paymentForm"></iframe>
    <script src="https://reddotpay.github.io/jspay/src/jspay.js"></script>
    <script type="text/javascript">
      RDP.pay(
            'OID' + (new Date()).getTime(), // Order ID
            '00000000-0000-0000-0000-000000000000', // Merchant ID
            37.76, // Amount
            'SGD', // SGD
            { promo: 'HAPPYNEWYEAR01' } // Other details
        )
        .then((src, auth) => {
          document.getElementById('paymentForm').src = src;
        })
        .catch(e => {
          console.log(e.message);
        })
        .finally(() => {
          console.log('End of request!');
        })
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

