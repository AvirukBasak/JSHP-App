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
        document.getElementById('heading').innerHTML = \x60\x24{heading}\x60;
    </script>

    `); ; ; 
        if ($_GET['act'] && !Array.isArray($_GET['act']))
            switch ($_GET['act']) {
                case 'reconf': {
                    Server.reloadConfig();
                    // as of now, this block will cause an error
                    if (Number(await getStatusCode()) === 200) { ; echo(`
                        <script>
                            location.href = \x60\x24{location.origin}\x24{location.pathname}\x60;
                        </script>
                    `); ; ;  }
                    break;
                }
                case 'recomp': {
                    Server.recompile();
                    // so will this block
                    if (Number(await getStatusCode()) === 200) { ; echo(`
                        <script>
                            location.href = \x60\x24{location.origin}\x24{location.pathname}\x60;
                        </script>
                    `); ; ;  }
                    break;
                }
                default: {
                    Message.echo('/config/ invalid act: ' + $_GET['act'], 'orange');
                    break;
                }
            }
        Message.echo(JSON.stringify($_CONFIG, null, 4));
    ; echo(`
</body>
</html>`); })();