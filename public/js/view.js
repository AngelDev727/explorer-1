export default class {
    constructor() {}
    setTitle(title) {
        if (title)
            title += ' - Breeze Block Explorer'
        else
            title = 'Breeze Block Explorer'
        document.title = title
    }
    setHtml() { return "" }
    init() {}
}
