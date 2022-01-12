(async function() { echo(`<!DOCTYPE html>
<html>
<head>
    
    <meta name="viewport" content="width=device-width, height=device-height">
    <title>Open Redirect</title>
    <style>
        body {
            font-family: monospace;
            font-size: 105%;
        }
    </style>
</head>
<body>

    `); 
        let url;
        if ($_GET['url'] && !Array.isArray($_GET['url'])) {
            setHeader('Location', $_GET['url']);
            setStatusCode(302);
        } else if ($_GET['url']) {
            url = [];
            $_GET['url'].forEach(item => {
                url.push(encodeURIComponent(item));
            });
        }
    ; echo(`

    <h2 id="heading"></h2>
    <p>
        Use ?url= for open redirections demo. If ?url is polluted, no redirection will happen.
    </p>
    `); 
        if (url && Array.isArray(url)) {
            echo('<p><b>URLs: </b>');
            const str = url.join('\n');
            Message.echo(str);
        }
    ; echo(`
    </p>

    <!-- normal browser script -->
    <script id="browser-script">
        const heading = 'Open Redirect';
        document.getElementById('heading').innerHTML = EncDec0x60EncDec0x24EncDec0x7Bheading}EncDec0x60;
    </script>
 
</body>
</html>`) })();