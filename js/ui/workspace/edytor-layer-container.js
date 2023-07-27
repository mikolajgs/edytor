 class EdytorLayerContainer extends HTMLElement {
    #imageWidth = 0;
    #imageHeight = 0;

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
        this.style.boxSizing = "border-box";
        this.style.width = "100%";
        this.style.border = "0";
        this.id = "layer_container";
    }

    #getZIndexForNewLayer() {
        var zIndex = 201;
        var els = this.querySelectorAll('canvas, svg');
        if (els.length == 0) {
            return zIndex;
        }

        for (var i = 0; i < els.length; i++) {
            if (parseInt(els[i].style.zIndex) > zIndex) {
                zIndex = parseInt(els[i].style.zIndex);
            }
        }
        return zIndex + 1;
    }

    setSize(w, h) {
        this.style.width = w + 'px';
        this.style.height = h + 'px';
        this.#imageWidth = w;
        this.#imageHeight = h;
    }

    addVectorLayer(num) {
        var v = document.createElementNS("http://www.w3.org/2000/svg", 'svg', { is: 'edytor-layer-vector' });
        v.id = "layer_" + num;
        v.style.zIndex = this.#getZIndexForNewLayer();
        v.setAttribute('width', '100%');
        v.setAttribute('height', '100%');
        v.classList.add('edytor_layer');
        v.style.margin = 0;
        v.style.padding = 0;
        v.style.position = "absolute";
        v.style.top = 0;
        v.style.left = 0;
        this.appendChild(v);
    }

    addPixelLayer(num) {
        var p = document.createElement('canvas', { is: "edytor-layer-pixel" });
        p.id = "layer_" + num;
        p.style.zIndex = this.#getZIndexForNewLayer();
        p.width = this.#imageWidth;
        p.height = this.#imageHeight;
        this.appendChild(p);
    }

    toggleLayerHidden(num) {
        var d = document.getElementById('layer_' + num);
        if (d.style.display == 'none') {
            d.style.display = '';
            return false;
        } else {
            d.style.display = 'none';
            return true;
        }
    }

    toggleLayerLocked(num) {
        var d = document.getElementById('layer_' + num);
        if (d.getAttribute("locked") == "true") {
            d.setAttribute("locked", "false");
            return false;
        } else {
            d.setAttribute("locked", "true");
            return true;
        }
    }

    setLayerHidden(num, h) {
        document.getElementById('layer_' + num).style.display = (h ? 'none' : '');
    }

    setLayerLocked(num, l) {
        document.getElementById('layer_' + num).setAttribute("locked", (l ? "true" : "false"));
    }

    deleteLayer(num) {
        var l = document.getElementById('layer_' + num);
        if (l != null) {
            l.remove();
        }
    }

    scaleLayer(num, w, h) {
        var l = document.getElementById('layer_' + num);
        if (l != null) {
            l.scale(w, h);
        }
    }

    extendLayerSide(num, side, val) {
        var l = document.getElementById('layer_' + num);
        if (l != null) {
            l.extendSide(side, val);
        }
    }

    shrinkLayerSide(num, side, val) {
        var l = document.getElementById('layer_' + num);
        if (l != null) {
            l.shrinkSide(side, val);
        }
    }

    getLayerLocked(num) {
        return (document.getElementById('layer_' + num).getAttribute("locked") === "true" ? true : false);
    }

    getLayerHidden(num) {
        return (document.getElementById('layer_' + num).style.display === 'none' ? true : false);
    }

    swapLayers(num1, num2) {
        if (num1 == num2) {
            return;
        }

        var layer1 = document.getElementById("layer_" + num1);
        var layer2 = document.getElementById("layer_" + num2);

        var z = layer1.style.zIndex;
        layer1.style.zIndex = layer2.style.zIndex;
        layer2.style.zIndex = z;
    }

    getColourFromXY(num, x, y) {
        var l = document.getElementById('layer_' + num);
        if (l != null) {
            var c = l.getColourFromXY(x, y);
            if (c != "") {
                return c;
            }
            return "";
        }
        return "";
    }
}

window.customElements.define("edytor-layer-container", EdytorLayerContainer);
