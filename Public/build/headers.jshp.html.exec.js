(async function() { echo(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, height=device-height">
    <title>Headers</title>
    <style>
        body {
            font-family: monospace;
            font-size: 105%;
        }
    </style>
</head>
<body>

    <h2 id="heading"></h2>
    `); 
        Message.echo(
            JSON.stringify($_HEADERS, null, 4)
                .replace(/\\\"/g, '%SL%DQ')
                .replace(/\"/g, '')
                .replace(/%SL%DQ/g, '"'), 'teal');
    ; echo(`

    <!-- normal browser script -->
    <script id="browser-script">
        const heading = 'Headers';
        document.getElementById('heading').innerHTML = EncDec0x60EncDec0x24EncDec0x7Bheading}EncDec0x60;
    </script>

</body>
</html>`) })();