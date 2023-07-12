class EdytorLayerList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "layer_list"
    }

    #addLayer(t, num) {
        var listItem = document.createElement('edytor-layer-list-layer');
        listItem.id = "layer_list_layer_" + num;
        listItem.setAttribute("edytor-layer-id", num.toString());
        listItem.setAttribute("edytor-layer-type", t);
        this.prepend(listItem);
    }

    tickAllLayers(b) {
        var els = this.querySelectorAll('edytor-layer-list-layer');
        for (var i = 0; i < els.length; i++) {
            els[i].tick(b);
        }
    }

    getTickAll() {
        var els = this.querySelectorAll('edytor-layer-list-layer');
        if (els.length == 0) {
            return false;
        }
        for (var i = 0; i < els.length; i++) {
            if (!els[i].getTick()) {
                return false;
            }
        }
        return true;
    }

    getTickedLayers() {
        var ls = [];
        var els = this.querySelectorAll('edytor-layer-list-layer');
        for (var i = 0; i < els.length; i++) {
            if (els[i].getTick()) {
                ls.push(els[i].getAttribute("edytor-layer-id"));
            }
        }
        return ls;
    }

    addVectorLayer(num) {
        this.#addLayer('V', num);
    }

    addPixelLayer(num) {
        this.#addLayer('P', num);
    }

    setLayerHidden(num, h) {
        document.getElementById("layer_list_layer_" + num).setHidden(h);
    }

    setLayerLocked(num, l) {
        document.getElementById("layer_list_layer_" + num).setLocked(l);
    }

    deleteLayer(num) {
        var l = document.getElementById("layer_list_layer_" + num);
        if (l != null) {
            l.remove();
        }
    }

    moveLayerUp(num) {
        var els = this.querySelectorAll('edytor-layer-list-layer');
        for (var i = 0; i < els.length; i++) {
            if (els[i].getAttribute("edytor-layer-id") == num.toString()) {
                if (i > 0) {
                    els[i - 1].before(els[i]);
                    return parseInt(els[i - 1].getAttribute("edytor-layer-id"));
                }
                if (i == 0) {
                    return num;
                }
                return;
            }
        }
    }

    moveLayerDown(num) {
        var els = this.querySelectorAll('edytor-layer-list-layer');
        for (var i = 0; i < els.length; i++) {
            if (els[i].getAttribute("edytor-layer-id") == num.toString()) {
                if (i < els.length - 1) {
                    els[i + 1].after(els[i]);
                    return parseInt(els[i + 1].getAttribute("edytor-layer-id"));
                }
                if (i == els.length - 1) {
                    return num;
                }
                return;
            }
        }
    }

    selectLayer(num) {
        var els = this.querySelectorAll('edytor-layer-list-layer');
        for (var i = 0; i < els.length; i++) {
            if (els[i].getAttribute("edytor-layer-id") == num.toString()) {
                els[i].classList.add("edytor_sidebar_layer_selected");
            } else {
                els[i].classList.remove("edytor_sidebar_layer_selected");
            }
        }
    }
}

window.customElements.define('edytor-layer-list', EdytorLayerList);
