import API from "@/plugins/API";
import dayjs from "dayjs";
import dates from "@/utils/dates";

export default {
    data: () => ({
        editDialog: false,
        createDialog: false,
        detailsDialog: false,
        confirmDeleteDialog: false,
        loading: false,
        selectedItem: null,
        datesForCopy: [],
        modalDateForCopy: false,
        mixinsItems: [],
        selectedDate: dayjs().format(dates.FORMAT_FULL_DATE),
    }),
    methods: {
        onClickEditBtn(item) {
            this.editDialog = true
            this.selectedItem = item
        },
        onClickAddBtn() {
            this.createDialog = true
        },
        onClickCopyBtn() {
            this.createDialog = true
        },
        onClickDeleteBtn(item) {
            this.selectedItem = item
            this.confirmDeleteDialog = true
        },
        viewItem(item) {
            this.selectedItem = item
            this.detailsDialog = true
        },
        onDelete(item) {
            this.loading = true
            API.fetchDelete(item.id).then(response => {
                if (response && response.status === 200) {
                    let index = this.items.indexOf(item)
                    this.items.splice(index, 1);
                    this.$root.$emit('notify', 'Урок удален', 'success', 2000)
                }
            }).finally(() => this.loading = false)
        },
        onUpdate(obj) {
            let index = this.items.indexOf(this.selectedItem);
            let item = this.items[index];
            this.items[index] = this.prepareFetchData(item, obj)

            this.loading = true
            API.fetchUpdate(this.items[index]).then(response => {
                if (response && response.status === 200) {
                    this.$root.$emit('notify', 'Расписание обновлено', 'success', 2000)
                    this.sortItems()
                }
            }).finally(() => this.loading = false)
        },

        onCreate(obj) {
            let item = this.prepareFetchData(obj, obj)

            this.loading = true
            API.fetchCreate(item).then(response => {
                let data = response.data || {};
                if (response && response.status === 200) {
                    this.$root.$emit('notify', 'Новый урок добавлен', 'success', 2000)
                    this.items.push(data.item)
                    this.sortItems()
                }
            }).finally(() => {
                this.loading = false
                this.createDialog = false
            })
        },
        saveDateForCopy() {
            this.$refs.dialog.save(this.datesForCopy)
            if (this.datesForCopy.length === 1) {
                this.datesForCopy.push(this.datesForCopy[0])
            }
            this.datesForCopy.sort((a, b) => {
                return dayjs(new Date(a)).diff(dayjs(new Date(b)))
            });
        },
        copySchedule() {
            if (!this.datesForCopy.length) {
                this.modalDateForCopy = false
                return
            }
            this.saveDateForCopy()
            let data = {
                items: this.items,
                dates: this.datesForCopy
            }
            API.fetchCopySchedule(data).then(response => {
                this.$root.$emit('notify', response.data.message, 'success', 2000)
            }).finally(() => {
                this.loading = false;
            })
        },
        clearDay() {
            this.loading = true
            API.fetchClearDay(this.selectedDate).then(response => {
                this.$root.$emit('notify', response.data.message, 'success', 2000)
                this.items = []
            }).finally(() => {
               this.loading = false;
            })
        },
        onDestroyCreateDialog() {
            this.createDialog = false
        },
        onDestroyDetailsDialog() {
            this.detailsDialog = false
        },
        onDestroyEditDialog() {
            this.editDialog = false
        },
        onDestroyDeleteConfirmDialog() {
            this.confirmDeleteDialog = false
        },
    }
}