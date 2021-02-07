import axios from "axios";

const axiosConfig = {
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : process.env.VUE_APP_API_URL,
    timeout: 10000,
};

let api = axios.create(axiosConfig)

export default {
    init(self) {
        this.self = self
    },
    fetchInfo(date) {
        return api.get('/info?date=' + date).catch(error => {
            this.handleError(error)
        })
    },
    fetchUpdateInfo(item) {
        return api.put('/info/update', item).catch(error => {
            this.handleError(error)
        })
    },
    fetchCreateInfo(item) {
        return api.post('/info/create', item).catch(error => {
            this.handleError(error)
        })
    },
    fetchGet(date) {
        return api.get('/list?date=' + date).catch(error => {
            this.handleError(error)
        })
    },
    fetchUpdate(item) {
        return api.put('/update', item).catch(error => {
            this.handleError(error)
        })
    },
    fetchCreate(item) {
        return api.post('/create', item).catch(error => {
            this.handleError(error)
        })
    },
    fetchDelete(id) {
        return api.delete('/delete?id=' + id).catch(error => {
            this.handleError(error)
        })
    },
    fetchCopySchedule(data) {
        return api.post('/copy-schedule', data).catch(error => {
            this.handleError(error)
        })
    },
    fetchClearDay(date, type) {
        return api.delete('/clear-day?date=' + date + '&type=' + type).catch(error => {
            this.handleError(error)
        })
    },
    handleError(error) {
        if (!error.response) {
            return this.self.$root.$emit('notify',
                'Неизвестная ошибка', 'error', 3000)
        }
        this.self.$root.$emit('notify', error.response.data.message, 'error', 3000)
    }
}