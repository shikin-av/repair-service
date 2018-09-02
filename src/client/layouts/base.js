export default ({ title, script, css }) => (
    `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="/assets/imgs/design/favicon.ico" type="image/x-icon">
        <title>${ title }</title>
        <link href=${ css } rel="stylesheet" type="text/css">
        <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
    </head>
    <body>
        <div id="root"></div>
        <script src=${ script }></script>
    </body>
    </html>`
)
