const check10 = (numb) => {
    var t = numb
    if (numb < 10) {
        t = `0${numb}`
    }
    return t
}


export const getDate = (dateNum) =>{
    const d = dateNum ? new Date(dateNum) : new Date()
    return `${check10(d.getDate())}/${check10(d.getMonth())}/${d.getFullYear()}`
}


export const getHour = (dateNum) =>{
    const d = new Date(Number(dateNum))
    var h = d.getHours();
    return `${check10(d.getHours())}h ${check10(d.getMinutes())}`
}