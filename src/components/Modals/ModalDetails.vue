<template>
  <v-dialog v-model="dialog" width="500">
    <v-card v-if="item">
      <v-app-bar color="primary" dark elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ item.name }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-divider></v-divider>
      <div class="pa-3">
        <v-row>
          <v-col>
            <span class="font-weight-bold">Название урока: </span>{{ item.name }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="font-weight-bold">Начало урока: </span>
            {{ dayjs(item.time_start).format(dates.FORMAT_TIME) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="font-weight-bold">Конец урока: </span>
            {{ dayjs(item.time_end).format(dates.FORMAT_TIME) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="font-weight-bold">Домашнее задание: </span>
            <pre>{{ item.homework }}</pre>
          </v-col>
        </v-row>
      </div>

    </v-card>
  </v-dialog>
</template>

<script>
import dates from "@/utils/dates";
import dayjs from "dayjs";

export default {
  name: "ModalDetails",
  props: ['show', 'item'],
  data: () => ({
    dates,
    dayjs,
    dialog: false
  }),
  watch: {
    show: function (val) {
      if (val) this.dialog = val
    },
    dialog: function (val) {
      if (val) this.$emit('destroy')
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    }
  }
}
</script>

<style scoped>

</style>