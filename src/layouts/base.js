export default ({title, script}) => (
    `<!DOCTYPE html>
        <html>
        <head>
            <title>${ title }</title>
        </head>
        <body>
            <div id="root">
            </div>
            <script src=${ script }></script>
        </body>
        </html>`
)
