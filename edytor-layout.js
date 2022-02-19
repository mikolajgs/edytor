class Layout {
    #id = {
        container: "",
        layerContainer: "",
        sidebarLeft: "",
        sidebarRight: "",
        layerList: ""
    }

    #ref = {
        container: null,
        layerContainer: null,
        sidebarLeft: null,
        sidebarRight: null
    }

    #getToolIconFn = null;
    #setToolFn = null;
    #setColorFn = null;
    #tools = [];
    #colors = {};

    InitLayerContainer() {
        this.#ref.layerContainer = document.createElement('div');
        this.#ref.layerContainer.id = this.#id.layerContainer;
        this.#ref.container.appendChild(this.#ref.layerContainer);
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.layerContainer.style.width = (w*2) + 'px';
        this.#ref.layerContainer.style.height = (h*2) + 'px';
    }

    #addDivToContainer(ref, className, id) {
        this.#ref[ref] = document.createElement('div');
        this.#ref[ref].className = className;
        this.#ref[ref].id = id;
        this.#ref.container.appendChild(this.#ref[ref]);
    }

    #resizeSidebarsToWindow() {
        var h = window.innerHeight;
        this.#ref.sidebarLeft.style.height = h + 'px';
        this.#ref.sidebarRight.style.height = h + 'px';
    }

    #initSidebars() {
        this.#addDivToContainer('sidebarLeft', 'sidebar', this.#id.sidebarLeft);
        this.#addDivToContainer('sidebarRight', 'sidebar', this.#id.sidebarRight);
        this.#resizeSidebarsToWindow();
    }

    #setScroll() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        window.scrollTo(w/2,h/2);
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
        t.innerHTML = this.#getToolIconFn(n);
        t.id = "tool_"+n;

        var scope = this;
        t.addEventListener('click', function() {
            scope.#setToolFn(n);

            var o = document.getElementById("tool_"+n);
            o.classList.remove("bevel");
            o.classList.add("bevel_off");
            for (var i=0; i<scope.#tools.length; i++) {
                if (scope.#tools[i] == n) {
                    continue;
                }
                var o = document.getElementById("tool_"+scope.#tools[i]);
                o.classList.remove("bevel_off")
                o.classList.add("bevel");
            }

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
            scope.#setColorFn(fgbg, n);

            var o = document.getElementById("color"+fgbg+"_"+n);
            o.classList.remove("bevel");
            o.classList.add("bevel_off");
            o.innerHTML = 'X';
            for (const key in scope.#colors) {
                if (key == n) {
                    continue;
                }
                var o = document.getElementById("color"+fgbg+"_"+key);
                o.classList.remove("bevel_off");
                o.classList.add("bevel");
                o.innerHTML = '&nbsp;';
            }
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

    #initTools() {
        this.#addSidebarTitle('sidebarLeft',"Tools");
        for (var i=0; i<this.#tools.length; i++) {
            this.#addSidebarLeftTool(this.#tools[i]);
        }
        this.#addClearBoth(this.#ref.sidebarLeft);
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

        this.#setColorFn("fg", firstColor);
        this.#setColorFn("bg", firstColor);
    }

    #initStroke() {
        this.#addSidebarTitle('sidebarLeft',"Stroke");
        this.#addSidebarLeftInputText("stroke_width", "width", "3");
        this.#addSidebarLeftInputText("stroke_opacity", "opacity", "100%");
        this.#addSidebarLeftSelect("stroke_linecap", "linecap", {"butt": "butt", "square": "square", "round": "round"});
        this.#addSidebarLeftSelect("stroke_linejoin", "linejoin", {"miter": "miter", "round": "round", "bevel": "bevel"});
        this.#addSidebarLeftInputText("stroke_dasharray", "dasharray", "5");
    }

    #initFill() {
        this.#addSidebarTitle('sidebarLeft',"Fill");
        this.#addSidebarLeftInputText("fill_opacity", "opacity", "100%");
        this.#addSidebarLeftSelect("fill_rule", "rule", {"nonzero": "nonzero", "evenodd": "evenodd", "inherit": "inherit"});
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

    #initLayers() {
        this.#addSidebarTitle('sidebarRight', "Layers");

        var l = document.createElement('div');
        l.id = this.#id.layerList;

        var p = document.createElement('div');
        p.className = "property";

        var b = document.createElement('input');
        b.type = "checkbox";
        p.appendChild(b);

        var inp = document.createElement('input');
        inp.type = "text";
        inp.value = "Layer 1";
        inp.className = "layer_name";
        p.appendChild(inp);

        var b = document.createElement('button');
        b.className = "toggle_off";
        b.innerHTML = "L";
        p.appendChild(b);
        var b = document.createElement('button');
        b.className = "toggle_on";
        b.innerHTML = "H";
        p.appendChild(b);
        var b = document.createElement('button');
        b.className = "toggle_on";
        b.innerHTML = "U";
        p.appendChild(b);
        var b = document.createElement('button');
        b.className = "toggle_off";
        b.innerHTML = "D";
        p.appendChild(b);

        l.appendChild(p);


        this.#ref.sidebarRight.appendChild(l);


        var p = document.createElement('div');
        p.className = "property";
        var b = document.createElement('button');
        b.innerHTML = "Add";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Lock";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Unlock";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Show";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Hide";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Del";
        b.className = "action";
        p.appendChild(b);

        this.#ref.sidebarRight.appendChild(p);
    }

    constructor(idContainer, idLayerContainer, idSidebarLeft, idSidebarRight, idLayerList) {
        this.#id.container = idContainer;
        this.#id.layerContainer = idLayerContainer;
        this.#id.sidebarLeft = idSidebarLeft;
        this.#id.sidebarRight = idSidebarRight;
        this.#id.layerList = idLayerList;

        this.#ref.container = document.getElementById(this.#id.container);
        if (this.#ref.container == null) {
            alert("div with id='"+this.#id.container+"' not found");
            return;
        }
    }

    Init(getToolIconFn, setToolFn, tools, colors, setColorFn) {
        this.#getToolIconFn = getToolIconFn;
        this.#setToolFn = setToolFn;
        this.#setColorFn = setColorFn;
        this.#tools = tools;
        this.#colors = colors;
        this.#initSidebars();
        this.#setScroll();
        this.#initTools();
        this.#initColors();
        this.#initStroke();
        this.#initFill();
        this.#initLayers();
        this.#initProperties();
    }
}