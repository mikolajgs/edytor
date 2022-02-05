class SelectTool {
    name = "Select"
    icon = "sel"
    mouseLayer = false
}

class MoveTool {
    name = "Move"
    icon = "mov"
    mouseLayer = false
}

class ResizeTool {
    name = "Resize"
    icon = "siz"
    mouseLayer = false
}

class CircleTool {
    name = "Circle"
    icon = "cir"
    mouseLayer = true
}

class RectangleTool {
    name = "Rectangle"
    icon = "rec"
    mouseLayer = true
    #startPoint = [0,0];
    #movePoint = [0, 0];
    #endPoint = [0, 0];
    #refDrawedObject = null;
    #ref = {}

    constructor(edytor, mouseLayer, svg) {
        this.#ref.edytor = edytor;
        this.#ref.mouseLayer = mouseLayer;
        this.#ref.svg = svg;
    }

    DrawStart(x, y) {
        this.#startPoint = [x, y];
    }
    DrawMove(x, y) {
        this.#movePoint = [x, y];
        if (this.#movePoint[1] != this.#startPoint[1] && this.#movePoint[0] != this.#startPoint[0]) {
            if (this.#refDrawedObject == null) {
                this.#refDrawedObject = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                this.#refDrawedObject.setAttribute("fill", this.#ref.edytor.GetColorFg());
                this.#refDrawedObject.setAttribute("stroke", this.#ref.edytor.GetColorBg());
                this.#refDrawedObject.setAttribute("stroke-width", this.#ref.edytor.GetStrokeWidth());
                this.#refDrawedObject.setAttribute("stroke-opacity", this.#ref.edytor.GetStrokeOpacity());
                this.#refDrawedObject.setAttribute("stroke-linecap", this.#ref.edytor.GetStrokeLinecap());
                this.#refDrawedObject.setAttribute("stroke-linejoin", this.#ref.edytor.GetStrokeLinejoin());
                this.#refDrawedObject.setAttribute("stroke-dasharray", this.#ref.edytor.GetStrokeDasharray());
            }
            this.#refDrawedObject.setAttribute("width", (this.#startPoint[0] < this.#movePoint[0] ? this.#movePoint[0] - this.#startPoint[0] : this.#startPoint[0] - this.#movePoint[0]));
            this.#refDrawedObject.setAttribute("height", (this.#startPoint[1] < this.#movePoint[1] ? this.#movePoint[1] - this.#startPoint[1] : this.#startPoint[1] - this.#movePoint[1]));
            this.#refDrawedObject.setAttribute("x", (this.#startPoint[0] < this.#movePoint[0] ? this.#startPoint[0] : this.#movePoint[0]))
            this.#refDrawedObject.setAttribute("y", (this.#startPoint[1] < this.#movePoint[1] ? this.#startPoint[1] : this.#movePoint[1]))
            this.#ref.svg.appendChild(this.#refDrawedObject);
        } else {
            if (this.#refDrawedObject != null) {
                this.#refDrawedObject.parentNode.removeChild(this.#refDrawedObject);
            }
        }
    }
    DrawEnd(x, y) {
        this.#endPoint = [x, y];
        this.#refDrawedObject = null;
    }
    DrawCancel() {
        //this.#refDrawedObject.parentNode.removeChild(this.#refDrawedObject);
    }
}

class Edytor {
    #id = {
        container: "edytor",
        gridContainer: "grid_container",
        grid: "grid",
        mouseLayerContainer: "mouse_layer_container",
        mouseLayer: "mouse_layer",
        svgContainer: "svg_container",
        svg: "svg",
        sidebarLeft: "sidebar_left",
        sidebarRight: "sidebar_right"
    }
    #ref = {
        container: null,
        gridContainer: null,
        grid: null,
        mouseLayerContainer: null,
        mouseLayer: null,
        svgContainer: null,
        svg: null,
        sidebarLeft: null,
        sidebarRight: null
    }
    #layoutColors = {
        gridBackground: "#282828",
        gridStroke1: "#555555",
        gridStroke2: "#444444",
        gridStroke3: "#333333"
    }
    #tools = {}
    #tool = "";
    #colors = {
        "black": "black",
        "silver": "silver",
        "gray": "gray",
        "white": "white",
        "maroon": "maroon",
        "red": "red",
        "purple": "purple",
        "fuchsia": "fuchsia",
        "green": "green",
        "lime": "lime",
        "olive": "olive",
        "yellow": "yellow",
        "navy": "navy",
        "blue": "blue",
        "teal": "teal",
        "aqua": "aqua"
    }
    #colorFg = "#ffffff";
    #colorBg = "#000000";

    #mouseDown = false;

    constructor() {
        this.#ref.container = document.getElementById(this.#id.container);
        if (this.#ref.container == null) {
            alert("div with id='edytor' not found");
            return;
        }
        this.#initGrid();
        this.#initSVG();
        this.#initMouseLayer();
        this.#initSidebars();
        this.#setScroll();
        this.#initTools();
        this.#initColors();
        this.#initStroke();
        this.#initProperties();
    }

    #addSidebarTitle(ref, t) {
        var d = document.createElement('div');
        d.className = "sidebar_title bevel";
        d.innerHTML = t;
        this.#ref[ref].appendChild(d);
    }

    #addSidebarLeftTool(n) {
        var t = document.createElement('div');
        t.className = "bevel tool";
        t.innerHTML = this.#tools[n].icon;
        t.id = "tool_"+n;

        var scope = this;
        t.addEventListener('click', function() {
            scope.SetTool(n);
        });
        this.#ref.sidebarLeft.appendChild(t);
    }

    #addSidebarLeftColor(fgbg, n) {
        var t = document.createElement('div');
        t.className = "bevel color";
        t.innerHTML = "&nbsp;";
        t.id = "color"+fgbg+"_"+n;
        t.style.background = this.#colors[n];

        var scope = this;
        t.addEventListener('click', function() {
            scope.SetColor(fgbg, n);
        });
        this.#ref.sidebarLeft.appendChild(t);
    }

    #addSidebarLeftInputText(id, label, defval) {
        var p = document.createElement('div');
        p.className = "tool_property";

        var lbl = document.createElement('label');
        lbl.innerHTML = label;

        var inp = document.createElement('input');
        inp.type = "text";
        inp.id = id;
        inp.value = defval;

        p.appendChild(lbl);
        p.appendChild(inp);
        this.#ref.sidebarLeft.appendChild(p);
    }

    #addSidebarLeftSelect(id, label, vals) {
        var p = document.createElement('div');
        p.className = "tool_property";

        var lbl = document.createElement('label');
        lbl.innerHTML = label;

        var sel = document.createElement('select');
        sel.id = id;

        for (const key in vals) {
            var o = document.createElement('option');
            o.value = key;
            o.innerHTML = vals[key];
            sel.appendChild(o);
        }
        p.appendChild(lbl);
        p.appendChild(sel);
        this.#ref.sidebarLeft.appendChild(p);
    }

    #addClearBoth(p) {
        var c = document.createElement('div');
        c.className = "clear";
        p.appendChild(c);
    }

    #addDivToContainer(ref, className, id) {
        this.#ref[ref] = document.createElement('div');
        this.#ref[ref].className = className;
        this.#ref[ref].id = id;
        this.#ref.container.appendChild(this.#ref[ref]);
    }

    #initGrid() {
        this.#ref.gridContainer = document.createElement('div');
        this.#ref.gridContainer.id = this.#id.gridContainer;
        this.#ref.container.appendChild(this.#ref.gridContainer);

        this.#ref.grid = document.createElement('canvas');
        this.#ref.grid.id = this.#id.grid;
        this.#ref.gridContainer.appendChild(this.#ref.grid);
        this.ResizeGridToWindow();
        this.InitGridGrid();
    }

    ResizeGridToWindow() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.grid.width = w*2;
        this.#ref.grid.height = h*2;
        this.#ref.gridContainer.style.width = w*2 + 'px';
        this.#ref.gridContainer.style.height = h*2 + 'px';
    }

    InitGridGrid() {
        var ctx = this.#ref.grid.getContext("2d");
        ctx.fillStyle = this.#layoutColors.gridBackground;
        ctx.fillRect(0, 0, this.#ref.grid.width, this.#ref.grid.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.#layoutColors.gridStroke2;

        for (var i=0; i<=this.#ref.grid.width/10; i++) {
            var j = i*10;
            ctx.beginPath();
            if (j % 100 == 0) {
                ctx.strokeStyle = this.#layoutColors.gridStroke1;
            } else if (j % 50 == 0) {
                ctx.strokeStyle = this.#layoutColors.gridStroke2;
            } else {
                ctx.strokeStyle = this.#layoutColors.gridStroke3;
            }
            ctx.moveTo(j, 0);
            ctx.lineTo(j, this.#ref.grid.height);
            ctx.stroke();
            ctx.closePath();
        }
        for (var i=0; i<=this.#ref.grid.height/10; i++) {
            var j = i*10;
            ctx.beginPath();
            if (j % 100 == 0) {
                ctx.strokeStyle = this.#layoutColors.gridStroke1;
            } else if (j % 50 == 0) {
                ctx.strokeStyle = this.#layoutColors.gridStroke2;
            } else {
                ctx.strokeStyle = this.#layoutColors.gridStroke3;
            }
            ctx.moveTo(0, j);
            ctx.lineTo(this.#ref.grid.width, j);
            ctx.stroke();
            ctx.closePath();
        }
    }

    #initSVG() {
        this.#ref.svgContainer = document.createElement('div');
        this.#ref.svgContainer.id = this.#id.svgContainer;
        this.#ref.container.appendChild(this.#ref.svgContainer);
        this.#ref.svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        this.#ref.svg.setAttribute('width', '100%');
        this.#ref.svg.setAttribute('height', '100%');
        this.#ref.svgContainer.appendChild(this.#ref.svg);
        this.ResizeSVGToWindow();
    }

    ResizeSVGToWindow() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.svgContainer.style.width = w*2 + 'px';
        this.#ref.svgContainer.style.height = h*2 + 'px';
    }

    #initMouseLayer() {
        this.#ref.mouseLayerContainer = document.createElement('div');
        this.#ref.mouseLayerContainer.id = this.#id.mouseLayerContainer;
        this.#ref.container.appendChild(this.#ref.mouseLayerContainer);

        this.#ref.mouseLayer = document.createElement('canvas');
        this.#ref.mouseLayer.id = this.#id.mouseLayer;
        this.#ref.mouseLayerContainer.appendChild(this.#ref.mouseLayer);
        this.ResizeMouseLayerToWindow();

        var scope = this;
        this.#ref.mouseLayer.addEventListener('mousedown', function(e) {
            scope.#mouseDown = true;
            scope.#tools[scope.#tool].DrawStart(e.layerX, e.layerY);
        });
        this.#ref.mouseLayer.addEventListener('mousemove', function(e) {
            if (scope.#mouseDown) {
                scope.#tools[scope.#tool].DrawMove(e.layerX, e.layerY);
            }
        });
        this.#ref.mouseLayer.addEventListener('mouseup', function(e) {
            scope.#mouseDown = false;
            scope.#tools[scope.#tool].DrawEnd(e.layerX, e.layerY);
        });
        this.#ref.mouseLayer.addEventListener('mouseout', function(e) {
            scope.#mouseDown = false;
            scope.#tools[scope.#tool].DrawCancel();
        });
    }

    ResizeMouseLayerToWindow() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.mouseLayer.width = w*2;
        this.#ref.mouseLayer.height = h*2;
        this.#ref.mouseLayerContainer.style.width = w*2 + 'px';
        this.#ref.mouseLayerContainer.style.height = h*2 + 'px';
        this.#ref.mouseLayerContainer.style.display = 'none';
    }

    #initSidebars() {
        this.#addDivToContainer('sidebarLeft', 'sidebar', 'sidebar_left');
        this.#addDivToContainer('sidebarRight', 'sidebar', 'sidebar_right');
        this.ResizeSidebarsToWindow();
    }

    #initToolObjects() {
        this.#tools = {
            'select': new SelectTool(this, this.#ref.mouseLayer, this.#ref.svg),
            'move': new MoveTool(this, this.#ref.mouseLayer, this.#ref.svg),
            'resize': new ResizeTool(this, this.#ref.mouseLayer, this.#ref.svgs),
            'circle': new CircleTool(this, this.#ref.mouseLayer, this.#ref.svg),
            'rectangle': new RectangleTool(this, this.#ref.mouseLayer, this.#ref.svg)
        }
    }

    #initTools() {
        this.#initToolObjects();

        this.#addSidebarTitle('sidebarLeft',"Tools");
        for (const key in this.#tools) {
            this.#addSidebarLeftTool(key);
        }
        this.#addClearBoth(this.#ref.sidebarLeft);
    }

    SetTool(name) {
        var o = document.getElementById("tool_"+name);
        o.classList.remove("bevel");
        o.classList.add("bevel_off");
        for (const key in this.#tools) {
            if (key == name) {
                continue;
            }
            var o = document.getElementById("tool_"+key);
            o.classList.remove("bevel_off")
            o.classList.add("bevel");
        }
        this.#tool = name;
        if (this.#tools[name].mouseLayer) {
            this.#ref.mouseLayerContainer.style.display = "";
        } else {
            this.#ref.mouseLayerContainer.style.display = "none";
        }
    }

    SetColor(fgbg, name) {
        var o = document.getElementById("color"+fgbg+"_"+name);
        o.classList.remove("bevel");
        o.classList.add("bevel_off");
        o.innerHTML = 'X';
        for (const key in this.#colors) {
            if (key == name) {
                continue;
            }
            var o = document.getElementById("color"+fgbg+"_"+key);
            o.classList.remove("bevel_off");
            o.classList.add("bevel");
            o.innerHTML = '&nbsp;';
        }
        if (fgbg == "fg") {
            this.#colorFg = name;
        } else {
            this.#colorBg = name;
        }
    }

    GetColorFg() {
        return this.#colorFg;
    }

    GetColorBg() {
        return this.#colorBg;
    }

    GetStrokeOpacity() {
        return document.getElementById('stroke_opacity').value;
    }
    GetStrokeWidth() {
        return document.getElementById('stroke_width').value;
    }
    GetStrokeLinecap() {
        return document.getElementById('stroke_linecap').value;
    }
    GetStrokeLinejoin() {
        return document.getElementById('stroke_linejoin').value;
    }
    GetStrokeDasharray() {
        return document.getElementById('stroke_dasharray').value;
    }

    SetColorFg(name) {
        var o = document.getElementById("colorfg_"+name);
        o.classList.remove("bevel");
        o.classList.add("bevel_off");
        o.innerHTML = 'X';
        for (const key in this.#colors) {
            if (key == name) {
                continue;
            }
            var o = document.getElementById("colorfg_"+key);
            o.classList.remove("bevel_off");
            o.classList.add("bevel");
            o.innerHTML = '&nbsp;';
        }
        this.#colorFg = name;
    }

    SetColorBg(name) {
        var o = document.getElementById("colorbg_"+name);
        o.classList.remove("bevel");
        o.classList.add("bevel_off");
        o.innerHTML = 'X';
        for (const key in this.#colors) {
            if (key == name) {
                continue;
            }
            var o = document.getElementById("colorbg_"+key);
            o.classList.remove("bevel_off");
            o.classList.add("bevel");
            o.innerHTML = '&nbsp;';
        }
        this.#colorBg = name;
    }

    #initColors() {
        this.#addSidebarTitle('sidebarLeft',"Fg Color");
        var i = 0;
        var firstColor = "";
        for (const key in this.#colors) {
            if (i == 0) {
                firstColor = key;
            }
            this.#addSidebarLeftColor("fg", key);
            i++;
        }
        this.#addClearBoth(this.#ref.sidebarLeft);

        this.#addSidebarTitle('sidebarLeft',"Bg Color");
        for (const key in this.#colors) {
            this.#addSidebarLeftColor("bg", key);
        }
        this.#addClearBoth(this.#ref.sidebarLeft);

        this.SetColor("fg", firstColor);
        this.SetColor("bg", firstColor);
    }

    #initStroke() {
        this.#addSidebarTitle('sidebarLeft',"Stroke");
        this.#addSidebarLeftInputText("stroke_width", "width", "3");
        this.#addSidebarLeftInputText("stroke_opacity", "opacity", "100%");
        this.#addSidebarLeftSelect("stroke_linecap", "linecap", {"butt": "butt", "square": "square", "round": "round"});
        this.#addSidebarLeftSelect("stroke_linejoin", "linejoin", {"miter": "miter", "round": "round", "bevel": "bevel"});
        this.#addSidebarLeftInputText("stroke_dasharray", "dasharray", "5");
    }

    #initProperties() {
        this.#addSidebarTitle('sidebarRight',"Properties");

        for (var i=0; i<10; i++) {
            var p = document.createElement('div');
            p.className = "property";

            var lbl = document.createElement('label');
            lbl.innerHTML = "Property:";

            var inp = document.createElement('input');
            inp.type = "text";
            inp.value = "val";

            p.appendChild(lbl);
            p.appendChild(inp);
            this.#ref.sidebarRight.appendChild(p);
        }
    }

    ResizeSidebarsToWindow() {
        var h = window.innerHeight;
        this.#ref.sidebarLeft.style.height = h + 'px';
        this.#ref.sidebarRight.style.height = h + 'px';
    }

    #setScroll() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        window.scrollTo(w/2,h/2);
    }
}

var EdytorInstance = null;

function Init() {
    EdytorInstance = new Edytor();
}
/*
var origElemX = 0;
var origElemY = 0;
var drag = false;
var dragElem = null;

function svgElemMouseDown(e) {
    dragElem = e.target;
    origElemX = e.target.cx;
    origElemY = e.target.cy;
    drag = true;
}

function mouseUp(e) {
    drag = false;
}

function mouseMove(e) {
    if (drag) {
        console.log(dragElem.cx);
        dragElem.setAttribute("cx", e.offsetX);
        dragElem.setAttribute("cy", e.offsetY);
    }
}

function init() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var canv = document.getElementById('canvas');
    canv.width = w*2;
    canv.height = h*2;

    var canv_cont = document.getElementById('grid_container');
    canv_cont.style.width  = w*2 + 'px';
    canv_cont.style.height = h*2 + 'px';

    var sv_cont = document.getElementById('svg_container');
    sv_cont.style.width  = w*2 + 'px';
    sv_cont.style.height = h*2 + 'px';

    var sv = document.getElementById('svg');
    sv.width = "100%";
    sv.height = "100%";

    document.getElementById('sidebar_left').style.height = h+'px';
    document.getElementById('sidebar_right').style.height = h+'px';
    document.getElementById('sidebar_extended_left').style.height = h+'px';
    document.getElementById('sidebar_extended_right').style.height = h+'px';

    window.scrollTo(w/2,h/2);

    var ctx = canv.getContext("2d");
    ctx.fillStyle = "#282828";
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#4c4c4c";

    for (i=0; i<=canv.width/100; i++) {
        ctx.moveTo(i*100, 0);
        ctx.lineTo(i*100, canv.height);
        ctx.stroke();
    }
    for (i=0; i<=canv.height/100; i++) {
        ctx.moveTo(0, i*100);
        ctx.lineTo(canv.width, i*100);
        ctx.stroke();
    }

    document.getElementById('circle').addEventListener("mousedown", svgElemMouseDown, false);
    document.addEventListener('mouseup', mouseUp, false);
    document.addEventListener('mousemove', mouseMove, false);
}
*/
document.addEventListener("DOMContentLoaded", Init, false);