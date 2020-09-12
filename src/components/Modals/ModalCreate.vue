<template>
  <v-dialog v-model="dialog" width="500">

    <v-card>
      <v-app-bar color="primary" dark elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ name || 'Название урока' }}
        </v-toolbar-title>
      </v-app-bar>

      <v-divider></v-divider>

      <v-text-field
          class="ms-6 me-6"
          placeholder="Название урока"
          v-model="name">
      </v-text-field>

      <v-card-text>
        <TimePicker :start-time="this.start" :end-time="this.end" @save="onSave"/>
      </v-card-text>

      <v-textarea
          class="ms-6 me-6"
          rows="3"
          outlined
          :rules="[ rules.maxLength(12) ]"
          length="12"
          counter
          placeholder="Домашнее задание (не обязательно)"
          v-model="homework">
      </v-textarea>


      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="red"
            text
            @click="closeDialog()">
          Закрыть
        </v-btn>
        <v-btn
            color="primary"
            text
            @click="create()">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TimePicker from "@/components/TimePicker";
import rules from '@/utils/rules';

export default {
  name: "Modal",
  components: {TimePicker},
  props: ['show', 'dateForCreate'],

  watch: {
    show: function(val) {
      if (val) {
        this.dialog = val
      }
    },
    dateForCreate: function (val) {
      this.date = val
    },
    dialog: function(val) {
      if (!val) {
        this.$emit('dialog', val)
      } else {
        this.$emit('destroy')
      }
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false
      this.$emit('destroy')
    },
    create() {
      this.dialog = false
      if (this.end === this.timeObject.end && this.start === this.timeObject.start) {
        return
      }
      this.$emit('create', {
        name: this.name,
        homework: this.homework,
        time: this.timeObject
      })
    },
    onSave(obj) {
      this.timeObject = obj;
    }
  },
  data: () => ({
    name: null,
    homework: null,
    timeObject: null,
    dialog: false,
    start: null,
    end: null,
    date: null,
    rules,
  })
}
</script>

<style scoped>

</style>