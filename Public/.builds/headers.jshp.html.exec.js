const Public$SLASH$headers$DOT$jshp$DOT$html = async function() { echo(`<!DOCTYPE html>
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
    `) ; ; ; ; ; 
        const logs = prequire('jshp:logs/index.jshp.html');
        Message.echo(
            JSON.stringify($_HEADERS, null, 4)
                .replace(/\\\"/g, '%SL%DQ')
                .replace(/\"/g, '')
                .replace(/%SL%DQ/g, '"'), 'teal');
    ;  echo(`

    <!-- normal browser script -->
    <script>
        const heading = 'Headers';
        document.getElementById('heading').innerHTML = \x60\x24{heading}\x60;
    </script>

</body>
</html>`); }; Public$SLASH$headers$DOT$jshp$DOT$html();