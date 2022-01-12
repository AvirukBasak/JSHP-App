(async function() { echo(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, height=device-height">
    <title>Server Logs</title>
    <style>
        body {
            font-family: monospace;
            font-size: 105%;
        }
    </style>
</head>
<body>

    <h2 id="heading"></h2>

    <!-- jshp script -->
    `); 
        const data = await FS.promises.readFile($_RES_ROOT + '/server.log', 'utf8');
        Message.echo(String(data), 'purple');
    ; echo(`

    <!-- normal browser script -->
    <script id="browser-script">
        const heading = 'Server Logs';
        document.getElementById('heading').innerHTML = EncDec0x60EncDec0x24EncDec0x7Bheading}EncDec0x60;
    </script>

</body>
</html>`) })();