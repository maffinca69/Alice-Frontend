export default {
    trimmedText(text, length = 200) {
        return text.length > length ? text.substring(0, length) + "..." : text
    },
}
