class Edytor extends HTMLElement {
    #toolNames = [];
    #tool = "";

    #colourFgNames = [];
    #colourBgNames = [];
    #colourFg = "white";
    #colourBg = "black";

    #lastLayerNum = 0;
    #layer = 0;

    constructor() {
        super();
    }

    initTool(s) {
        this.#toolNames.push(s);
    }

    initColour(t, n) {
        if (t == "bg") {
            this.#colourBgNames.push(n);
        } else {
            this.#colourFgNames.push(n);
        }
    }


    newWorkspace(w, h, m) {
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

    scaleWorkspace(w, h) {
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

    extendWorkspaceSide(s, v) {
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

    shrinkWorkspaceSide(s, v) {
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

    getSelectedTool() {
        return this.#tool;
    }

    getSelectedLayer() {
        return this.#layer;
    }

    getSelectedBgColour() {
        return this.#colourBg;
    }

    getSelectedFgColour() {
        return this.#colourFg;
    }

    __centerScroll() {
        window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);
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

    selectColourFromXY(type, x, y) {
        for (var i = this.#lastLayerNum; i > 0; i--) {
            var c = document.getElementById('layer_container').getColourFromXY(i, x, y);
            if (c != "") {
                this.selectColour(type, c);
                document.getElementById('colour_picker_' + type).value = c;
            }
        }
    }

    selectTool(n) {
        if (this.#tool != "") {
            document.getElementById('tool_' + this.#tool).toggleOff();
        }

        this.#tool = n;
        var tool = document.getElementById('tool_' + this.#tool);
        var pad = document.getElementById('pad_layer');
        var select = document.getElementById('select_layer');

        tool.toggleOn();
        if (tool.RequiresPad) {
            pad.show();
        } else {
            pad.hide();
        }

        tool.selectedCallback();
    }

    addVectorLayer() {
        this.#lastLayerNum++;
        document.getElementById('layer_container').addVectorLayer(this.#lastLayerNum);
        document.getElementById('layer_list').addVectorLayer(this.#lastLayerNum);
    }

    addPixelLayer() {
        this.#lastLayerNum++;
        document.getElementById('layer_container').addPixelLayer(this.#lastLayerNum);
        document.getElementById('layer_list').addPixelLayer(this.#lastLayerNum);
        this.selectLayer(this.#lastLayerNum);
    }

    toggleLayerHidden(num) {
        document.getElementById('layer_list').setLayerHidden(
            num,
            document.getElementById('layer_container').toggleLayerHidden(num)
        );
    }

    toggleLayerLocked(num) {
        document.getElementById('layer_list').setLayerLocked(
            num,
            document.getElementById('layer_container').toggleLayerLocked(num)
        );
    }

    deleteLayer(num) {
        document.getElementById('layer_container').deleteLayer(num);
        document.getElementById('layer_list').deleteLayer(num);
        if (num == this.#layer) {
            this.selectLayer(0);
        }
    }

    extendLayerSide(num, side, val) {
        document.getElementById('layer_container').extendLayerSide(num, side, val);
    }

    shrinkLayerSide(num, side, val) {
        document.getElementById('layer_container').shrinkLayerSide(num, side, val);
    }

    scaleLayer(num, width, height) {
        document.getElementById('layer_container').scaleLayer(num, width, height);
    }

    moveLayerUp(num) {
        document.getElementById('layer_container').swapLayers(
            num,
            document.getElementById('layer_list').moveLayerUp(num)
        );
    }

    moveLayerDown(num) {
        document.getElementById('layer_container').swapLayers(
            num,
            document.getElementById('layer_list').moveLayerDown(num)
        );
    }

    toggleLayersLocked(numList) {
        if (numList.length > 0) {
            var layerContainer = document.getElementById('layer_container');
            var layerList = document.getElementById('layer_list');

            var l = layerContainer.getLayerLocked(numList[0]);
            for (var i = 0; i < numList.length; i++) {
                layerContainer.setLayerLocked(numList[i], !l);
                layerList.setLayerLocked(numList[i], !l);
            }
        }
    }

    toggleLayersHidden(numList) {
        if (numList.length > 0) {
            var layerContainer = document.getElementById('layer_container');
            var layerList = document.getElementById('layer_list');

            var h = layerContainer.getLayerHidden(numList[0]);
            for (var i = 0; i < numList.length; i++) {
                layerContainer.setLayerHidden(numList[i], !h);
                layerList.setLayerHidden(numList[i], !h);
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
        document.getElementById('layer_list').selectLayer(num);
    }


    // Drawing functions (temporarily put here)
    drawPolygonPathOnCtx(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
    }

    drawEllipsePathOnCtx(ctx, shapeArea) {
        var w = Math.abs(shapeArea[2] - shapeArea[0]);
        var h = Math.abs(shapeArea[3] - shapeArea[1]);
        var x = shapeArea[0];
        var y = shapeArea[1];
        var cx = x + (w / 2);
        var cy = y + (h / 2);

        ctx.beginPath();
        ctx.ellipse(cx, cy, (w / 2), (h / 2), 0, 0, 2 * Math.PI);
        ctx.closePath();
    }

    drawRoundedRectanglePathOnCtx(ctx, shapeArea, r) {
        var w = Math.abs(shapeArea[2] - shapeArea[0]);
        var h = Math.abs(shapeArea[3] - shapeArea[1]);
        var x = shapeArea[0];
        var y = shapeArea[1];

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    drawRectanglePathOnCtx(ctx, shapeArea) {
        ctx.beginPath();
        ctx.rect(
            shapeArea[0],
            shapeArea[1],
            Math.abs(shapeArea[2] - shapeArea[0]),
            Math.abs(shapeArea[3] - shapeArea[1])
        );
        ctx.closePath();
    }


    showError(e) {
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
