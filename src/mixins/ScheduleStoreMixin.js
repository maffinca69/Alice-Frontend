import rules from "@/utils/rules";
import dayjs from "dayjs";
import dates from "@/utils/dates";

export default {
    name: "ScheduleStoreMixin",
    props: ['show', 'dateForCreate', 'item'],
    data: () => ({
        rules,
        name: null,
        homework: null,
        dialog: false,
        start: null,
        end: null,
        date: null,
        startModal: false,
        endModal: false,
        suggestionsStart: [
            '08:30',
            '09:20',
            '10:10',
            '11:05',
            '12:00',
        ],
        suggestionsEnd: [] // recount after set start time
    }),
    watch: {
        show(val) {
            this.dialog = val
        },
        dateForCreate(val) {
            this.date = val
        },
        dialog(val) {
            if (!val) {
                this.$emit('destroy')
            }
        },
        start(val) {
            if (!val) {
                return
            }

            this.recountSuggestionsEndTime(val);
        },
        end(val, newVal) {
            if (val === undefined) {
                this.end = newVal
            }
        }
    },
    methods: {
        closeDialog() {
            this.dialog = false
        },
        create() {
            if (!this.$refs.form.validate()) {
                return
            }

            let data = {
                name: this.name,
                homework: this.homework,
                start: this.start,
                end: this.end
            }
            this.$emit('submit', data)

            this.dialog = false
            this.startModal = false
            this.endModal = false
        },
        recountSuggestionsEndTime(val) {
            this.suggestionsEnd = []
            let arr = [];
            let lastTime = null;
            const lessonsCount = 5;
            const lessonDurationMinutes = 40

            for (let i = 0; i < lessonsCount; i++) {
                let currentTime = (lastTime || val).split(':')
                let hours = currentTime[0]
                let minutes = currentTime[1]
                let time = dayjs()
                    .set('minute', minutes)
                    .set('hour', hours)
                    .add(lessonDurationMinutes, 'minute')
                    .format(dates.FORMAT_TIME)
                arr.push(lastTime = time)
            }
            this.suggestionsEnd = arr;
        }
    }
}