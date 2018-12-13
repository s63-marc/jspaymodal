# RDP Modal

Allows the Red Dot Payment (RDP) hosted payment and card capture page to be embedded to an HTML page.

## Example

- [example.html](https://reddotpay.github.io/rdp-modal/example.html)

## Usage

~~~
<!doctype html>
<html lang="en">
  <head>
    ...
  </head>
  <body>
    <button type="button" id="pay">Pay</button> 

    <script src="src/modal.js"></script>
    <script type="text/javascript">
        document.getElementById('pay').addEventListener('click', function (e) {
            RDPModal.pay();
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

