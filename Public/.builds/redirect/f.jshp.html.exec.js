const Public$SLASH$redirect$SLASH$f$DOT$jshp$DOT$html = async function() { echo(`<!DOCTYPE html>
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

   `) ; ; ; ; ; 
        let url;
        if ($_GET['url'] && !Array.isArray($_GET['url'])) {
            setStatusCode(302);
            setHeader('Location', $_GET['url']);
        } else if ($_GET['url']) {
            url = [];
            $_GET['url'].forEach(item => {
                url.push(item);
            });
        }
    ;  echo(`

    <h2 id="heading"></h2>
    <p>
        Use ?url= for open redirections demo. If ?url is polluted, no redirection will happen.
    </p>
    `) ; ; ; ; ; 
        if (url && Array.isArray(url)) {
            echo('<p><b>URLs: </b>');
            const str = url.join('\n');
            Message.echo(str);
        }
    ;  echo(`
    </p>

    <!-- normal browser script -->
    <script>
        const heading = 'Open Redirect';
        document.getElementById('heading').innerHTML = \x60\x24{heading}\x60;
    </script>
 
</body>
</html>`); }; Public$SLASH$redirect$SLASH$f$DOT$jshp$DOT$html();