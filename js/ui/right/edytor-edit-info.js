class EdytorEditInfo extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "edit_info"
        this.innerHTML = '<p><label>X:</label> <span id="position_x">0</span><label>Width:</label> <span id="size_width">0</span></p>'
            + '<p><label>Y:</label> <span id="position_y">0</span><label>Height:</label> <span id="size_height">0</span></p>';
    }

    setSize(w, h) {
        document.getElementById("size_width").innerHTML = w.toString();
        document.getElementById("size_height").innerHTML = h.toString();
    }

    setPosition(x, y) {
        document.getElementById("position_x").innerHTML = x.toString();
        document.getElementById("position_y").innerHTML = y.toString();
    }
}

window.customElements.define('edytor-edit-info', EdytorEditInfo);
