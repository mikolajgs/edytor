class EdytorLayerListLayer extends HTMLElement {
    constructor() {
        super();
    }

    #createButton(className, id) {
        var btn = document.createElement('button');
        btn.className = "edytor_toggle_off edytor_layer_button";
        btn.innerHTML = '<i class="fa-solid ' + className + '"></i>';
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
            document.getElementById("layer_tools").setTickAll(
                document.getElementById("layer_list").getTickAll()
            );
        });
        this.appendChild(tick);

        var typ = document.createElement('label');
        typ.className = "edytor_layer_type";
        if (this.getAttribute('edytor-layer-type') == 'V') {
            typ.innerHTML = '<i class="fa-solid fa-draw-polygon"></i>';
        } else {
            typ.innerHTML = '<i class="fa-solid fa-paintbrush"></i>';
        }
        
        typ.setAttribute('edytor-layer-id', this.getAttribute("edytor-layer-id"));
        typ.addEventListener('click', function (e) {
            document.getElementById('edytor').selectLayer(
                parseInt(this.getAttribute('edytor-layer-id'))
            );
        });
        this.appendChild(typ);

        var nam = document.createElement('input');
        nam.type = "text";
        nam.value = "Layer " + this.getAttribute("edytor-layer-id");
        nam.className = "edytor_layer_name";
        nam.setAttribute('edytor-layer-id', this.getAttribute("edytor-layer-id"));
        this.appendChild(nam);

        var btnLock = this.#createButton('fa-lock', 'locked');
        btnLock.addEventListener('click', function (e) {
            document.getElementById('edytor').toggleLayerLocked(
                parseInt(this.getAttribute('edytor-layer-id'))
            );
        });
        this.appendChild(btnLock);

        var btnHide = this.#createButton('fa-eye-slash', 'hidden');
        btnHide.addEventListener('click', function (e) {
            document.getElementById('edytor').toggleLayerHidden(
                parseInt(this.getAttribute('edytor-layer-id'))
            );
        });
        this.appendChild(btnHide);

        var btnMoveUp = this.#createButton('fa-arrow-up', 'moveup');
        btnMoveUp.addEventListener('click', function (e) {
            document.getElementById('edytor').moveLayerUp(
                parseInt(this.getAttribute('edytor-layer-id'))
            );
        });
        this.appendChild(btnMoveUp);

        var btnMoveDown = this.#createButton('fa-arrow-down', 'movedown');
        btnMoveDown.addEventListener('click', function (e) {
            document.getElementById('edytor').moveLayerDown(
                parseInt(this.getAttribute('edytor-layer-id'))
            );
        });
        this.appendChild(btnMoveDown);

        var btnDelete = this.#createButton('fa-trash', 'delete');
        btnDelete.addEventListener('click', function (e) {
            document.getElementById('edytor').deleteLayer(
                parseInt(this.getAttribute('edytor-layer-id'))
            );
        });
        this.appendChild(btnDelete);
    }

    setHidden(h) {
        var layerHidden = document.getElementById("layer_hidden_" + this.getAttribute("edytor-layer-id"));
        layerHidden.classList.remove((h ? 'edytor_toggle_off' : 'edytor_toggle_on'));
        layerHidden.classList.add((h ? 'edytor_toggle_on' : 'edytor_toggle_off'));
    }

    setLocked(l) {
        var layerLocked = document.getElementById("layer_locked_" + this.getAttribute("edytor-layer-id"));
        layerLocked.classList.remove((l ? 'edytor_toggle_off' : 'edytor_toggle_on'));
        layerLocked.classList.add((l ? 'edytor_toggle_on' : 'edytor_toggle_off'));
    }

    tick(b) {
        document.getElementById("layer_tick_" + this.getAttribute("edytor-layer-id")).checked = b;
    }

    getTick(b) {
        return document.getElementById("layer_tick_" + this.getAttribute("edytor-layer-id")).checked;
    }
}

window.customElements.define('edytor-layer-list-layer', EdytorLayerListLayer);