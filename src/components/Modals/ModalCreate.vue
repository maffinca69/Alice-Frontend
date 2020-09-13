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

        <div class="ms-6 me-6">
          <TimePicker :start-time="this.start" :end-time="this.end" @save="onSave"/>
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
import ScheduleStore from "@/mixins/ScheduleStoreMixin";

export default {
  mixins: [
      ScheduleStore
  ]
}
</script>

<style scoped>

</style>