class Edytor {
    #cfg = null;
    #layout = null;
    #grid = null;
    #pad = null;
   
    #tools = {}
    #tool = "";
    #colorFg = "#ffffff";
    #colorBg = "#000000";

    #mouseDown = false;

    #layers = [];
    #layer = null;

    constructor() {
        this.#cfg = new Config();

        if (document.getElementById(this.#cfg.GetID("container")) == null) {
            alert("div with id='"+this.#cfg.GetID('container')+"' not found");
            return;
        }
        this.#layout = new Layout(this.#cfg.GetID('container'), this.#cfg.GetID('layerContainer'), this.#cfg.GetID('sidebarLeft'), this.#cfg.GetID('sidebarRight'), this.#cfg.GetID('layerList'), this.#cfg.GetID('toolContainer'), this.#cfg.GetID('colorFgContainer'), this.#cfg.GetID('colorBgContainer'));
        this.#layout.InitBody();
        this.#layout.InitContainer();
        this.#layout.InitLayerContainer();

        this.#grid = new Grid(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('grid'));
        this.#grid.Init(this.#cfg.GetZIndex('grid'));

        this.#pad = new Pad(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pad'));
        var scope = this;
        this.#pad.Init(this.#cfg.GetZIndex('pad'), function() {
            return scope.#tools[scope.#tool];
        });

        this.AddVectorLayer(this.#cfg.GetZIndex('layerStart'));
        this.AddPixelLayer(this.#cfg.GetZIndex('layerStart')+10);

        var toolNames = this.#initTools();
        this.#layout.InitSidebars(this.#cfg.GetZIndex('sidebarLeft'), this.#cfg.GetZIndex('sidebarRight'), function(n) {
            return scope.#tools[n].GetIcon();
        }, function(n) {
            scope.SetTool(n);
        }, toolNames, this.#cfg.GetColors(), function(t, c) {
            scope.SetColor(t, c);
        });
    }

    AddVectorLayer(zIndex) {
        var l = new VectorLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('vector'));
        l.SetZIndex(zIndex);
        l.Init();
        this.#layers.push(l);
    }
    AddPixelLayer(zIndex) {
        var l = new PixelLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pixel'));
        l.SetZIndex(zIndex);
        l.Init();
        this.#layers.push(l);
    }

    GetStyle(s) {
        switch(s) {
            case 'color-fg': return this.#colorFg;
            case 'color-bg': return this.#colorBg;
            case 'stroke-opacity': return document.getElementById('stroke_opacity').value;
            case 'stroke-width': return document.getElementById('stroke_width').value;
            case 'stroke-linecap': return document.getElementById('stroke_linecap').value;
            case 'stroke-linejoin': return document.getElementById('stroke_linejoin').value;
            case 'stroke-dasharray': return document.getElementById('stroke_dasharray').value;
            case 'fill-opacity': return document.getElementById('fill_opacity').value;
            case 'fill-rule': return document.getElementById('fill_rule').value;
        }
    }

    SetTool(name) {
        this.#tool = name;
        if (this.#tools[name].RequiresPad()) {
            this.#pad.Show();
        } else {
            this.#pad.Hide();
        }
    }

    SetColor(fgbg, name) {
        if (fgbg == "fg") {
            this.#colorFg = name;
        } else {
            this.#colorBg = name;
        }
    }

    #initTools() {
        var scope = this;
        this.#tools = {
            'rectangle': new RectangleTool(this.#pad.GetCanvas(), function(s) {
                return scope.GetStyle(s);
            }, function() {
                return scope.#layers[0].GetSVG();
            }, function() {
                return scope.#layers[1].GetCanvas();
            }),
            'pencil': new PencilTool(this.#pad.GetCanvas(), function(s) {
                return scope.GetStyle(s);
            }, function() {
                return scope.#layers[0].GetSVG();
            }, function() {
                return scope.#layers[1].GetCanvas();
            }),
            'polygon': new PolygonTool(this.#pad.GetCanvas(), function(s) {
                return scope.GetStyle(s);
            }, function() {
                return scope.#layers[0].GetSVG();
            }, function() {
                return scope.#layers[1].GetCanvas();
            })
        }
        return ['rectangle', 'pencil', 'polygon'];
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