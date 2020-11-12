<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-app-bar color="primary" dark elevation="0">
        <v-toolbar-title class="font-weight-bold">
          Информация
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
            <v-form ref="form">
              <v-text-field
                  :rules="[ rules.required(textLocal) ]"
                  placeholder="Важная информация"
                  hint="Например: продленка до 13:45"
                  persistent-hint
                  outlined
                  v-model="textLocal">
              </v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block @click="save" class="primary">{{ 'Сохранить' }}</v-btn>
          </v-col>
        </v-row>
      </div>

    </v-card>
  </v-dialog>
</template>

<script>
import dates from "@/utils/dates";
import dayjs from "dayjs";
import rules from "@/utils/rules";
import API from "@/plugins/API";

export default {
  name: "ModalInfo",
  props: ['date', 'text', 'show', 'action', 'id'],
  data: () => ({
    rules,
    dates,
    dayjs,
    API,
    dialog: false,
    datePicker: false,
    textLocal: '',
  }),
  watch: {
    show(val) {
      if (val) {
        this.dialog = val
        this.textLocal = this.text

        if (!this.text) {
          this.$refs.form.reset()
        }
      }
    },
    dialog: function (val) {
      if (val) {
        this.$emit('destroy')
      }
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false
    },
    save() {
      if (!this.$refs.form.validate()) {
        return
      }

      switch (this.action) {
        case 'update':
          this.fetchUpdate()
          break
        case 'create':
          this.fetchCreate()
          break
        default:
          console.error('Неизвестное действие')
          break
      }
    },
    fetchUpdate() {
      if (this.text === this.textLocal) {
        this.closeDialog()
        return
      }

      let item = {
        id: this.id,
        date: this.date || dayjs().format(dates.FORMAT_FULL_DATE),
        text: this.textLocal
      }

      API.fetchUpdateInfo(item).then(() => {
        this.closeDialog()
        this.$emit('update', this.textLocal)
        this.$refs.form.reset();
        this.$root.$emit('notify', 'Информация успешно обновлена!', 'info', 6000, 'ОК')
      })
    },
    fetchCreate() {
      let item = {
        date: this.date || dayjs().format(dates.FORMAT_FULL_DATE),
        text: this.textLocal
      }

      API.fetchCreateInfo(item).then(() => {
        this.closeDialog()
        this.$emit('update', this.textLocal)
        this.$root.$emit('notify', 'Информация успешно добавлена!', 'info', 6000, 'ОК')
      })
    }
  }
}
</script>