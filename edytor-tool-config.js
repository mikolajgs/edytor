class EdytorToolConfig extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.id = "tool_config";
  }
}

window.customElements.define("edytor-tool-config", EdytorToolConfig);
