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
    handleError(error) {
        if (!error.response) {
            return this.self.$root.$emit('notify',
                'Неизвестная ошибка ' + error.statusCode, 'error', 3000)
        }
        this.self.$root.$emit('notify', error.response.data.message, 'error', 3000)
    }
}