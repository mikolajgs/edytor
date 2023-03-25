class EdytorWorkspace extends HTMLElement {
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
        this.style.border = "0";
        this.id = "workspace";

        var container = document.createElement("edytor-workspace-container");
        this.appendChild(container);

        this.SetSize();
    }

    SetSize() {
        var containerMargin = parseInt(this.getAttribute("container-margin"));
        var imageWidth = parseInt(this.getAttribute("image-width"));
        var imageHeight = parseInt(this.getAttribute("image-height"));
        this.style.width = (2 * containerMargin + imageWidth) + 'px';
        this.style.height = (2 * containerMargin + imageHeight) + 'px';

        document.getElementById("workspace_container").SetPosition(containerMargin);
        document.getElementById("workspace_container").SetSize(imageWidth, imageHeight);
    }
}

window.customElements.define("edytor-workspace", EdytorWorkspace);
