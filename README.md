# Repair Service

Take a look: [remont-service.ml](http://remont-service.ml)

Application for accepting orders and assigning them to employees

This is a single-page application made for:
* React
* Redux
* Express
* Mongo


### Uses:
* ant design ui
* socket.io
* smsc.ru api
************
## Usage:
### Important:

You need database config file:
`src/config/db.js`

    export default {  // access to your Mongo database
        url:      '',
        user:     '',
        password: '',
    }

Admin application sends SMS with orders to employees using smsc.ru api in `src/server/resources/sms.js`

If you do the same you need config file:
`src/config/smsc.ru.js`

    export default {	// access to your smsc.ru account
	    login:    '',
	    password: '',
	    companyNameForSms: '',
    }

### Scripts

`npm start` - start express server

`npm run watch` - for development

`npm run build` - get production build

************
### Directories structure:
    src/
        client/
            site/
            admin/
            ...
        config/
            client.js
            server.js
            common.js
            db.js
            ...
        server/
            index.js - entry point
            App.js
            router.js
            ...
