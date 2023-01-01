class EdytorFill extends EdytorProperties {
  constructor() {
    super();
  }

  connectedCallback() {
    super._addProperty("fill", "Opacity", "opacity", "100%", null);
    super._addProperty("fill", "Rule", "rule", "", {
      "nonzero": "nonzero",
      "evenodd": "evenodd",
      "inherit": "inherit"
    });
  }
}

window.customElements.define('edytor-fill', EdytorFill);
