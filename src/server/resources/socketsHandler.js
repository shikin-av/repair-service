import getAuthMethods from './auth'
import config from '../../config/server'

export default (io) => {
    io.on('connection', socket => {
        socket.emit('connected', 'connected')
        
        socket.on('adminAuthToken', token => {
            const auth = getAuthMethods()
            const user = auth.getUser(token, config.jwt.secret)
            if(user && user.role == 'администратор' && user.city){
                socket.join(user.city)  // room
                socket.emit('authorize', 'авторизовался')
            } else {
                socket.emit('errorMsg', { 
                    message: 'Ошибка авторизации в сервисе приема заявок',
                    button: { text: 'Авторизоваться', url: '/login/' }
                })
            }
        })

        socket.on('clientOrder', data => {   // server -> admin room
            const { city } = data            
            io.to(city).emit('clientOrder', data)            
        })

        socket.on('disconnect', () => {
            socket.emit('errorMsg', { 
                message: 'Ошибка авторизации в сервисе приема заявок',
                button: { text: 'Авторизоваться', url: '/login/' }
            })
        })
    })
}