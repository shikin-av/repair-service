import openSocket from 'socket.io-client'

import config from '../../config'

export default () => {
    const socket = openSocket(`${ config.protocol }://${ config.host }:${ config.port }`)

    socket.on('connected', data => {
        console.log(data)
        socket.emit('userMsg', 'user msg')
    })
}