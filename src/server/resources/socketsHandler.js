import getAuthMethods from './auth'
import config from '../../config/server'

export default (io) => {
    io.on('connection', socket => {
        //console.log('connection')
        socket.emit('connected', 'connected')
        
        socket.on('adminAuthToken', token => {
            const auth = getAuthMethods()
            const user = auth.getUser(token, config.jwt.secret)
            //console.log('adminAuthToken USER: ', user)
            if(user && user.role == 'администратор' && user.city){
                socket.join(user.city)  // room
                socket.emit('authorize', 'авторизовался')
                //console.log('админ авторизовался')
            } else {
                console.log('админ НЕ авторизовался')
                socket.emit('errorMsg', { 
                    message: 'Ошибка авторизации в сервисе приема заявок',
                    button: { text: 'Авторизоваться', url: '/login/' }
                })
            }
        })

        socket.on('clientOrder', data => {   // server -> admin room
            console.log('clientOrder: ', data)
            const { city } = data
            
            io.to(city).emit('clientOrder', data)
            console.log('клиентская задача создана')
            
        })
    })
}