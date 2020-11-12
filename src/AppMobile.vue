<template>
  <div>
    <v-card
        outlined
        class="mx-auto mt-4"
        max-width="344"
        v-for="(item, index) in items"
        :key="index"
    >
      <v-card-text>
        <div class="text--primary text-h5">
          {{ item.name }}
        </div>
        <p>
          {{ dayjs(item.time_start).format(dates.FORMAT_TIME) }} -
          {{ dayjs(item.time_end).format(dates.FORMAT_TIME) }}
        </p>
        <div class="text--primary">
          {{ item.homework || 'Домашнего задания нет' }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="loading" icon color="red" @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn :disabled="loading" icon color="btn__primary" @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
import dates from "@/utils/dates";
import text from "@/utils/text";
import AppMixin from "@/mixins/AppMixin";

export default {
  name: "AppMobile",
  props: ['items'],
  mixins: [
      AppMixin
  ],
  data: () => ({
    dayjs: dayjs,
    dates,
    text
  }),
  mounted() {
    console.log(this.items)
  },
  methods: {
    edit(item) {
      this.$emit('edit', item)
    },
    deleteItem(item) {
      this.$emit('delete', item)
    }
  },
}
</script>