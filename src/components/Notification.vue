<template>
  <div>
    <v-expand-transition>
      <v-card v-show="this.showFull" outlined>
        <v-alert prominent :type="this.type" class="ma-2" >
          <v-row align="center">
            <v-col class="grow">{{ this.text }}</v-col>
            <v-col class="shrink">
              <v-btn ref="actionBtn" outlined>{{ this.actionText }}</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-card>
    </v-expand-transition>
    <v-expand-transition>
      <v-card v-if="this.showSimple" outlined>
        <v-alert
            dismissible
            close-icon="mdi-close-circle"
            :type="this.type"
            class="ma-2">
          {{ this.text }}
        </v-alert>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: "Notification",
  data: () => ({
    text: '',
    type: 'info',
    showFull: false,
    showSimple: false,
    actionText: null
  }),
  mounted() {
    let self = this
    this.$root.$on('notify', (text, type, timeout, actionText = null, callback = null) =>  {
      self.showSimple = !actionText
      self.text = text
      self.type = type
      self.actionText = actionText

      if (actionText) {
        self.showFull = true
        self.$refs.actionBtn.click = () => {
          callback()
          self.showFull = false
        }
      }

      setTimeout(() => {
        self.showSimple = false
        self.showFull = false
      }, timeout)
    })
  },
}
</script>

<style scoped>

</style>