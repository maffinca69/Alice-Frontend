<template>
  <div class="text-center">
    <v-dialog
        width="500"
        v-model="dialog"
    >

      <v-card>
        <v-card-title class="headline grey lighten-2" >
          {{ name }}
        </v-card-title>

        <v-text-field class="ms-7 me-15 pt-9" placeholder="Название урока" v-model="name"></v-text-field>

        <v-card-text>
          <TimePicker :start-time="this.start" :end-time="this.end" @save="onSave"/>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="closeDialog()"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TimePicker from "@/components/TimePicker";

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
      }
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false
      if (this.end === this.timeObject.end && this.start === this.timeObject.start) {
        return
      }
      this.$emit('create', {
        name: this.name,
        time: this.timeObject
      })
    },
    onSave(obj) {
      this.timeObject = obj;
    }
  },
  data: () => ({
    name: null,
    timeObject: null,
    dialog: false,
    start: null,
    end: null,
    date: null
  })
}
</script>

<style scoped>

</style>