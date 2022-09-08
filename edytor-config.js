class Config {
    #id = {
        container: "edytor",
        layerContainer: "layer_container",
        grid: "grid_layer",
        pad: "pad_layer",
        pixelPrefix: "pixel_layer_",
        vectorPrefix: "vector_layer_",
        sidebarLeft: "sidebar_left",
        sidebarRight: "sidebar_right",
        layerList: "layer_list",
        toolContainer: "tool_container",
        colorFgContainer: "colorfg_container",
        colorBgContainer: "colorbg_container",
        strokeContainer: "stroke_container",
        fillContainer: "fill_container",
        propertyContainer: "property_container",
        layerListContainer: "layerlist_container",
        layerToolsContainer: "layertools_container",
        layerPrefix: "layer_",
        layerTickPrefix: "layer_tick_",
        layerTypePrefix: "layer_type_",
        layerNamePrefix: "layer_name_",
        layerActionLockPrefix: "layer_lock_",
        layerActionHidePrefix: "layer_hide_",
        layerActionMoveUpPrefix: "layer_moveup_",
        layerActionMoveDownPrefix: "layer_movedown_",
        layerActionDeletePrefix: "layer_delete_",
        layerActionTickAll: "layer_tickall",
        styleStrokeOpacity: "style_stroke_opacity",
        styleStrokeWidth: "style_stroke_width",
        styleStrokeLinecap: "style_stroke_linecap",
        styleStrokeLinejoin: "style_stroke_linejoin",
        styleStrokeDasharray: "style_stroke_dasharray",
        styleFillOpacity: "style_fill_opacity",
        styleFillRule: "style_fill_rule"
    }
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
    #zIndexes = {
        grid: 101,
        pad: 401,
        sidebarLeft: 511,
        sidebarRight: 521,
        layerStart: 201
    }

    GetColors() {
        return this.#colors;
    }
    GetID(s) {
        return this.#id[s];
    }
    GetZIndex(s) {
        return this.#zIndexes[s];
    }
}