class EdytorPixelLayer extends HTMLCanvasElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('edytor_layer');
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
    }

    scale(w, h) {
        var img = new Image();
        img.src = this.toDataURL("image/png");
        var self = this;
        img.onload = function () {
            self.width = w;
            self.height = h;
            self.getContext('2d').drawImage(img, 0, 0, w, h);
        }
    }

    extendSide(side, val) {
        var img = new Image();
        img.src = this.toDataURL("image/png");
        var self = this;
        img.onload = function () {
            if (side == "left" || side == "right") {
                self.width = self.width + val;
            } else if (side == "top" || side == "bottom") {
                self.height = self.height + val;
            }
            self.getContext('2d').drawImage(
                img,
                (side == "left" ? val : 0),
                (side == "top" ? val : 0)
            );
        }
    }

    shrinkSide(side, val) {
        var shrink = true;
        if ((side == "left" || side == "right") && val > this.width) {
            shrink = false;
        }
        if ((side == "top" || side == "bottom") && val > this.height) {
            shrink = false;
        }
        if (shrink) {
            var img = new Image();
            img.src = this.toDataURL("image/png");
            var self = this;
            img.onload = function () {
                var w = self.width;
                var h = self.height;
                if (side == "left" || side == "right") {
                    self.width = self.width - val;
                } else if (side == "top" || side == "bottom") {
                    self.height = self.height - val;
                }
                self.getContext('2d').drawImage(
                    img,
                    (side == "left" ? val : 0),
                    (side == "top" ? val : 0),
                    self.width,
                    self.height,
                    0,
                    0,
                    self.width,
                    self.height
                );
            }
        }
    }

    getColourFromXY(x, y) {
        var c = this.getContext('2d').getImageData(x, y, 1, 1).data;
        if (c[3] > 0) {
            return "#" + c[0].toString(16)
                       + c[1].toString(16)
                       + c[2].toString(16);
        }
        return "";
    }
}

window.customElements.define("edytor-layer-pixel", EdytorPixelLayer, { extends: 'canvas' });
