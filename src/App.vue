<template>
  <v-app>

    <Header @date-change="onReload" :title="title" />

    <v-main class="mt-1">
      <v-data-table :hide-default-footer="true" :headers="headers" :items="items" :loading="loading">
        <template v-slot:item.action="{ item }">
          <v-btn :disabled="loading" icon color="red" @click="onClickDeleteBtn(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn :disabled="loading" icon color="primary" @click="onClickEditBtn(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn :disabled="loading" icon color="green" @click="viewItem(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.homework="{ item }">
          <td>{{ text.trimmedText(item.homework || '', 65) }}</td>
        </template>
        <template v-slot:item.time_start="{ item }">
          <td>{{ dates.formattedDateToTime(item.time_start) }}</td>
        </template>
        <template v-slot:item.time_end="{ item }">
          <td>{{ dates.formattedDateToTime(item.time_end) }}</td>
        </template>
      </v-data-table>

      <v-layout row justify-start class="ms-4 mt-4 mb-4">
        <v-btn class="btn primary me-2" @click="previousDay" :disabled="loading" icon>
          <v-icon color="white">
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn class="btn success" @click="onClickAddBtn" :disabled="loading">Добавить</v-btn>
        <v-btn class="btn primary ms-2" @click="nextDay" :disabled="loading" icon>
          <v-icon color="white">
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </v-layout>

      <ModalEdit
          :show="this.editDialog"
          :item="this.selectedItem"
          @destroy="onDestroyEditDialog"
          @submit="onUpdate">
      </ModalEdit>
      <ModalCreate
          :date-for-create="selectedDate"
          :show="this.createDialog"
          @destroy="onDestroyCreateDialog"
          @submit="onCreate">
      </ModalCreate>
      <ModalDetails
          :item="this.selectedItem"
          :show="this.detailsDialog"
          @destroy="onDestroyDetailsDialog">
      </ModalDetails>

      <v-snackbar
          v-model="snackbar"
          :color="snackbarData.status"
      >
        {{ snackbarData.text }}

        <template v-slot:action="{ attrs }">
          <v-btn
              text
              v-bind="attrs"
              @click="snackbar = false"
          >
            OK
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import Header from "@/components/Header";
import ModalEdit from "@/components/Modals/ModalEdit";
import ModalCreate from "@/components/Modals/ModalCreate";
import dates from "@/utils/dates";
import moment from 'moment'
import ModalDetails from "@/components/Modals/ModalDetails";
import text from "@/utils/text";
import API from "@/plugins/API";

export default {
  name: 'App',
  components: {
    ModalDetails,
    ModalEdit,
    ModalCreate,
    Header
  },
  mixins: [
      API
  ],
  mounted() {
    this.load()
  },
  data: () => ({
    dates,
    text,
    title: dates.currentDayName(),
    selectedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    editDialog: false,
    createDialog: false,
    detailsDialog: false,
    snackbar: false,
    snackbarData: {
      text: null,
      status: 'error'
    },
    selectedItem: null,
    loading: false,
    headers: [
      { text: 'Урок', value: 'name', width: 300 },
      { text: 'Начало', value: 'time_start', width: 100 },
      { text: 'Окончание', value: 'time_end', width: 120 },
      { text: 'Домашнее задание', value: 'homework' },
      { text: 'Действия', value: 'action', sortable: false, align: 'center', width: 300 },
    ],
    items: []
  }),
  methods: {
    load(date) {
      let dateLoading = date === undefined ? (new Date()).toDateString() : date.toDateString()

      this.loading = true
      API.fetchGet(dateLoading).then(response => {
        this.items = response.data.data;
        this.sortItems()
      }).finally(() => this.loading = false)
    },

    onUpdate(obj) {
      let index = this.items.indexOf(this.selectedItem);
      let item = this.items[index];

      let startSplit = obj.time.start.split(':');
      let endSplit = obj.time.end.split(':');

      item.time_start = moment(item.date).set({hour: startSplit[0], minute: startSplit[1]}).format('YYYY-MM-DD HH:mm:ss')
      item.time_end = moment(item.date).set({hour: endSplit[0], minute: endSplit[1]}).format('YYYY-MM-DD HH:mm:ss')
      item.name = obj.name
      item.homework = obj.homework

      this.loading = true
      API.fetchUpdate(item).then(response => {
        let data = response.data;
        if (data.status) {
          this.snackbar = true
          this.snackbarData.text = 'Расписание обновлено'
          this.snackbarData.status = 'success'
          this.sortItems()
        }
      }).finally(() => this.loading = false)
    },

    onCreate(obj) {
      let startSplit = obj.time.start.split(':');
      let endSplit = obj.time.end.split(':');

      let item = {
        time_start: moment().set({hour: startSplit[0], minute: startSplit[1]}).format('YYYY-MM-DD HH:mm:ss'),
        time_end: moment().set({hour: endSplit[0], minute: endSplit[1]}).format('YYYY-MM-DD HH:mm:ss'),
        name: obj.name,
        homework: obj.homework,
        date: moment(this.selectedDate).format('YYYY-MM-DD HH:mm:ss')
      }

      this.loading = true
      API.fetchCreate(item).then(response => {
        let data = response.data;
        if (data.status) {
          this.snackbar = true
          this.snackbarData.text = 'Расписание добавлено'
          this.snackbarData.status = 'success'

          this.items.push(data.item)
          this.sortItems()
        }
      }).finally(() => {
        this.loading = false
        this.createDialog = false
      })
    },
    sortItems() {
      this.items.sort((a, b) => {
        return moment.utc(a.time_start).diff(moment.utc(b.time_start))
      });
    },
    viewItem(item) {
      this.selectedItem = item
      this.detailsDialog = true
    },
    previousDay() {
      const yesterday = new Date(this.selectedDate)
      yesterday.setDate(yesterday.getDate() - 1)
      this.selectedDate = yesterday
      this.title = yesterday
      this.load(yesterday)
    },
    nextDay() {
      const tomorrow = new Date(this.selectedDate)
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.selectedDate = tomorrow
      this.title = tomorrow
      this.load(tomorrow)
    },
    onClickEditBtn(item) {
      this.editDialog = true
      this.selectedItem = item
    },
    onClickAddBtn() {
      this.createDialog = true
    },
    onClickDeleteBtn(item) {
      this.loading = true
      API.fetchDelete(item.id).then(response => {
        let data = response.data;
        if (data.status) {
          let index = this.items.indexOf(item)
          this.items.splice(index, 1);
          this.snackbar = true
          this.snackbarData.text = 'Расписание удалено'
          this.snackbarData.status = 'success'
        }
      }).finally(() => this.loading = false)
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
    onReload(date) {
      if (date === null) return

      this.selectedDate = date
      this.load(new Date(date))
    },
  }
};
</script>
