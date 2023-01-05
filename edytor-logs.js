class EdytorLogs extends HTMLTextAreaElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "logs";
        this.className = "edytor_logs";

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.width = (window.innerWidth - 6) + 'px';
    }
}

window.customElements.define("edytor-logs", EdytorLogs, { extends: 'textarea' });