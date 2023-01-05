class EdytorLayerList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "layer_list"
    }

    #el_layer(num) {
        return document.getElementById("layer_list_layer_" + num);
    }

    __tickAllLayers(b) {
        var els = this.querySelectorAll('edytor-layer-list-layer');
        for (var i = 0; i < els.length; i++) {
            els[i].__tick(b);
        }
    }

    __getTickAll() {
        var els = this.querySelectorAll('edytor-layer-list-layer');
        if (els.length == 0) {
            return false;
        }
        for (var i = 0; i < els.length; i++) {
            if (!els[i].__getTick()) {
                return false;
            }
        }
        return true;
    }

    __getSelectedLayers() {
        var ls = [];
        var els = this.querySelectorAll('edytor-layer-list-layer');
        for (var i = 0; i < els.length; i++) {
            if (els[i].__getTick()) {
                ls.push(els[i].getAttribute("edytor-layer-id"));
            }
        }
        return ls;
    }

    __addVectorLayer(num) {
        this.#addLayer('V', num);
    }

    __addPixelLayer(num) {
        this.#addLayer('P', num);
    }

    __setLayerHidden(num, h) {
        this.#el_layer(num).__setHidden(h);
    }

    __setLayerLocked(num, l) {
        this.#el_layer(num).__setLocked(l);
    }

    __deleteLayer(num) {
        this.#el_layer(num).remove();
    }

    __moveLayerUp(num) {

    }

    __moveLayerDown(num) {

    }

    #addLayer(t, num) {
        var listItem = document.createElement('edytor-layer-list-layer');
        listItem.id = "layer_list_layer_" + num;
        listItem.setAttribute("edytor-layer-id", num.toString());
        listItem.setAttribute("edytor-layer-type", t);
        this.prepend(listItem);
    }
}

window.customElements.define('edytor-layer-list', EdytorLayerList);
