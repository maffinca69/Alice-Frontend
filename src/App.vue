<template>
  <v-app>

    <Header ref="header" @date-change="onReload" @loading="loading = !loading" :title="title" @add="onClickAddBtn"/>

    <v-main class="mt-1">

      <Notification/>

      <div v-if="isMobile">
        <app-mobile
            v-if="items.length"
            :items="items"
            @edit="onClickEditBtn"
            @delete="onClickDeleteBtn"
        />
        <div v-else>
          <center>
            <v-toolbar-title class="pa-3">{{ emptyText }}</v-toolbar-title>
            <br>
            <v-btn color="green" text outlined @click="openCalendar">Выбрать дату</v-btn>
          </center>
        </div>
      </div>

      <div v-else-if="items.length">
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
            <v-btn :disabled="loading" icon color="btn__primary" @click="onClickEditBtn(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn :disabled="loading" icon color="green" @click="viewItem(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.homework="{ item }">
            <td>{{ text.trimmedText(item.homework || '', 120) }}</td>
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
            <v-btn class="btn accent" @click="onClickAddBtn" :disabled="loading">
              <v-icon
                  dark
                  left
              >
                mdi-plus
              </v-icon>
              Добавить
            </v-btn>

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
      </div>
      <div v-else>
        <center>
          <v-toolbar-title class="pa-3">{{ emptyText }}</v-toolbar-title>
          <br>
          <v-btn color="green" text outlined @click="openCalendar">Выбрать дату</v-btn>
        </center>
      </div>

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
      <ModalConfirmDelete
          :item="this.selectedItem"
          :show="this.confirmDeleteDialog"
          @delete="onDelete"
          @destroy="onDestroyDeleteConfirmDialog">
      </ModalConfirmDelete>
    </v-main>
  </v-app>
</template>

<script>
// Components
import Header from "@/components/Header/Header";
import AppMobile from "./AppMobile";

// Utils
import dates from "@/utils/dates";
import text from "@/utils/text";
import API from "@/plugins/API";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import {isMobile} from 'mobile-device-detect';

// Notify
import Notification from "@/components/Notification";

// Modals
import ModalDetails from "@/components/Modals/ModalDetails";
import ModalEdit from "@/components/Modals/ModalEdit";
import ModalCreate from "@/components/Modals/ModalCreate";
import ModalConfirmDelete from "@/components/Modals/ModalConfirmDelete";
import AppMixin from "@/mixins/AppMixin";

export default {
  name: 'App',
  components: {
    AppMobile,
    Notification,
    ModalDetails,
    ModalEdit,
    ModalCreate,
    ModalConfirmDelete,
    Header
  },
  mixins: [
    API,
    AppMixin
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
    emptyText: 'Нет уроков на этот день',
    text,
    dayjs,
    copyScheduleItems: [
      ['На неделю'],
      ['На месяц'],
      ['На год'],
    ],
    cruds: [
      ['Create', 'mdi-plus-outline'],
      ['Read', 'mdi-file-outline'],
      ['Update', 'mdi-update'],
      ['Delete', 'mdi-delete'],
    ],
    title: dayjs().locale('ru').format(dates.FORMAT_DAY),
    headers: [
      {text: 'Урок', value: 'name', width: 300},
      {text: 'Начало', value: 'time_start', width: 100},
      {text: 'Окончание', value: 'time_end', width: 120},
      {text: 'Домашнее задание', value: 'homework'},
      {text: 'Действия', value: 'action', sortable: false, align: 'center', width: 300},
    ],
    isMobile: isMobile,
    items: []
  }),
  methods: {
    allowedDatesForRange: val => [0,1].includes(dayjs(val).day()),
    load(date) {
      this.emptyText = 'Загружаю...'
      let dateLoading = date === undefined ?
          dayjs().format(dates.FORMAT_FULL_DATE) :
          dayjs(date).format(dates.FORMAT_FULL_DATE)

      this.loading = true
      return API.fetchGet(dateLoading).then(response => {
        if (response && response.status === 200) {
          this.items = response.data.data;
        }

        if (!this.items.length) {
          this.emptyText = 'Нет уроков на этот день'
        }
      }).finally(() => this.loading = false)
    },

    prepareFetchData(source, updateData) {
      let startSplit = updateData.start.split(':');
      let endSplit = updateData.end.split(':');

      return {
        id: 'id' in source ? source.id : 0,
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
        return dayjs(new Date(a.time_start)).diff(dayjs(new Date(b.time_start)))
      });
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
            'Сейчас идет ' + (index + 1) + ' урок (' + lesson.name + ')', 'info', 3000)
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
    onReload(date) {
      if (date === null) return

      this.selectedDate = date
      this.load(date)
    },
    openCalendar() {
      this.$refs.header.openPicker()
    }
  }
};
</script>
