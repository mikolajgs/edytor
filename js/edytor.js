class Edytor extends HTMLElement {
    // Tools
    #toolNames = [];
    #tool = "";

    // Colours
    #colourFgNames = [];
    #colourBgNames = [];
    #colourFg = "white";
    #colourBg = "black";

    // Layers
    #lastLayerNum = 0;
    #layer = 0;

    constructor() {
        super();
    }

    #el_tool(n) {
        return document.getElementById('tool_' + n);
    }

    #el_pad_layer() {
        return document.getElementById('pad_layer');
    }

    #el_colour_bg(n) {
        return document.getElementById('colour_bg_' + n);
    }

    #el_colour_fg(n) {
        return document.getElementById('colour_fg_' + n);
    }

    #el_layer_container() {
        return document.getElementById('layer_container');
    }

    #el_layer_list() {
        return document.getElementById('layer_list');
    }

    __initTool(s) {
        this.#toolNames.push(s);
    }

    initColour(t, n) {
        if (t == "bg") {
            this.#colourBgNames.push(n);
        } else {
            this.#colourFgNames.push(n);
        }
    }

    __newWorkspace(w, h, m) {
        var ws = document.getElementById("workspace");
        if (ws != null) {
            for (var i = 0; i <= this.#lastLayerNum; i++) {
                this.deleteLayer(i);
            }
            ws.remove();
        }
        this.#lastLayerNum = 0;
        this.#layer = 0;

        var newWS = document.createElement("edytor-workspace");
        newWS.setAttribute("container-margin", m.toString());
        newWS.setAttribute("image-width", w.toString());
        newWS.setAttribute("image-height", h.toString());
        this.prepend(newWS);

        this.addPixelLayer();
    }

    __scaleWorkspace(w, h) {
        var ws = document.getElementById("workspace");
        if (ws != null) {
            for (var i = 0; i <= this.#lastLayerNum; i++) {
                this.scaleLayer(i, w, h);
            }
            ws.setAttribute("image-width", w.toString());
            ws.setAttribute("image-height", h.toString());
            ws.setSize();
        }
    }

    __extendWorkspaceSide(s, v) {
        var ws = document.getElementById("workspace");
        if (ws != null) {
            for (var i = 0; i <= this.#lastLayerNum; i++) {
                this.extendLayerSide(i, s, v);
            }
            var nw = parseInt(ws.getAttribute("image-width"));
            var nh = parseInt(ws.getAttribute("image-height"));
            if (s == "left" || s == "right") {
                nw = nw + v;
            } else {
                nh = nh + v;
            }
            ws.setAttribute("image-width", nw.toString());
            ws.setAttribute("image-height", nh.toString());
            ws.setSize();
        }
    }

    __shrinkWorkspaceSide(s, v) {
        var ws = document.getElementById("workspace");
        if (ws != null) {
            var nw = parseInt(ws.getAttribute("image-width"));
            var nh = parseInt(ws.getAttribute("image-height"));
            var valsOk = false;
            if (s == "left" && nw > v) {
                valsOk = true;
            } else if (s == "right" && nw > v) {
                valsOk = true;
            } else if (s == "top" && nh > v) {
                valsOk = true;
            } else if (s == "bottom" && nh > v) {
                valsOk = true;
            }
            if (valsOk) {
                for (var i = 0; i <= this.#lastLayerNum; i++) {
                    this.shrinkLayerSide(i, s, v);
                }
                if (s == "left" || s == "right") {
                    nw = nw - v;
                } else {
                    nh = nh - v;
                }
                ws.setAttribute("image-width", nw.toString());
                ws.setAttribute("image-height", nh.toString());
                ws.setSize();
            }
        }
    }

    __getSelectedTool() {
        return this.#tool;
    }

    __getSelectedLayer() {
        return this.#layer;
    }

    __getSelectedBgColour() {
        return this.#colourBg;
    }

    __getSelectedFgColour() {
        return this.#colourFg;
    }

    __getPadCanvas() {
        return this.#el_pad_layer().getCanvas();
    }

    __centerScroll() {
        window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);
    }

    __selectTool(n) {
        if (this.#tool != "") {
            this.#el_tool(this.#tool).toggleOff();
        }
        this.#tool = n;
        this.#el_tool(n).toggleOn();
        if (this.#el_tool(n).RequiresPad) {
            this.#el_pad_layer().show();
        } else {
            this.#el_pad_layer().hide();
        }
    }

    __setColour(type, s) {
        if (type == "bg") {
            this.#colourBg = s;
        } else {
            this.#colourFg = s;
        }
    }

    selectColour(type, s) {
        if (type == "bg") {
            this.#colourBg = s;
            for (var i = 0; i < this.#colourBgNames.length; i++) {
                if (this.#colourBgNames[i] != s) {
                    document.getElementById('colour_bg_' + this.#colourBgNames[i]).toggleOff();
                } else {
                    document.getElementById('colour_bg_' + this.#colourBgNames[i]).toggleOn();
                }
            }
        } else {
            this.#colourFg = s;
            for (var i = 0; i < this.#colourFgNames.length; i++) {
                if (this.#colourFgNames[i] != s) {
                    document.getElementById('colour_fg_' + this.#colourFgNames[i]).toggleOff();
                } else {
                    document.getElementById('colour_fg_' + this.#colourFgNames[i]).toggleOn();
                }
            }
        }
    }

    __selectColourFromXY(type, x, y) {
        for (var i = this.#lastLayerNum; i > 0; i--) {
            var c = this.#el_layer_container().getColourFromXY(i, x, y);
            if (c != "") {
                this.selectColour(type, c);
                document.getElementById('colour_picker_' + type).value = c;
            }
        }
    }

    addVectorLayer() {
        this.#lastLayerNum++;
        this.#el_layer_container().addVectorLayer(this.#lastLayerNum);
        this.#el_layer_list().addVectorLayer(this.#lastLayerNum);
    }

    addPixelLayer() {
        this.#lastLayerNum++;
        this.#el_layer_container().addPixelLayer(this.#lastLayerNum);
        this.#el_layer_list().addPixelLayer(this.#lastLayerNum);
        this.selectLayer(this.#lastLayerNum);
    }

    toggleLayerHidden(num) {
        this.#el_layer_list().setLayerHidden(num, this.#el_layer_container().toggleLayerHidden(num));
    }

    toggleLayerLocked(num) {
        this.#el_layer_list().setLayerLocked(num, this.#el_layer_container().toggleLayerLocked(num));
    }

    deleteLayer(num) {
        this.#el_layer_container().deleteLayer(num);
        this.#el_layer_list().deleteLayer(num);
        if (num == this.#layer) {
            this.selectLayer(0);
        }
    }

    extendLayerSide(num, side, val) {
        this.#el_layer_container().extendLayerSide(num, side, val);
    }

    shrinkLayerSide(num, side, val) {
        this.#el_layer_container().shrinkLayerSide(num, side, val);
    }

    scaleLayer(num, width, height) {
        this.#el_layer_container().scaleLayer(num, width, height);
    }

    moveLayerUp(num) {
        this.#el_layer_container().swapLayers(num, this.#el_layer_list().moveLayerUp(num));
    }

    moveLayerDown(num) {
        this.#el_layer_container().swapLayers(num, this.#el_layer_list().moveLayerDown(num));
    }

    toggleLayersLocked(numList) {
        if (numList.length > 0) {
            var l = this.#el_layer_container().getLayerLocked(numList[0]);
            for (var i = 0; i < numList.length; i++) {
                this.#el_layer_container().setLayerLocked(numList[i], !l);
                this.#el_layer_list().setLayerLocked(numList[i], !l);
            }
        }
    }

    toggleLayersHidden(numList) {
        if (numList.length > 0) {
            var h = this.#el_layer_container().getLayerHidden(numList[0]);
            for (var i = 0; i < numList.length; i++) {
                this.#el_layer_container().setLayerHidden(numList[i], !h);
                this.#el_layer_list().setLayerHidden(numList[i], !h);
            }
        }
    }

    deleteLayers(numList) {
        for (var i = 0; i < numList.length; i++) {
            this.deleteLayer(numList[i]);
        }
    }

    selectLayer(num) {
        this.#layer = num;
        this.#el_layer_list().selectLayer(num);
    }

    __showError(e) {
        document.getElementById("logs").addError(e);
    }

    connectedCallback() {
        this.id = 'edytor';
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "relative";
    }
}

window.customElements.define("edytor-ui", Edytor);

// have a look on how the tools are designed - can we make them through command in the future?


// at the bottom add an input window and log window (for now they can be visible)
// where you could just type in commands, same way it would be done with Do
// + abstract the commands into separate classes somehow so they can have arguments definion, and logic

// how can we do the same for tools?
