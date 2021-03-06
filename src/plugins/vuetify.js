import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import settings from "@/plugins/settings";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#761CEA',
                accent: '#4BB462',
                btn__primary: '#761CEA',
            },
            dark: {
                primary: '#1e1e1e',
                accent: '#EE3D48',
                btn__primary: '#1771F1',
                //here you will define primary secondary stuff for dark theme
            }
        },
        dark: settings.get(settings.IS_DARK_THEME)
    }

});
