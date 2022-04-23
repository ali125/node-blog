exports.dateTimeFormate = (date) => {
    let hr = date.getHours()
    hr = hr < 10 ? `0${hr}` : hr;
    let min = date.getMinutes()
    min = min < 10 ? `0${min}` : min;
    let sec = date.getSeconds()
    sec = sec < 10 ? `0${sec}` : sec;
    return `${date.toDateString()} ${hr}:${min}:${sec}`;
};