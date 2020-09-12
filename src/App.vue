<template>
  <v-app>

    <Header @date-change="onReload" />

    <v-main>
      <v-data-table :hide-default-footer="true" :headers="headers" :items="items" :loading="loading">
        <template v-slot:item.action="{ item }">
          <v-btn :disabled="loading" icon color="red" @click="remove(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn :disabled="loading" icon color="primary" @click="edit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.time_start="{ item }">
          <td>{{ dates.formattedDateToTime(item.time_start) }}</td>
        </template>
        <template v-slot:item.time_end="{ item }">
          <td>{{ dates.formattedDateToTime(item.time_end) }}</td>
        </template>
      </v-data-table>

      <v-layout row justify-start class="ms-4 mt-4">
        <v-btn class="btn success" @click="add" :disabled="loading">Добавить</v-btn>
      </v-layout>

      <Modal :item="selectedItem" :show="this.dialog" @save="onSave" @dialog="onDialog"></Modal>
      <ModalCreate :date-for-create="selectedDate" :show="this.createDialog" @destroy="onDestroyCreateDialog" @create="onCreate" @dialog="onDialog"></ModalCreate>

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
import Modal from "@/components/Modals/ModalEdit";
import ModalCreate from "@/components/Modals/ModalCreate";
import dates from "@/helpers/dates";
import moment from 'moment'

export default {
  name: 'App',
  components: {
    Modal,
    ModalCreate,
    Header
  },
  mounted() {
    this.load()
  },
  data: () => ({
    selectedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    dialog: false,
    createDialog: false,
    snackbar: false,
    snackbarData: {
      text: null,
      status: 'error'
    },
    dates: dates,
    selectedItem: null,
    loading: false,
    headers: [
      { text: 'Урок', value: 'name' },
      { text: 'Начало', value: 'time_start' },
      { text: 'Окончание', value: 'time_end' },
      { text: 'Учитель', value: 'teacher' },
      { text: 'Действия', value: 'action', sortable: false, align: 'center' },
    ],
    items: [

    ]
  }),
  methods: {
    load(date) {
      this.loading = true
      if (date === undefined) {
        date = (new Date()).toDateString()
      } else {
        date = date.toDateString()
      }
      this.$axios.get('/list?date=' + date).then(response => {
        this.items = response.data.data;
        this.sortItems()
      }).finally(() => {
        this.loading = false
      })
    },
    remove(item) {
      this.fetchRemove(item.id).then(response => {
        let data = response.data;
        if (data.status) {
          let index = this.items.indexOf(item)
          this.items.splice(index, 1);
          this.snackbar = true
          this.snackbarData.text = 'Расписание удалено'
          this.snackbarData.status = 'success'
        }

      })
    },
    fetchRemove(id) {
      this.loading = true
      return this.$axios.delete('/delete?id=' + id).catch(() => {
        this.snackbar = true
        this.snackbarData.text = 'Ошибка'
        this.snackbarData.status = 'error'
      }).finally(() => {
        this.loading = false
      })
    },
    edit(item) {
      this.dialog = true
      this.selectedItem = item
    },
    add() {
      this.createDialog = true
    },
    fetchUpdate(item) {
      this.loading = true
      this.$axios.put('/update', item).then(response => {
        let data = response.data;
        if (data.status) {
          this.snackbar = true
          this.snackbarData.text = 'Расписание обновлено'
          this.snackbarData.status = 'success'
          this.sortItems()
        }
      }).catch(error => {
        this.snackbar = true
        this.snackbarData.text = error.error.message
        this.snackbarData.status = 'error'
      }).finally(() => {
        this.loading = false
      })
    },
    fetchCreate(item) {
      this.loading = true
      this.$axios.post('/create', item).then(response => {
        let data = response.data;
        if (data.status) {
          this.snackbar = true
          this.snackbarData.text = 'Расписание добавлено'
          this.snackbarData.status = 'success'
          this.items.push(data.item)
          this.sortItems()
        }
      }).catch(error => {
        this.snackbar = true
        this.snackbarData.text = error.error.message
        this.snackbarData.status = 'error'
      }).finally(() => {
        this.loading = false
        this.createDialog = false
      })
    },
    onSave(obj) {
      let index = this.items.indexOf(this.selectedItem);
      let item = this.items[index];

      let startSplit = obj.start.split(':');
      let endSplit = obj.end.split(':');

      item.time_start = moment(item.date).set({hour: startSplit[0], minute: startSplit[1]}).format('YYYY-MM-DD HH:mm:ss')
      item.time_end = moment(item.date).set({hour: endSplit[0], minute: endSplit[1]}).format('YYYY-MM-DD HH:mm:ss')

      this.fetchUpdate(item)
    },

    onCreate(obj) {
      let startSplit = obj.time.start.split(':');
      let endSplit = obj.time.end.split(':');

      let item = {
        time_start: moment().set({hour: startSplit[0], minute: startSplit[1]}).format('YYYY-MM-DD HH:mm:ss'),
        time_end: moment().set({hour: endSplit[0], minute: endSplit[1]}).format('YYYY-MM-DD HH:mm:ss'),
        name: obj.name,
        date: this.selectedDate
      }

      this.fetchCreate(item)
    },
    sortItems() {
      this.items.sort((a, b) => {
        return a.time_start.localeCompare(b.time_start);
      });
    },
    onDialog(value) {
      this.dialog = value
    },
    onDestroyCreateDialog() {
      this.createDialog = false
    },
    onReload(date) {
      if (date === null) {
        return
      }

      this.selectedDate = date
      this.load(new Date(date))
    }
  }
};
</script>
