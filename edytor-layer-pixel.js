class PixelLayer {
    #type = "pixel";
    #zIndex = 210;
    #visible = true;
    #locked = false;

    #id = {
        container: "",
        pixel: ""
    }

    #ref = {
        container: null,
        pixel: null
    }

    constructor(idContainer, idPixel) {
        this.#id.container = idContainer;
        this.#id.pixel = idPixel;

        this.#ref.container = document.getElementById(this.#id.container);
        if (this.#ref.container == null) {
            alert("div with id='"+this.#id.container+"' not found");
            return;
        }
    }

    #resizeToWindow() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.pixel.width = w*2;
        this.#ref.pixel.height = h*2;
    }

    SetZIndex(v) {
        this.#zIndex = v;
        if (this.#ref.pixel != null) {
            this.#ref.pixel.style.zIndex = this.#zIndex;
        }
    }

    GetZIndex() {
        return this.#zIndex;
    }

    Init() {
        this.#ref.pixel = document.createElement('canvas');
        this.#ref.pixel.id = this.#id.pixel;
        this.#ref.pixel.classList.add('layer');
        this.#ref.pixel.style.margin = 0;
        this.#ref.pixel.style.padding = 0;
        this.#ref.pixel.style.position = "absolute";
        this.#ref.pixel.style.top = 0;
        this.#ref.pixel.style.left = 0;
        this.#ref.pixel.style.zIndex = this.#zIndex;
        this.#ref.container.appendChild(this.#ref.pixel);
        this.#resizeToWindow();
    }

    GetCanvas() {
        return this.#ref.pixel;
    }
}