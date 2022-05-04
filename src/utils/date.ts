export const dateTimeFormate = (date: Date | null = null, withTime = true) => {
    if (date === null) return '';

    let hr: number | string = date.getHours()
    hr = hr < 10 ? `0${hr}` : hr;

    let min: number | string = date.getMinutes()
    min = min < 10 ? `0${min}` : min;

    let sec: number | string = date.getSeconds()
    sec = sec < 10 ? `0${sec}` : sec;

    return `${date.toDateString()}${withTime ? `${hr}:${min}:${sec}` : ''}`;
};

export const dateFormate = (date = null, withTime = false) => {
    if (date === null) return '';
    const d = new Date(date)
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (withTime) {
        let hr: number | string = d.getHours()
        hr = hr < 10 ? `0${hr}` : hr;

        let min: number | string = d.getMinutes()
        min = min < 10 ? `0${min}` : min;
    
        return `${year}-${month}-${day}T${hr}:${min}`;
    }
    
    return `${year}-${month}-${day}`;
};

export const timeSince = (createdAt: Date | null) => {
  const date = createdAt || new Date();
  const seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }

  return Math.floor(seconds) + " seconds";
}
/**
* A function that converts date object to human readable time ago
* @param {Date} date
* @returns {string}
*/
// dateToTimeAgo(date: Date): string
export const dateToTimeAgo = (date: Date) => {
   const now = new Date(Date.now());
   const difftime = now.getTime() - date.getTime();
   const diffDate = new Date(difftime - 5.5 * 60 * 60 * 1000);
   const [sec, min, hr, day, month] = [
       diffDate.getSeconds(),
       diffDate.getMinutes(),
       diffDate.getHours(),
       diffDate.getDate() - 1,
       diffDate.getMonth(),
   ];
   const f = (property: number, end: string) => {
       return`${property} ${end}${property > 1 ? "s" : ""} ago`;
   }
   return month >= 1
       ? f(month, "month")
       : day >= 1
       ? f(day, "day")
       : hr >= 1
       ? f(hr, "hr")
       : min >= 1
       ? f(min, "min")
       : day >= 1
       ? f(sec, "sec")
       : "";

   throw new Error("Date To time ago not implmented");
}