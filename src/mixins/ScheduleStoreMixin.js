import TimePicker from "@/components/TimePicker";
import rules from "@/utils/rules";

export default {
    name: "ModalCreate",
    components: {TimePicker},
    props: ['show', 'dateForCreate', 'item'],
    data: () => ({
        name: null,
        homework: null,
        timeObject: null,
        dialog: false,
        start: null,
        end: null,
        date: null,
        rules,
    }),
    watch: {
        show: function(val) {
            if (val) this.dialog = val
        },
        dateForCreate: function (val) {
            this.date = val
        },
        dialog: function(val) {
            if (!val) this.$emit('destroy')
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
            this.$emit('submit', {
                name: this.name,
                homework: this.homework,
                time: this.timeObject
            })
            this.dialog = false
        },
        onSave(obj) {
            this.timeObject = obj;
        }
    }
}