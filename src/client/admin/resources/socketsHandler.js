import openSocket from 'socket.io-client'

import config from '../../config'

export default (authToken) => {
    if(!authToken) return null
    const socket = openSocket(`${ config.protocol }://${ config.host }:${ config.port }`)

    socket.on('connected', data => {
        socket.emit('adminAuthToken', authToken)
    })
}