export default text => {
    const regExp = /[^\w-]/g
    return text.replace(regExp, '')
}