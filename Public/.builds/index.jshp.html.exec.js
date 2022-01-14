(async function() { echo(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, height=device-height">
    <title>JSHP Demo App</title>
    <style>
        body {
            font-family: monospace;
            font-size: 105%;
        }
    </style>
</head>
<body>

    `); 
        const NAME = $_GET['name'] || 'None';
        const UID = $_GET['uid'] || 'None';
    ; echo(`

    <h1 id="heading"></h1>
    <h4 id="remoteAddress">Remote Address is ${$_REQUEST['remoteAddress']} </h4>
    <p>
        <h3>Paths in this domain</h3>
        <ul>
            <li><a href="/config/">/config/</a> Server configuration data.</li>
            <li><a href="/gclcm">/gclcm</a> Access Google's Closure Compiler API.</li>
            <li><a href="/github">/github</a> Redirects to https://github.com/OogleGlu/JSHP-App.</li>
            <li><a href="/headers">/headers</a> Request headers.</li>
            <li><a href="/jshpinfo/">/jshpinfo/</a> Display server information</li>
            <li><a href="/logs/">/logs/</a> Server logs.</li>
            <li><a href="/redirect/f">/redirect/f</a> Open redirection.</li>
            <li><a href="/rwt1">/rwt1</a> Rewrites to /config/</li>
            <li><a href="/rwt2">/rwt2</a> Rewrites to /logs/</li>
        </ul>
    </p>
    <hr>
    <h3>Using the following</h3>
    <p>
        Use ?name= and ?uid= for passing parameters. These parameters will be displayed below.
    </p>
    <p>
        Polluting parameters will display an array.
    </p>

    <p><b>Names: </b>${ NAME }</p>
    <p><b>UIDs: </b>${ UID }</p>

    <!-- normal browser script -->
    <script id="browser-script">
        const heading = 'JSHP Demo App';
        document.getElementById('heading').innerHTML = EncDec0x60EncDec0x24EncDec0x7Bheading}EncDec0x60;
    </script>

</body>
</html>`) })();