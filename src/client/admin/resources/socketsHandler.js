import openSocket from 'socket.io-client'

import config from '../../config'

export default (authToken) => {
    if(!authToken) return null
    const socket = openSocket(`${ config.protocol }://${ config.host }:${ config.port }`)

    socket.on('connected', data => {
        socket.emit('adminAuthToken', authToken)

        socket.on('authorize', data => {  //TODO
            console.log(data)
        })

        socket.on('errorMsg', data => {
            console.log(data)
        })

        socket.on('clientTask', data => {   //TODO
            console.log('clientTask: ', data)
        })
    })
}