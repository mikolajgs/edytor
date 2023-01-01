class Edytor extends HTMLElement {
    // do we need those?
    #cfg = null;
    #layout = null

    // Tools
    #toolNames = [];
    #tool = "";

    // Colours
    #colourFgNames = [];
    #colourBgNames = [];
    #colourFg = "white";
    #colourBg = "black";


    constructor() {
        super();
        // do we need config since we started hardcoding ids and zindexes in the classes?
        this.#cfg = new EdytorConfig();
        var scope = this;
        // do we need layout at all?
        this.#layout = new EdytorLayout(
            function (n) {
                return scope.#cfg.GetID(n);
            },
            function (cmd, arg1) {
                return scope.Do(cmd, arg1);
            }
        );
    }

    __initTool(s) {
        this.#toolNames.push(s);
    }

    __initColour(t, n) {
        if (t == "bg") {
            this.#colourBgNames.push(n);
        } else {
            this.#colourFgNames.push(n);
        }
    }

    __getCurrentTool() {
        return document.getElementById('tool_' + this.#tool);
    }

    __getCurrentLayer() {
        if (this.#layer === null)
            return null;
        return this.#layer;
    }

    __getStyle(s) {
        // TODO: Taken the styles from the stroke and fill objects
    }

    __getPadCanvas() {
        return document.getElementById('pad_layer').getCanvas();
    }

    __centerScroll() {
        window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);
    }

    __setCurrentTool(s) {
        this.#tool = s;
        for (var i = 0; i < this.#toolNames.length; i++) {
            if (this.#toolNames[i] != s) {
                document.getElementById('tool_' + this.#toolNames[i]).__toggleOff();
            } else {
                document.getElementById('tool_' + this.#toolNames[i]).__toggleOn();
            }
        }
    }

    __setCurrentColour(type, s) {
        if (type == "bg") {
            this.#colourBg = s;
            for (var i = 0; i < this.#colourBgNames.length; i++) {
                if (this.#colourBgNames[i] != s) {
                    document.getElementById('colour_bg_' + this.#colourBgNames[i]).__toggleOff();
                } else {
                    document.getElementById('colour_bg_' + this.#colourBgNames[i]).__toggleOn();
                }
            }
        } else {
            this.#colourFg = s;
            for (var i = 0; i < this.#colourFgNames.length; i++) {
                if (this.#colourFgNames[i] != s) {
                    document.getElementById('colour_fg_' + this.#colourFgNames[i]).__toggleOff();
                } else {
                    document.getElementById('colour_fg_' + this.#colourFgNames[i]).__toggleOn();
                }
            }
        }
    }

    connectedCallback() {
        var scope = this;

        this.id = 'edytor';
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "relative";

        /*var toolNames = this.#initTools();

        this.#layout.InitSidebars(
            this.#cfg.GetZIndex('sidebarLeft'), 
            this.#cfg.GetZIndex('sidebarRight'), 
            function (n) {
                return scope.#tools[n].Icon;
        }, toolNames, this.#cfg.GetColors());*/
    }




    #pad = null;

    #tools = {}

    // TODO: Remove below
    #colorFg = "dupa";
    #colorBg = "dupa";

    #mouseDown = false;

    #layersOrder = [];
    #layers = {};
    #layer = null;
    #layerNum = 0;
    #lastLayerNum = 0;

    Do(cmd, arg1) {
        switch (cmd) {
            case 'add-vector-layer': return this.AddVectorLayer();
            case 'add-pixel-layer': return this.AddPixelLayer();
            case 'delete-layers': return this.DeleteLayers(arg1);
            case 'select-layer': return this.SelectLayer(arg1);
            case 'deselect-layer': return this.DeleteLayers();
            case 'move-layer-up': return this.MoveLayerUp(arg1);
            case 'move-layer-down': return this.MoveLayerDown(arg1);
            case 'toggle-layers-lock': return this.ToggleLayersLock(arg1);
            case 'toggle-layers-hide': return this.ToggleLayersHide(arg1);
            case 'set-tool': return this.SetTool(arg1);
            case 'set-fg-color': return this.SetFgColor(arg1);
            case 'set-bg-color': return this.SetBgColor(arg1);
            case 'get-style': return this.GetStyle(arg1);
        }
        return false;
    }


    AddVectorLayer() {
        this.#lastLayerNum++;
        var l = new VectorLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('vectorPrefix') + this.#lastLayerNum);
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init(this.#lastLayerNum);
        this.#layersOrder.push(this.#lastLayerNum);
        this.#layers[this.#lastLayerNum] = l;

        this.#layout.AddVectorLayer(this.#lastLayerNum);
    }
    AddPixelLayer() {
        this.#lastLayerNum++;
        var l = new PixelLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pixelPrefix') + this.#lastLayerNum);
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init(this.#lastLayerNum);
        this.#layersOrder.push(this.#lastLayerNum);
        this.#layers[this.#lastLayerNum] = l;

        this.#layout.AddPixelLayer(this.#lastLayerNum);
    }

    DeleteLayers(numList) {
        for (var j = 0; j < numList.length; j++) {
            if (this.#layers[numList[j]] !== null) {
                this.#layers[numList[j]].Delete();
                delete this.#layers[numList[j]];
            }
        }
        // TODO: Refactor me
        var newLayersOrder = [];
        for (var i = 0; i < this.#layersOrder.length; i++) {
            var f = false;
            for (var j = 0; j < numList.length; j++) {
                if (this.#layersOrder[i] == numList[j]) {
                    f = true;
                }
            }
            if (!f) {
                newLayersOrder.push(this.#layersOrder[i]);
            }
        }
        this.#layersOrder = newLayersOrder;
        this.#layout.DeleteLayers(numList);
    }

    SelectLayer(num) {
        if (this.#layers[num] !== null) {
            this.#layer = this.#layers[num];
            this.#layerNum = num;
            this.#layout.SelectLayer(num);
        }
    }

    DeselectLayer() {
        this.#layer = null;
        this.#layerNum = 0;
        this.#layout.SelectLayer(-1);
    }

    MoveLayerDown(num) {
        for (var i = 0; i < this.#layersOrder.length; i++) {
            if (this.#layersOrder[i] == num) {
                if (i == 0)
                    return;
                var curZIndex = this.#layers[this.#layersOrder[i]].GetZIndex();
                this.#layers[this.#layersOrder[i]].SetZIndex(this.#layers[this.#layersOrder[i - 1]].GetZIndex());
                this.#layers[this.#layersOrder[i - 1]].SetZIndex(curZIndex);
                this.#layersOrder[i] = this.#layersOrder[i - 1];
                this.#layersOrder[i - 1] = num;
                this.#layout.MoveLayerDown(num);
                return;
            }
        }
    }

    MoveLayerUp(num) {
        for (var i = 0; i < this.#layersOrder.length; i++) {
            if (this.#layersOrder[i] == num) {
                if (i == this.#layersOrder.length - 1)
                    return;
                var curZIndex = this.#layers[this.#layersOrder[i]].GetZIndex();
                this.#layers[this.#layersOrder[i]].SetZIndex(this.#layers[this.#layersOrder[i + 1]].GetZIndex());
                this.#layers[this.#layersOrder[i + 1]].SetZIndex(curZIndex);
                this.#layersOrder[i] = this.#layersOrder[i + 1];
                this.#layersOrder[i + 1] = num;
                this.#layout.MoveLayerUp(num);
                return;
            }
        }
    }

    ToggleLayersHide(numList) {
        var newValue = null;
        for (var j = 0; j < numList.length; j++) {
            if (this.#layers[numList[j]] !== null) {
                if (newValue === null) {
                    this.#layers[numList[j]].ToggleHidden();
                    newValue = this.#layers[numList[j]].Hidden;
                } else {
                    if (this.#layers[numList[j]].Hidden != newValue) {
                        this.#layers[numList[j]].ToggleHidden();
                    }
                }
                this.#layout.SetLayerHidden(numList[j], newValue);
            }
        }
    }

    ToggleLayersLock(numList) {
        var newValue = null;
        for (var j = 0; j < numList.length; j++) {
            if (this.#layers[numList[j]] !== null) {
                if (newValue === null) {
                    this.#layers[numList[j]].ToggleLocked();
                    newValue = this.#layers[numList[j]].Locked;
                } else {
                    if (this.#layers[numList[j]].Locked != newValue) {
                        this.#layers[numList[j]].ToggleLocked()
                    }
                }
                this.#layout.SetLayerLocked(numList[j], newValue);
            }
        }
    }

    SetTool(name) {
        this.#tool = name;
        if (this.#tools[name].RequiresPad) {
            this.#pad.Show();
        } else {
            this.#pad.Hide();
        }
    }

    SetFgColor(name) {
        this.#colorFg = name;
    }

    SetBgColor(name) {
        this.#colorBg = name;
    }

    GetStyle(s) {
        switch (s) {
            case 'color-fg': return this.#colorFg;
            case 'color-bg': return this.#colorBg;
            case 'stroke-opacity': return document.getElementById(this.#cfg.GetID("styleStrokeOpacity")).value;
            case 'stroke-width': return document.getElementById(this.#cfg.GetID("styleStrokeWidth")).value;
            case 'stroke-linecap': return document.getElementById(this.#cfg.GetID("styleStrokeLinecap")).value;
            case 'stroke-linejoin': return document.getElementById(this.#cfg.GetID("styleStrokeLinejoin")).value;
            case 'stroke-dasharray': return document.getElementById(this.#cfg.GetID("styleStrokeDasharray")).value;
            case 'fill-opacity': return document.getElementById(this.#cfg.GetID("styleFillOpacity")).value;
            case 'fill-rule': return document.getElementById(this.#cfg.GetID("styleFillRule")).value;
        }
    }

    #alertMissingElement(s) {
        if (document.getElementById(s) == null) {
            alert("HTML element with id='" + s + "' not found");
            return;
        }
    }


    #getZIndexForNewLayer() {
        var zIndex = this.#cfg.GetZIndex('layerStart');
        if (this.#layersOrder.length > 0) {
            var num = this.#layersOrder[this.#layersOrder.length - 1];
            zIndex = this.#layers[num].GetZIndex() + 10;
        }
        return zIndex
    }

    #initTools() {
        var scope = this;
        var fnGetStyle = function (s) {
            return scope.GetStyle(s);
        }
        var fnGetCurrentLayer = function () {
            if (scope.#layer === null)
                return null;
            return scope.#layer;
        }
        this.#tools = {
            'rectangle': new RectangleTool(this.#pad.GetCanvas(), fnGetStyle, fnGetCurrentLayer),
            'pencil': new PencilTool(this.#pad.GetCanvas(), fnGetStyle, fnGetCurrentLayer),
            'polygon': new PolygonTool(this.#pad.GetCanvas(), fnGetStyle, fnGetCurrentLayer),
            'testgroup': new TestGroupTool(this.#pad.GetCanvas(), fnGetStyle, fnGetCurrentLayer)
        }
        return ['rectangle', 'pencil', 'polygon', 'testgroup'];
    }
}

class EdytorLayerContainer extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
        this.id = "layer_container";

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.width = (window.innerWidth * 2) + 'px';
        this.style.height = (window.innerHeight * 2) + 'px';
    }
}

class EdytorShell extends HTMLInputElement {
    constructor() {
        super();
        this.type = "text";
    }

    connectedCallback() {
        this.id = "shell";
        this.className = "edytor_shell";

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.width = (window.innerWidth - 6) + 'px';
    }
}

class EdytorLogs extends HTMLTextAreaElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "logs";
        this.className = "edytor_logs";

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.width = (window.innerWidth - 6) + 'px';
    }
}

class EdytorTop extends HTMLElement {
    constructor() {
        super()
    }
}

class EdytorLeft extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.id = "sidebar_left";

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.height = (window.innerHeight - 20 - 80) + 'px';
    }
}

class EdytorRight extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.id = "sidebar_right";

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });
        this.#setSize();
    }

    #setSize() {
        this.style.height = (window.innerHeight - 20 - 80) + 'px';
    }
}

window.customElements.define("edytor-ui", Edytor);

// have a look on how the tools are designed - can we make them through command in the future?


// at the bottom add an input window and log window (for now they can be visible)
// where you could just type in commands, same way it would be done with Do
// + abstract the commands into separate classes somehow so they can have arguments definion, and logic

// how can we do the same for tools?


window.customElements.define("edytor-layer-container", EdytorLayerContainer);
window.customElements.define("edytor-shell", EdytorShell, { extends: 'input' });
window.customElements.define("edytor-logs", EdytorLogs, { extends: 'textarea' });
window.customElements.define("edytor-top", EdytorTop);
window.customElements.define("edytor-left", EdytorLeft);
window.customElements.define("edytor-right", EdytorRight);