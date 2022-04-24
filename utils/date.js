exports.dateTimeFormate = (date = null) => {
    if (date === null) return '';
    let hr = date.getHours()
    hr = hr < 10 ? `0${hr}` : hr;
    let min = date.getMinutes()
    min = min < 10 ? `0${min}` : min;
    let sec = date.getSeconds()
    sec = sec < 10 ? `0${sec}` : sec;
    return `${date.toDateString()} ${hr}:${min}:${sec}`;
};

exports.dateFormate = (date = null, withTime = false) => {
    if (date === null) return '';
    const d = new Date(date)
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (withTime) {
        let hr = d.getHours()
        hr = hr < 10 ? `0${hr}` : hr;
        let min = d.getMinutes()
        min = min < 10 ? `0${min}` : min;
    
        return `${year}-${month}-${day}T${hr}:${min}`;
    }
    
    return `${year}-${month}-${day}`;
}