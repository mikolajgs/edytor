class Config {
    #id = {
        container: "edytor",
        layerContainer: "layer_container",
        grid: "grid_layer",
        pad: "pad_layer",
        pixel: "pixel_layer",
        vector: "vector_layer",
        sidebarLeft: "sidebar_left",
        sidebarRight: "sidebar_right",
        layerList: "layer_list",
        toolContainer: "tool_container",
        colorFgContainer: "colorfg_container",
        colorBgContainer: "colorbg_container",
        strokeContainer: "stroke_container",
        fillContainer: "fill_container"
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