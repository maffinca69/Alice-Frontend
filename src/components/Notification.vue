<template>
  <v-expand-transition>
    <v-card v-show="this.show" outlined>
      <v-alert prominent :type="this.type" class="ma-2" v-show="!!this.actionText">
        <v-row align="center">
          <v-col class="grow">{{ this.text }}</v-col>
          <v-col class="shrink">
            <v-btn ref="actionBtn" outlined>{{ this.actionText }}</v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <v-alert
          v-if="!this.actionText"
          dismissible
          close-icon="mdi-close-circle"
          :type="this.type"
          class="ma-2">
        {{ this.text }}
      </v-alert>
    </v-card>
  </v-expand-transition>
</template>

<script>
export default {
  name: "Notification",
  data: () => ({
    text: '',
    type: 'info',
    show: false,
    actionText: null
  }),
  mounted() {
    let self = this
    this.$root.$on('notify', (text, type, timeout, actionText = null, callback = null) =>  {
      self.show = true
      self.text = text
      self.type = type
      self.actionText = actionText

      if (actionText) {
        self.$refs.actionBtn.click = callback
      }

      setTimeout(() => {
        self.show = false
      }, timeout)
    })
  },
}
</script>

<style scoped>

</style>