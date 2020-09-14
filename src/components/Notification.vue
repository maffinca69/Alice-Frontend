<template>
  <v-expand-transition>
    <v-card v-show="this.show" outlined>
      <v-alert :type="this.type" class="ma-2" ref="notify">{{ this.text }}</v-alert>
    </v-card>
  </v-expand-transition>
</template>

<script>
export default {
  name: "Notification",
  data: () => ({
    text: '',
    type: 'info',
    show: false
  }),
  mounted() {
    let context = this
    this.$root.$on('notify', (text, type, timeout) =>  {
      context.text = text
      context.type = type
      context.show = true

      setTimeout(() => {
        context.show = false
      }, timeout)
    })
  },
}
</script>

<style scoped>

</style>