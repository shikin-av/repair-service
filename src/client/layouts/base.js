export default ({title, script}) => (
    `<!DOCTYPE html>
        <html>
        <head>
            <script src="https://api-maps.yandex.ru/2.0-stable/?load=package.standard&amp;lang=ru-RU" type="text/javascript"></script>
            <title>${ title }</title>
        </head>
        <body>
            <div id="root">
            </div>
            <script src=${ script }></script>
        </body>
        </html>`
)
