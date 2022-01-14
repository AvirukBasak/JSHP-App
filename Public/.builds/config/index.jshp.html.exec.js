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
    <script>
        const heading = 'Server Config';
        document.getElementById('heading').innerHTML = EncDec0x60EncDec0x24{heading}EncDec0x60;
    </script>

    `); 
        if ($_GET['act'] && !Array.isArray($_GET['act']))
            switch ($_GET['act']) {
                case 'reconf': {
                    Server.reloadConfig();
                    break;
                }
                case 'recomp': {
                    Server.recompile();
                    break;
                }
                default: {
                    Logger.warn('/config/ invalid act: ' + $_GET['act']);
                    break;
                }
            }
        Message.echo(JSON.stringify($_CONFIG, null, 4));
    ; echo(`
</body>
</html>`); })();