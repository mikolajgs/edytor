class EdytorGrid extends HTMLCanvasElement {
    #colors = {
        bg: "#282828",
        ln1: "#555555",
        ln2: "#444444",
        ln3: "#333333"
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "grid_layer";
        this.zIndex = 101;
        this.classList.add('layer');
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
            self.#draw();
        });

        this.#setSize();
        this.#draw();
    }

    #setSize() {
        this.width = window.innerWidth * 2;
        this.height = window.innerHeight * 2;
    }

    #draw() {
        var ctx = this.getContext("2d");
        ctx.fillStyle = this.#colors.gridBackground;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.#colors.ln2;

        for (var i = 0; i <= this.width / 10; i++) {
            var j = i * 10;
            ctx.beginPath();
            if (j % 100 == 0) {
                ctx.strokeStyle = this.#colors.ln1;
            } else if (j % 50 == 0) {
                ctx.strokeStyle = this.#colors.ln2;
            } else {
                ctx.strokeStyle = this.#colors.ln3;
            }
            ctx.moveTo(j, 0);
            ctx.lineTo(j, this.height);
            ctx.stroke();
            ctx.closePath();
        }
        for (var i = 0; i <= this.height / 10; i++) {
            var j = i * 10;
            ctx.beginPath();
            if (j % 100 == 0) {
                ctx.strokeStyle = this.#colors.ln1;
            } else if (j % 50 == 0) {
                ctx.strokeStyle = this.#colors.ln2;
            } else {
                ctx.strokeStyle = this.#colors.ln3;
            }
            ctx.moveTo(0, j);
            ctx.lineTo(this.width, j);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

window.customElements.define("edytor-grid", EdytorGrid, { extends: 'canvas' });