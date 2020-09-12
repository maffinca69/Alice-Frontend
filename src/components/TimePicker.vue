<template>
  <v-row>
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
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
          <v-chip-group
              v-model="suggestionStart"
              active-class="deep-blue--text text--accent-4"
          >
            <v-chip v-for="item in suggestions" :key="item" small>
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
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
          <v-chip-group
              v-model="suggestionEnd"
              active-class="deep-blue--text text--accent-4"
          >
            <v-chip v-for="item in suggestions" :key="item" small>
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
<!--    <v-col>-->
<!--      -->
<!--    </v-col>-->
  </v-row>
</template>

<script>
import dates from "@/utils/dates";

export default {
  name: "TimePicker",
  props: ['startTime', 'endTime'],
  mounted() {
    this.end = this.endTime ? dates.formattedDateToTime(this.endTime) : null
    this.start = this.startTime ? dates.formattedDateToTime(this.startTime) : null
  },
  data: () => ({
    time: null,
    menu2: false,
    end: null,
    start: null,
    startModal: false,
    endModal: false,
    suggestionStart: null,
    suggestionEnd: null,
    suggestions: [
      '08:20',
      '09:20',
      '10:10',
      '12:00',
    ]
  }),
  watch: {
    suggestionStart: function (val) {
      this.start = this.suggestions[val]
    },
    suggestionEnd: function (val) {
      this.end = this.suggestions[val]
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
      this.$refs.endDialog.save(this.end)
      this.startModal = false
      this.save()
    },
    saveEnd() {
      this.endModal = false
      this.$refs.startDialog.save(this.start)
      this.save()
    }
  }
}
</script>

<style scoped>

</style>