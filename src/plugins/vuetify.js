import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#761CEA',
                accent: '#4BB462'
            },
            dark: {
                primary: '#1e1e1e',
                accent: '#EE3D48'
                //here you will define primary secondary stuff for dark theme
            }
        },
        dark: false
    }

});
