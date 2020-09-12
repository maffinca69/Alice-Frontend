<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-dialog
            ref="startDialog"
            v-model="startModal"
            persistent
            width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="start"
                label="Начало"
                prepend-icon="mdi-clock"
                readonly
                :rules="[ rules.required(start) ]"
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
            <v-chip-group
                v-model="start"
                active-class="deep-blue--text text--accent-4"
            >
              <v-chip
                  v-for="item in suggestionsStart"
                  :key="item"
                  small
                  outlined
                  :value="item">
                {{ item }}
              </v-chip>
            </v-chip-group>
          </template>
          <v-time-picker
              format="24hr"
              v-if="startModal"
              v-model="start"
              full-width
          >
            <v-spacer></v-spacer>
            <v-btn text color="red" @click="startModal = false">Закрыть</v-btn>
            <v-btn text color="primary" @click="saveStart">OK</v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-dialog
            ref="endDialog"
            v-model="endModal"
            persistent
            width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="end"
                label="Окончание"
                prepend-icon="mdi-clock"
                readonly
                :rules="[ rules.required(end) ]"
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
            <v-chip-group
                v-model="end"
                active-class="deep-blue--text text--accent-4"
            >
              <v-chip
                  v-for="item in suggestionsEnd"
                  :key="item"
                  small
                  outlined
                  :value="item">
                {{ item }}
              </v-chip>
            </v-chip-group>
          </template>
          <v-time-picker
              format="24hr"
              v-if="endModal"
              v-model="end"
              full-width
          >
            <v-spacer></v-spacer>

            <v-btn text color="red" @click="endModal = false">Закрыть</v-btn>
            <v-btn text color="primary" @click="saveEnd">OK</v-btn>
          </v-time-picker>

        </v-dialog>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import dates from "@/utils/dates";
import moment from 'moment'
import rules from "@/utils/rules";

export default {
  name: "TimePicker",
  props: ['startTime', 'endTime'],
  mounted() {
    this.end = this.endTime ? dates.formattedDateToTime(this.endTime) : null
    this.start = this.startTime ? dates.formattedDateToTime(this.startTime) : null
    this.suggestionsEnd = [];
  },
  data: () => ({
    rules,
    time: null,
    menu2: false,
    end: null,
    start: null,
    startModal: false,
    endModal: false,
    suggestionsStart: [
      '08:20',
      '09:20',
      '10:10',
      '11:05',
      '12:00',
    ],
    suggestionsEnd: [] // recount
  }),
  watch: {
    start: function(val) {
      this.saveStart()
      if (val) {
        this.recountSuggestionsEndTime(val);
      }
    },
    end: function () {
      this.saveEnd()
    }
  },
  methods: {
    save() {
      this.$emit('save', {
        start: this.start,
        end: this.end,
      });
    },
    saveStart() {
      this.endModal = false
      this.$refs.startDialog.save(this.start)
      this.save()
    },
    saveEnd() {
      this.$refs.endDialog.save(this.end)
      this.startModal = false
      this.save()
    },
    recountSuggestionsEndTime(val) {
      this.suggestionsEnd = []
      let arr = [];
      let lastTime = null;
      let format = 'HH:mm'

      // 5 уроков
      for (let i = 0; i < 5; i++) {
        let time = moment(lastTime || val, format)
            .add(40, 'minutes') // 40 - время урока
            .format('HH:mm')
        lastTime = time;
        arr.push(time)
      }
      this.suggestionsEnd = arr;
    },
  }
}
</script>

<style scoped>

</style>