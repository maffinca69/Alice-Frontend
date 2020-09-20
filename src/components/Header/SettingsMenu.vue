<template>
  <v-menu offset-y >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon class="ms-2" v-on="on" v-bind="attrs" >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index">
          <v-switch
              v-if="item.type === 'switch'"
              :label="item.title"
              color="accent"
              v-model="item.value"
              @change="item.callback ? item.callback($event) : onClickMenuItem(item, $event)">
          </v-switch>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import settings from "@/plugins/settings";

export default {
  name: "SettingsMenu",
  self: this,
  data: () => ({
    menu: false,
    items: [
      {
        title: 'Уведомления',
        key: settings.IS_SHOW_INFO_NOTIFICATIONS,
        type: 'switch',
        value: settings.get(settings.IS_SHOW_INFO_NOTIFICATIONS),
      },
      {
        title: 'Темная тема (БЕТА)',
        key: settings.IS_DARK_THEME,
        type: 'switch',
        value: settings.get(settings.IS_DARK_THEME),
      }
    ],
  }),
  mounted() {
    // Fix passing $vuetify to data
    this.items.find(el => el.key === settings.IS_DARK_THEME).callback = value => {
      this.$vuetify.theme.dark = value
      this.onClickMenuItem(this.items[this.items.length - 1], value)
    }
  },
  methods: {
    onClickMenuItem(item, value) {
      value ? settings.set(item.key, value) : settings.remove(item.key)
    }
  }
}
</script>

<style scoped>

</style>