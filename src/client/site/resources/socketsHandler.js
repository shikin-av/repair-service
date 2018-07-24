import openSocket from 'socket.io-client'

import config from 'config/client'

export default () => {
    const socket = openSocket(`${ config.protocol }://${ config.host }:${ config.port }`)

    socket.on('connected', data => {
        console.log('i connected')
        
        //TODO
        socket.emit('clientTask', {
            city: 'Ижевск',
            task: 'что то сломалось'
        })
    })
}