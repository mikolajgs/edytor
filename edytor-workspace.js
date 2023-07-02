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
        this.style.zIndex = 91;
        this.id = "workspace";

        var container = document.createElement("edytor-workspace-container");
        this.appendChild(container);

        var rulers = document.createElement("edytor-workspace-rulers");
        this.appendChild(rulers);

        this.setSize();
    }

    setSize() {
        var containerMargin = parseInt(this.getAttribute("container-margin"));
        var imageWidth = parseInt(this.getAttribute("image-width"));
        var imageHeight = parseInt(this.getAttribute("image-height"));
        this.style.width = (2 * containerMargin + imageWidth) + 'px';
        this.style.height = (2 * containerMargin + imageHeight) + 'px';

        document.getElementById("edit_info").setSize(imageWidth, imageHeight);

        document.getElementById("workspace_container").setPosition(containerMargin);
        document.getElementById("workspace_container").setSize(imageWidth, imageHeight);

        document.getElementById("workspace_rulers").setPosition(containerMargin, imageWidth, imageHeight);
        document.getElementById("workspace_rulers").setSize(imageWidth, imageHeight);
    }
}

window.customElements.define("edytor-workspace", EdytorWorkspace);
