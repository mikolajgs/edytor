class VectorLayer {
    #type = "vector";
    #zIndex = 210;
    #visible = true;
    #locked = false;

    #id = {
        container: "",
        vector: ""
    }

    #ref = {
        container: null,
        vector: null
    }

    constructor(idContainer, idVector) {
        this.#id.container = idContainer;
        this.#id.vector = idVector;

        this.#ref.container = document.getElementById(this.#id.container);
        if (this.#ref.container == null) {
            alert("div with id='"+this.#id.container+"' not found");
            return;
        }
    }

    SetZIndex(v) {
        this.#zIndex = v;
        if (this.#ref.vector != null) {
            this.#ref.vector.style.zIndex = this.#zIndex;
        }
    }

    Init() {
        this.#ref.vector = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        this.#ref.vector.id = this.#id.vector;
        this.#ref.vector.setAttribute('width', '100%');
        this.#ref.vector.setAttribute('height', '100%');
        this.#ref.vector.classList.add('layer');
        this.#ref.vector.style.margin = 0;
        this.#ref.vector.style.padding = 0;
        this.#ref.vector.style.position = "absolute";
        this.#ref.vector.style.top = 0;
        this.#ref.vector.style.left = 0;
        this.#ref.vector.style.zIndex = this.#zIndex;
        this.#ref.container.appendChild(this.#ref.vector);
    }

    GetSVG() {
        return this.#ref.vector;
    }
}