class EdytorLayerListLayer extends HTMLElement {
    constructor() {
        super();
    }

    __setHidden(h) {
        document.getElementById("layer_hidden_" + this.getAttribute("edytor-layer-id")).classList.remove((h ? 'edytor_toggle_off' : 'edytor_toggle_on'));
        document.getElementById("layer_hidden_" + this.getAttribute("edytor-layer-id")).classList.add((h ? 'edytor_toggle_on' : 'edytor_toggle_off'));
    }

    __setLocked(l) {
        document.getElementById("layer_locked_" + this.getAttribute("edytor-layer-id")).classList.remove((l ? 'edytor_toggle_off' : 'edytor_toggle_on'));
        document.getElementById("layer_locked_" + this.getAttribute("edytor-layer-id")).classList.add((l ? 'edytor_toggle_on' : 'edytor_toggle_off'));
    }

    __tick(b) {
        document.getElementById("layer_tick_" + this.getAttribute("edytor-layer-id")).checked = b;
    }

    __getTick(b) {
        return document.getElementById("layer_tick_" + this.getAttribute("edytor-layer-id")).checked;
    }

    #createButton(t, id) {
        var btn = document.createElement('button');
        btn.className = "edytor_toggle_off edytor_layer_button";
        btn.innerHTML = t;
        if (id !== null) {
            btn.id = "layer_" + id + "_" + this.getAttribute("edytor-layer-id");
        }
        btn.setAttribute('edytor-layer-id', this.getAttribute("edytor-layer-id"));
        return btn;
    }

    connectedCallback() {
        var tick = document.createElement('input');
        tick.type = "checkbox";
        tick.className = "edytor_tick_layer";
        tick.setAttribute('edytor-layer-id', this.getAttribute("edytor-layer-id"));
        tick.id = "layer_tick_" + this.getAttribute("edytor-layer-id");
        tick.addEventListener('click', function (e) {
            document.getElementById("layer_tools").__setTickAll(document.getElementById("layer_list").__getTickAll());
        });
        this.appendChild(tick);

        var typ = document.createElement('label');
        typ.className = "edytor_layer_type";
        typ.textContent = this.getAttribute('edytor-layer-type');
        typ.setAttribute('edytor-layer-id', this.getAttribute("edytor-layer-id"));
        typ.addEventListener('click', function (e) {
            document.getElementById('edytor').__selectLayer(parseInt(this.getAttribute('edytor-layer-id')));
        });
        this.appendChild(typ);

        var nam = document.createElement('input');
        nam.type = "text";
        nam.value = "Layer " + this.getAttribute("edytor-layer-id");
        nam.className = "edytor_layer_name";
        nam.setAttribute('edytor-layer-id', this.getAttribute("edytor-layer-id"));
        this.appendChild(nam);

        var btnLock = this.#createButton('L', 'locked');
        btnLock.addEventListener('click', function (e) {
            document.getElementById('edytor').__toggleLayerLocked(parseInt(this.getAttribute('edytor-layer-id')));
        });
        this.appendChild(btnLock);

        var btnHide = this.#createButton('H', 'hidden');
        btnHide.addEventListener('click', function (e) {
            document.getElementById('edytor').__toggleLayerHidden(parseInt(this.getAttribute('edytor-layer-id')));
        });
        this.appendChild(btnHide);

        var btnMoveUp = this.#createButton('U');
        btnMoveUp.addEventListener('click', function (e) {
            document.getElementById('edytor').__moveLayerUp(parseInt(this.getAttribute('edytor-layer-id')));
        });
        this.appendChild(btnMoveUp);

        var btnMoveDown = this.#createButton('D');
        btnMoveDown.addEventListener('click', function (e) {
            document.getElementById('edytor').__moveLayerDown(parseInt(this.getAttribute('edytor-layer-id')));
        });
        this.appendChild(btnMoveDown);

        var btnDelete = this.#createButton('X');
        btnDelete.addEventListener('click', function (e) {
            document.getElementById('edytor').__deleteLayer(parseInt(this.getAttribute('edytor-layer-id')));
        });
        this.appendChild(btnDelete);
    }
}

window.customElements.define('edytor-layer-list-layer', EdytorLayerListLayer);