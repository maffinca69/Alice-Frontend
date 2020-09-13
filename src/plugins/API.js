import axios from "axios";

const axiosConfig = {
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : process.env.VUE_APP_API_URL,
    timeout: 10000,
};

let api = axios.create(axiosConfig)

export default {
    fetchGet(date) {
        return api.get('/list?date=' + date)
    },
    fetchUpdate(item) {
        return api.put('/update', item)
    },
    fetchCreate(item) {
        return api.post('/create', item)
    },
    fetchDelete(id) {
        return api.delete('/delete?id=' + id)
    },
}