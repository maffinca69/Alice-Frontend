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
          <v-btn text color="primary" @click="menu = false">Отмена</v-btn>
          <v-btn text color="primary" @click="load">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import dates from "@/helpers/dates";

export default {
  name: "Header",
  data: () => ({
    menu: false,
    date: null,
    currentDay: dates.currentDayName(),
  }),
  methods: {
    load() {
      this.$refs.menu.save(this.date)
      this.currentDay = dates.currentDayName(this.date),
      this.$emit('date-change', this.date)
    }
  }
}
</script>

<style scoped>

</style>