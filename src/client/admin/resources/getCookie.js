export default (cookieName) => {
    const results = document.cookie.match ( '(^|;) ?' + cookieName + '=([^;]*)(;|$)' ) 
    if (results) return unescape(results[2])
    return null
}