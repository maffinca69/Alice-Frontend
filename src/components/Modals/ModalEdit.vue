<template>
  <v-dialog v-model="dialog" width="500">

    <v-card>
      <v-app-bar color="primary" dark elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ name || 'Название урока' }}
        </v-toolbar-title>
      </v-app-bar>

      <v-divider></v-divider>

      <v-form ref="form">
        <v-text-field
            class="ms-6 me-6"
            :rules="[ rules.required(name) ]"
            placeholder="Название урока"
            v-model="name">
        </v-text-field>

        <div class="ms-6 me-6" >
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
                        v-model="start">
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
                      v-model="start">
                    <v-spacer></v-spacer>
                    <v-btn text color="red" @click="startModal = false">Закрыть</v-btn>
                    <v-btn text color="btn__primary" @click="startModal = false">OK</v-btn>
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
                        v-model="end">
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
                  >
                    <v-spacer></v-spacer>

                    <v-btn text color="red" @click="endModal = false">Закрыть</v-btn>
                    <v-btn text color="btn__primary" @click="endModal = false">OK</v-btn>
                  </v-time-picker>

                </v-dialog>

              </v-col>
            </v-row>
          </div>
        </div>

        <v-textarea
            class="ms-6 me-6"
            rows="3"
            outlined
            :rules="[ rules.maxLength(255) ]"
            length="12"
            counter
            placeholder="Домашнее задание (не обязательно)"
            v-model="homework">
        </v-textarea>
      </v-form>


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
            color="btn__primary"
            text
            @click="create()">
          Обновить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ScheduleStoreMixin from "@/mixins/ScheduleStoreMixin";
import dates from "@/utils/dates";
import dayjs from 'dayjs'

export default {
  mixins: [
      ScheduleStoreMixin
  ],
  data: () => ({
    dayjs,
  }),
  watch: {
    item: function(val, newVal) {
      let item = val || newVal
      this.end = dayjs(item.time_end).format(dates.FORMAT_TIME)
      this.start = dayjs(item.time_start).format(dates.FORMAT_TIME)
      this.name = item.name
      this.homework = item.homework
    },
  }
}
</script>

<style scoped>

</style>