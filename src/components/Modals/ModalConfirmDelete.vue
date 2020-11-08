<template>
  <v-dialog
      v-model="dialog"
      max-width="344"
      width="500"
  >
    <v-card>
      <v-card-title class="headline">
        Удаление урока
      </v-card-title>

      <v-card-text>
        Вы действительно хотите удалить данный урок?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            color="primary"
            text
            @click="dialog = false"
        >
          Отмена
        </v-btn>

        <v-btn
            color="red"
            text
            @click="deleteItem"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'item',
    'show'
  ],
  name: "ModalConfirmDelete",
  data: () => ({
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
    deleteItem() {
      this.dialog = false
      this.$emit('delete', this.item)
      this.$emit('destroy')
    }
  },
  mounted() {
    console.log(this.show)
  }
}
</script>