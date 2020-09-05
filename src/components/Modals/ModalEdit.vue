<template>
  <div class="text-center">
    <v-dialog
        width="500"
        v-model="dialog"
    >

      <v-card>
        <v-card-title class="headline grey lighten-2" v-if="item">
          {{ item.name }}
        </v-card-title>

        <v-card-text v-if="item">
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
  props: ['show', 'item'],

  watch: {
    show: function(val) {
      if (val) {
        this.dialog = val
      }
    },
    item: function (val) {
      this.end = val.time_end
      this.start = val.time_start
      this.timeObject = {
        start: this.start,
        end: this.end ,
      }
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
      this.$emit('save', this.timeObject)
    },
    onSave(obj) {
      this.timeObject = obj;
    }
  },
  data: () => ({
    timeObject: null,
    dialog: false,
    start: null,
    end: null,
  })
}
</script>

<style scoped>

</style>