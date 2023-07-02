class EdytorRulerHorizontal extends HTMLCanvasElement {
    #colors = {
        bg: "#282828",
        ln1: "#dddddd",
        ln2: "#aaaaaa",
        ln3: "#777777"
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.display = "block";
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
        this.style.border = "0";
        this.style.zIndex = 83;
    }

    setSize(w, h) {
        this.width = w;
        this.height = h;
        this.#draw();
    }

    setPosition(l, t) {
        this.style.top = t + "px";
        this.style.left = l + "px";
    }

    #draw() {
        var ctx = this.getContext("2d");
        ctx.fillStyle = this.#colors.bg;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.#colors.ln1;
        ctx.fillStyle = this.#colors.ln1;
        ctx.font = "10px arial";

        var flip = (this.getAttribute("flip") == "true" ? true : false);

        ctx.beginPath();
        if (flip) {
            ctx.moveTo(0, 0);
            ctx.lineTo(this.width, 0);
            ctx.stroke();
        } else {
            ctx.moveTo(0, this.height);
            ctx.lineTo(this.width, this.height);
            ctx.stroke();
        }
        ctx.closePath();

        for (var i = 0; i <= this.width / 10; i++) {
            var val = i * 10;

            if (val % 100 == 0) {
                ctx.strokeStyle = this.#colors.ln1;
            } else if (val % 50 == 0) {
                ctx.strokeStyle = this.#colors.ln2;
            } else {
                ctx.strokeStyle = this.#colors.ln3;
            } 

            ctx.beginPath();
            if (flip) {
                if (val % 100 == 0) {
                    ctx.fillText(val.toString(), val+2, this.height-2);
                    ctx.moveTo(val, 0);
                    ctx.lineTo(val, this.height);
                } else if (val % 50 == 0) {
                    ctx.moveTo(val, 0);
                    ctx.lineTo(val, this.height - 5);
                } else {
                    ctx.moveTo(val, 0);
                    ctx.lineTo(val, this.height - 15);
                }
            } else {
                if (val % 100 == 0) {
                    ctx.fillText(val.toString(), val+2, 10);
                    ctx.moveTo(val, 0);
                    ctx.lineTo(val, this.height);
                } else if (val % 50 == 0) {
                    ctx.moveTo(val, 5);
                    ctx.lineTo(val, this.height);
                } else {
                    ctx.moveTo(val, 15);
                    ctx.lineTo(val, this.height);
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}

window.customElements.define("edytor-ruler-horizontal", EdytorRulerHorizontal, { extends: 'canvas' });
