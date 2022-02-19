class Grid {
    #colors = { bg: "#282828", ln1: "#555555", ln2: "#444444", ln3: "#333333" }
    #id     = { container: "", grid: "" }
    #ref    = { container: null, grid: null }

    constructor(idContainer, idGrid) {
        this.#id.container = idContainer;
        this.#id.grid = idGrid;

        this.#ref.container = document.getElementById(this.#id.container);
        if (this.#ref.container == null) {
            alert("div with id='"+this.#id.container+"' not found");
            return;
        }
    }

    Init() {
        this.#ref.grid = document.createElement('canvas');
        this.#ref.grid.id = this.#id.grid;
        this.#ref.grid.classList.add('layer');
        this.#ref.container.appendChild(this.#ref.grid);
        this.#resizeToWindow();
        this.#draw();
    }

    #resizeToWindow() {
        var w = window.innerWidth, h = window.innerHeight;
        this.#ref.grid.width = w*2;
        this.#ref.grid.height = h*2;
    }

    #draw() {
        var ctx = this.#ref.grid.getContext("2d");
        ctx.fillStyle = this.#colors.gridBackground;
        ctx.fillRect(0, 0, this.#ref.grid.width, this.#ref.grid.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.#colors.ln2;

        for (var i=0; i<=this.#ref.grid.width/10; i++) {
            var j = i*10;
            ctx.beginPath();
            if (j % 100 == 0) {
                ctx.strokeStyle = this.#colors.ln1;
            } else if (j % 50 == 0) {
                ctx.strokeStyle = this.#colors.ln2;
            } else {
                ctx.strokeStyle = this.#colors.ln3;
            }
            ctx.moveTo(j, 0);
            ctx.lineTo(j, this.#ref.grid.height);
            ctx.stroke();
            ctx.closePath();
        }
        for (var i=0; i<=this.#ref.grid.height/10; i++) {
            var j = i*10;
            ctx.beginPath();
            if (j % 100 == 0) {
                ctx.strokeStyle = this.#colors.ln1;
            } else if (j % 50 == 0) {
                ctx.strokeStyle = this.#colors.ln2;
            } else {
                ctx.strokeStyle = this.#colors.ln3;
            }
            ctx.moveTo(0, j);
            ctx.lineTo(this.#ref.grid.width, j);
            ctx.stroke();
            ctx.closePath();
        }
    }
}