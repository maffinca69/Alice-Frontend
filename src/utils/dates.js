export default {
    currentDayName(val) {
        let date = val ? new Date(val) : new Date();
        return date.toLocaleString("default", { weekday: "long" });
    },

    formattedDateToTime(value) {
        let date = new Date(value)
        return this.addZeroToTime(date.getHours()) + ':' + this.addZeroToTime(date.getMinutes())
    },

    addZeroToTime(time) {
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    },
}