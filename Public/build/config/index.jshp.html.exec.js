(async function() { echo(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, height=device-height">
    <title>Server Config</title>
    <style>
        body {
            font-family: monospace;
            font-size: 105%;
        }
    </style>
</head>
<body>

    <h2 id="heading"></h2>

    <!-- normal browser script -->
    <script id="browser-script">
        const heading = 'Server Config';
        document.getElementById('heading').innerHTML = EncDec0x60EncDec0x24EncDec0x7Bheading}EncDec0x60;
    </script>

    `); 
        Message.echo(JSON.stringify($_CONFIG, null, 4));
    ; echo(`

</body>
</html>`) })();