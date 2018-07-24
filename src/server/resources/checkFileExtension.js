export default (file, ...extensions) => {
    const arr = file.split('.')
    const fileExt = arr[arr.length-1].toLowerCase()
    
    for(let ext of extensions){
        if(fileExt == ext){
            return true
        }
    }
    return false
}