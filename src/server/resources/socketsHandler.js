import getAuthMethods from './auth'
import config from '../config/index'

export default (io) => {
    io.on('connection', socket => {
        console.log('connection')
        socket.emit('connected', 'connected')
        
        socket.on('adminAuthToken', token => {
            const auth = getAuthMethods()
            const user = auth.getUser(token, config.jwt.secret)
            console.log('adminAuthToken USER: ', user)
            if(user && user.role == 'admin' && user.city){
                socket.join(user.city)  // room
                socket.emit('authorize', 'авторизовался')
                console.log('админ авторизовался')
            } else {
                console.log('админ НЕ авторизовался')
                socket.emit('errorMsg', { 
                    message: 'Ошибка авторизации в сервисе приема заявок',
                    button: { text: 'Авторизоваться', url: '/login/' }
                })
            }
        })

        socket.on('clientTask', data => {   // server -> admin room
            console.log('clientTask: ', data)
            const { city } = data
            //TODO save to DB
            io.to(city).emit('clientTask', data)
            console.log('клиентская задача создана')
            
        })
    })
}