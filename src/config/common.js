export default {
    port:       process.env.PORT || 80,
    assetsPath: '/assets',
    assetsDir: __dirname + '/../../assets',
    userRoles: ['администратор', 'работник'],
    defaultWorkingDays: [
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница'
    ]
}