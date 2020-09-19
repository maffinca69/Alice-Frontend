<template>
  <v-app>

    <Header @date-change="onReload" :title="title" />

    <v-main class="mt-1">

      <Notification />

      <v-data-table
          disable-filtering
          loading-text="Расписание загружается..."
          no-data-text="Уроки не найдены"
          :hide-default-footer="true"
          :headers="headers"
          :items="items"
          :loading="loading">
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
          <td>{{ dayjs(item.time_start).format(dates.FORMAT_TIME) }}</td>
        </template>
        <template v-slot:item.time_end="{ item }">
          <td>{{ dayjs(item.time_end).format(dates.FORMAT_TIME) }}</td>
        </template>
      </v-data-table>

      <v-layout row justify-space-around class="mb-4 mt-3">
        <v-layout justify-start class="ms-6">
          <v-btn class="btn accent" @click="onClickAddBtn" :disabled="loading">Добавить</v-btn>
        </v-layout>
        <v-layout row justify-end class="me-6">
          <v-btn class="btn primary me-2" @click="previousDay" :disabled="loading" icon>
            <v-icon color="white">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn class="btn primary ms-2" @click="nextDay" :disabled="loading" icon>
            <v-icon color="white">
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-layout>
      </v-layout>

      <ModalEdit
          :show="this.editDialog"
          v-model="editDialog"
          :item="this.selectedItem"
          @destroy="onDestroyEditDialog"
          @submit="onUpdate">
      </ModalEdit>
      <ModalCreate
          v-model="createDialog"
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
    </v-main>
  </v-app>
</template>

<script>
import Header from "@/components/Header";

// Utils
import dates from "@/utils/dates";
import text from "@/utils/text";
import API from "@/plugins/API";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'

// Notify
import Notification from "@/components/Notification";

// Modals
import ModalDetails from "@/components/Modals/ModalDetails";
import ModalEdit from "@/components/Modals/ModalEdit";
import ModalCreate from "@/components/Modals/ModalCreate";

export default {
  name: 'App',
  components: {
    Notification,
    ModalDetails,
    ModalEdit,
    ModalCreate,
    Header
  },
  mixins: [
      API
  ],
  created() {
    API.init(this)
  },
  mounted() {
    this.load().then(() => {
      setTimeout(() => {
        this.checkCurrentLesson()
      }, 300)
    })
  },
  data: () => ({
    dates,
    text,
    dayjs,
    title: dayjs().locale('ru').format(dates.FORMAT_DAY),
    selectedDate: dayjs().format(dates.FORMAT_FULL_DATE),
    editDialog: false,
    createDialog: false,
    detailsDialog: false,
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
      let dateLoading = date === undefined ?
          dayjs().format(dates.FORMAT_FULL_DATE) :
          dayjs(date).format(dates.FORMAT_FULL_DATE)

      this.loading = true
      return API.fetchGet(dateLoading).then(response => {
        if (response && response.status === 200) {
          this.items = response.data.data;
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
    prepareFetchData(source, updateData) {
      let startSplit = updateData.start.split(':');
      let endSplit = updateData.end.split(':');

      return {
        id: 'id' in source ? source.id: 0,
        time_start: dayjs()
            .set('hour', startSplit[0])
            .set('minute', startSplit[1])
            .format(dates.FORMAT_FULL_DATE),
        time_end: dayjs()
            .set('hour', endSplit[0])
            .set('minute', endSplit[1])
            .format(dates.FORMAT_FULL_DATE),
        name: updateData.name,
        homework: updateData.homework,
        date: dayjs(this.selectedDate).format(dates.FORMAT_FULL_DATE)
      }
    },
    sortItems() {
      this.items.sort((a, b) => {
        return dayjs(new Date(a.time_start)).diff(new Date(b.time_start))
      });
    },
    viewItem(item) {
      this.selectedItem = item
      this.detailsDialog = true
    },
    previousDay() {
      const yesterday = dayjs(this.selectedDate).subtract(1, 'day')
      this.selectedDate = yesterday
      this.title = yesterday
      this.load(yesterday)
    },
    nextDay() {
      const tomorrow = dayjs(this.selectedDate).add(1, 'day')
      this.selectedDate = tomorrow
      this.title = tomorrow
      this.load(tomorrow)
    },

    // Проверяем идет ли сейчас урок/перемена
    checkCurrentLesson() {
      dayjs.extend(isBetween)

      // Идет урок
      let lesson = this.items.find(el => {
        return dayjs().isBetween(dayjs(el.time_start), dayjs(el.time_end), 'minute')
      })

      // Идет перемена
      let schoolBreak = this.items.find((el, index) => {
        let isNext = this.items[index + 1] !== undefined
        if (isNext) {
          return dayjs().isBetween(dayjs(el.time_end), dayjs(this.items[index + 1].time_start), 'minute')
        }
      })

      if (lesson) {
        let index = this.items.indexOf(lesson)
        return this.$root.$emit('notify',
            'Сейчас идет ' + (index + 1) + ' урок (' + lesson.name +')', 'info', 3000)
      }

      if (schoolBreak) {
        let index = this.items.indexOf(schoolBreak)
        return this.$root.$emit(
            'notify',
            'Сейчас идет перемена между ' + (index + 1) + ' и ' + (index + 2) + ' уроком',
            'info',
            5000
        )
      }

      // Уроки закончились
      let text = 'На сегодня уроки закончились. Открыть расписание на завтра?'
      return this.$root.$emit('notify', text, 'info', 6000, 'ОК', () => {
        this.nextDay()
      })
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
        if (response && response.status === 200) {
          let index = this.items.indexOf(item)
          this.items.splice(index, 1);
          this.$root.$emit('notify', 'Урок удален', 'success', 2000)
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
      this.load(date)
    },
  }
};
</script>
