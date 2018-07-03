export default (io) => {
    io.on('connection', socket => {
        socket.join('all')  // room
        console.log('connected to socket server')
        socket.emit('connected', 'you are connected to server')

        socket.on('test', data => {
            console.log(data)
        })
    })
}