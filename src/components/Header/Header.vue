<template>
  <v-app-bar
      app
      color="primary"
      dark
  >
    <div class="d-flex align-center">
      <v-toolbar-title class="font-weight-bold text-capitalize">
        {{ currentDay }}
      </v-toolbar-title>
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
          >mdi-calendar</v-icon>
        </template>
        <v-date-picker
            v-model="date"
            locale="RU"
            first-day-of-week="1"
            elevation="16"
            no-title
        >
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="menu = false">Отмена</v-btn>
          <v-btn text color="btn__primary" @click="load">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </div>
    <v-spacer></v-spacer>
    <SettingsMenu />
  </v-app-bar>
</template>

<script>
import dates from "@/utils/dates";
import dayjs from "dayjs";
import 'dayjs/locale/ru'
import SettingsMenu from "@/components/Header/SettingsMenu"; // load on demand

export default {
  name: "Header",
  components: {SettingsMenu},
  props: ['title'],
  watch: {
    title: function (val) {
      this.currentDay = dayjs(val).locale('ru').format(dates.FORMAT_DAY)
      this.date = dayjs(val).format('YYYY-MM-DD')
    }
  },
  data: () => ({
    menu: false,
    date: null,
    dayjs,
    currentDay: dayjs().locale('ru').format(dates.FORMAT_DAY),
  }),
  methods: {
    load() {
      this.$refs.menu.save(this.date)
      this.currentDay = dayjs(this.date).locale('ru').format(dates.FORMAT_DAY)
      this.$emit('date-change', this.date)
    }
  }
}
</script>

<style scoped>

</style>