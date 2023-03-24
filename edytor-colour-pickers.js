class EdytorColourPickers extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    [
      { name: 'fg', defaultColor: '#ffffff' },
      { name: 'bg', defaultColor: '#ff0000' }
    ].forEach(t => {
      var i = document.createElement('input');
      i.type = "color";
      i.id = "colour_picker_" + t.name;
      i.value = t.defaultColor;
      i.addEventListener('input', (e) => {
        document.getElementById('edytor').__selectColour(t.name, e.target.value);
      });
      i.addEventListener('change', (e) => {
        document.getElementById('edytor').__selectColour(t.name, e.target.value);
      });
      this.appendChild(i);

      document.getElementById('edytor').__selectColour(t.name, i.value);
    });
    var btn = document.createElement('button');
    btn.innerHTML = 'Swap';
    btn.addEventListener('click', (e) => {
      var bgColor = document.getElementById('colour_picker_bg').value;
      var fgColor = document.getElementById('colour_picker_fg').value;
      document.getElementById('colour_picker_fg').value = bgColor;
      document.getElementById('edytor').__selectColour("fg", bgColor);
      document.getElementById('colour_picker_bg').value = fgColor;
      document.getElementById('edytor').__selectColour("bg", fgColor);
    });
    this.appendChild(btn);
  }
}

window.customElements.define('edytor-colour-pickers', EdytorColourPickers);
