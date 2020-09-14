<template>
  <v-snackbar
      v-model="this.show"
      :color="this.color"
      :timeout="this.timeout"
  >
    {{ this.text }}

    <template v-slot:action="{ attrs }">
      <v-btn
          text
          v-bind="attrs"
          @click="this.show = false">
        OK
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  data: () => ({
    show: false,
    color: 'error',
    timeout: 5000,
    text: ''
  }),
  mounted() {
    let context = this;
    this.$root.$on('snackbar', (text, color = 'success', timeout = 5000) => {
      context.show = true
      context.text = text
      context.color = color
      context.timeout = timeout

      setTimeout(() => {
        context.show = false
      }, timeout)
    })
  }
}
</script>

<style scoped>

</style>