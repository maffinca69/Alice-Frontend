const IS_SHOW_INFO_NOTIFICATIONS = 'is_show_info_notifications';
const IS_DARK_THEME = 'is_dark_theme';

export default {
    IS_SHOW_INFO_NOTIFICATIONS,
    IS_DARK_THEME,
    set(key, value) {
        return localStorage.setItem(key, value)
    },
    remove(key) {
        return localStorage.removeItem(key)
    },
    get(key) {
        return localStorage.getItem(key)
    },
    isShowInfoNotifications() {
        return eval(localStorage.getItem(IS_SHOW_INFO_NOTIFICATIONS))
    }
}