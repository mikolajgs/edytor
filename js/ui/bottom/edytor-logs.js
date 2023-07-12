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
        this.value = '';
    }

    #setSize() {
        this.style.width = (window.innerWidth - 6) + 'px';
    }

    addError(e) {
        this.value = "❗" + e + "\n" + this.value;
    }
}

window.customElements.define("edytor-logs", EdytorLogs, { extends: 'textarea' });