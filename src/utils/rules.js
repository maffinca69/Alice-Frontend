import isEmpty from './isEmpty';

export default {
    required: value => isEmpty(value) ? 'Это обязательное поле для заполнения' : true,
    minLength: length => value => !value || value.length < length ? 'Минимум из ' + length + ' символов' : true,
    maxLength: length => v => (v || '' ).length > length ? 'Максиумм из ' + length + ' символов' : true,
}
