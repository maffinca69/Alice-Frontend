<template>
  <div>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <ModalInfo
          :text="text"
          :date="date"
          :show="modalInfo"
          :action="infoId === null ? 'create' : 'update'"
          :id="infoId"
          @destroy="modalInfo = false"
          @update="updateInfo">
      </ModalInfo>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex">
        <div class="flex-column">
          <v-toolbar-title class="font-weight-bold text-capitalize">{{ currentDay }}</v-toolbar-title>
          <small>{{ text }}</small>
        </div>

        <v-menu
            rounded="lg"
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="fade-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-icon
                class="ms-2"
                v-model="date"
                v-on="on"
            >mdi-calendar
            </v-icon>
          </template>
          <v-date-picker
              v-model="date"
              locale="RU"
              first-day-of-week="1"
              elevation="16"
              no-title
          >
          </v-date-picker>
        </v-menu>
      </div>
      <v-spacer></v-spacer>
      <v-icon
          @click="openInfoModal"
          class="ms-2">
        mdi-pencil
      </v-icon>
      <v-icon
          v-if="isMobile"
          class="ms-2"
          @click="onClickAddBtn"
      >mdi-plus
      </v-icon>

      <SettingsMenu v-else/>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        app flat
        fixed
        absolute
        temporary>
      <v-list>
        <v-list-group prepend-icon="mdi-book-open">
          <template v-slot:activator>
            <v-list-item-title>Расписание</v-list-item-title>
          </template>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Копирование</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="([title, type], i) in copyScheduleList" :key="i" link @click="copySchedule(type)">
              <v-list-item-title v-text="title"></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
        <v-list-item link @click="clearDay()">
          <v-list-item-title>
            <v-icon>
              mdi-delete
            </v-icon>
            Очистить день
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>

</template>

<script>
import dates from "@/utils/dates";
import dayjs from "dayjs";
import 'dayjs/locale/ru'
import SettingsMenu from "@/components/Header/SettingsMenu"; // load on demand

import {isMobile} from 'mobile-device-detect';
import API from "@/plugins/API";
import ModalInfo from "@/components/Modals/ModalInfo";

export default {
  name: "Header",
  components: {ModalInfo, SettingsMenu},
  props: ['title'],
  mixins: [
    API
  ],
  watch: {
    title: function (val) {
      this.currentDay = dayjs(val).locale('ru').format(dates.FORMAT_DAY)
      this.date = dayjs(val).format('YYYY-MM-DD')
    },
    date() {
      this.load()
    }
  },
  data: () => ({
    copyScheduleList: [
      ['На неделю', 1],
      ['На месяц', 2],
      ['На год', 3],
    ],
    drawer: false,
    menu: false,
    date: null,
    dayjs,
    currentDay: dayjs().locale('ru').format(dates.FORMAT_DAY),
    selectedDate: dayjs().format(dates.FORMAT_FULL_DATE),
    isMobile: isMobile,
    text: '',
    infoId: null,

    modalInfo: false,
  }),
  mounted() {
    this.loadInfo()
  },
  methods: {
    load() {
      this.$refs.menu.save(this.date)
      this.selectedDate = dayjs(this.date).format(dates.FORMAT_FULL_DATE)
      this.currentDay = dayjs(this.date).locale('ru').format(dates.FORMAT_DAY)
      this.$emit('date-change', this.date)
      this.loadInfo()
    },
    loadInfo() {
      API.fetchInfo(this.date || dayjs().format(dates.FORMAT_FULL_DATE)).then(response => {
        this.text = response.data.response
        this.infoId = response.data.id
      })
    },
    onClickAddBtn() {
      this.$emit('add')
    },
    openInfoModal() {
      this.modalInfo = true
    },
    updateInfo(value) {
      this.text = value
    },
    copySchedule(type) {
      let data = {
        currentDate: this.selectedDate,
        type: type
      }
      this.$emit('loading')
      this.drawer = false;
      API.fetchCopySchedule(data).then(response => {
        this.$root.$emit('notify', response.data.message, 'success', 2000)
      }).finally(() => {
        this.$emit('loading')
      })
    },
    clearDay() {
      this.$emit('loading')
      this.drawer = false;
      API.fetchClearDay(this.selectedDate).then(response => {
        this.$root.$emit('notify', response.data.message, 'success', 2000)
      }).finally(() => {
        this.$emit('loading')
      })
    },
  }
}
</script>

<style scoped>

</style>