class EdytorLayerContainer extends HTMLElement {
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

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.width = (window.innerWidth * 2) + 'px';
        this.style.height = (window.innerHeight * 2) + 'px';
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

    __addVectorLayer(num) {
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

    __addPixelLayer(num) {
        var p = document.createElement('canvas', { is: "edytor-layer-pixel" });
        p.id = "layer_" + num;
        p.style.zIndex = this.#getZIndexForNewLayer();
        this.appendChild(p);
    }

    __toggleLayerHidden(num) {
        var d = document.getElementById('layer_' + num);
        if (d.style.display == 'none') {
            d.style.display = '';
            return false;
        } else {
            d.style.display = 'none';
            return true;
        }
    }

    __toggleLayerLocked(num) {
        var d = document.getElementById('layer_' + num);
        if (d.getAttribute("locked") == "true") {
            d.setAttribute("locked", "false");
            return false;
        } else {
            d.setAttribute("locked", "true");
            return true;
        }
    }

    __setLayerHidden(num, h) {
        document.getElementById('layer_' + num).style.display = (h ? 'none' : '');
    }

    __setLayerLocked(num, l) {
        document.getElementById('layer_' + num).setAttribute("locked", (l ? "true" : "false"));
    }

    __deleteLayer(num) {
        document.getElementById('layer_' + num).remove();
    }

    __getLayerLocked(num) {
        return (document.getElementById('layer_' + num).getAttribute("locked") === "true" ? true : false);
    }

    __getLayerHidden(num) {
        return (document.getElementById('layer_' + num).style.display === 'none' ? true : false);
    }

    __swapLayers(num1, num2) {
        if (num1 == num2) {
            return;
        }
        var z = document.getElementById("layer_" + num1).style.zIndex;
        document.getElementById("layer_" + num1).style.zIndex = document.getElementById("layer_" + num2).style.zIndex;
        document.getElementById("layer_" + num2).style.zIndex = z;
    }
}

window.customElements.define("edytor-layer-container", EdytorLayerContainer);
