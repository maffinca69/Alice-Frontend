export default value => {
    switch (typeof value) {
        case 'number':
            return value === 0;
        case 'string':
            return value === '';
        case 'object':
            if (value === null) return true;
            return (Array.isArray(value) ? value.length : Object.keys(value).length) === 0;
        case 'undefined':
        default:
            return true;
    }
}
