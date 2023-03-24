class EdytorWorkspace extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.display = "block";
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
        this.style.border = "0";
        this.id = "workspace";

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.width = (window.innerWidth * 2 + 1000) + 'px';
        this.style.height = (window.innerHeight * 2 + 1000) + 'px';
    }
}

window.customElements.define("edytor-workspace", EdytorWorkspace);
