import getAuthMethods from './auth'
import config from '../config/index'

export default (io) => {
    io.on('connection', socket => {        
        socket.emit('connected', 'connected')

        //console.log('SOCKET ID ', socket.id)
        //socket.join('all')  // room
        //console.log('connected to socket server')

        /*socket.on('userMsg', data => {
            console.log('userMsg', data)
        })
        socket.on('adminMsg', data => {
            console.log('adminMsg', data)
        })*/
        socket.on('adminAuthToken', token => {
            const auth = getAuthMethods()
            const user = auth.getUser(token, config.jwt.secret)
            if(user && user.role == 'admin'){
                //TODO append this socket to admin room
                console.log('TRUE token')
            } else {
                console.log('FALSE token')
            }
        })
    })
}