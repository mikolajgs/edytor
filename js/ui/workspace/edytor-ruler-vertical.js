class EdytorRulerVertical extends HTMLCanvasElement {
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
            ctx.lineTo(0, this.height);
            ctx.stroke();
        } else {
            ctx.moveTo(this.width, 0);
            ctx.lineTo(this.width, this.height);
            ctx.stroke();
        }
        ctx.closePath();

        for (var i = 0; i <= this.height / 10; i++) {
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
                    ctx.textAlign = "right";
                    ctx.fillText(val.toString(), this.width-2, val+12);
                    ctx.moveTo(0, val);
                    ctx.lineTo(this.width, val);
                } else if (val % 50 == 0) {
                    ctx.moveTo(0, val);
                    ctx.lineTo(this.width - 5, val);
                } else {
                    ctx.moveTo(0, val);
                    ctx.lineTo(this.width - 15, val);
                }
            } else {
                if (val % 100 == 0) {
                    ctx.textAlign = "left";
                    ctx.fillText(val.toString(), 2, val+12);
                    ctx.moveTo(0, val);
                    ctx.lineTo(this.width, val);
                } else if (val % 50 == 0) {
                    ctx.moveTo(5, val);
                    ctx.lineTo(this.width, val);
                } else {
                    ctx.moveTo(15, val);
                    ctx.lineTo(this.width, val);
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}

window.customElements.define("edytor-ruler-vertical", EdytorRulerVertical, { extends: 'canvas' });
