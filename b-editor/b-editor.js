function element(e) {
    return document.getElementById("b-editor-" + e);
}

window.onload = function () {
    const editor = element("editor").contentWindow.document;
    editor.designMode = "on";

    element("log").onclick = function() {
        console.log(editor.body);
    };

    function cmd(id, showUi, value) {
        return function() {
            editor.execCommand(id, showUi, value);
        }
    }

    element("bold").onclick = cmd("Bold");
    element("italic").onclick = cmd("Italic");
    element("super").onclick = cmd("Superscript");
    element("sub").onclick = cmd("Subscript");
    element("strike").onclick = cmd("Strikethrough");

    element("ol").onclick = cmd("InsertOrderedList", false,
        "newOL" + Math.round(Math.random() * 1000));
    element("ul").onclick = cmd("InsertUnorderedList", false,
        "newUL" + Math.round(Math.random() * 1000));

    element("color").onchange = function(event) {
        editor.execCommand("ForeColor", false, event.target.value);
    };
    element("font").onchange = function(event) {
        editor.execCommand("FontName", false, event.target.value);
    };
    element("fontsize").onchange = function(event) {
        editor.execCommand("FontSize", false, event.target.value);
    };

    element("input").onchange = function(event) {
        if(this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                editor.body.focus();
                var imgHTML = "<img width='500px'  src='" + e.target.result + "'/>";
                editor.execCommand("insertHTML", false, imgHTML);
            };
            reader.readAsDataURL(this.files[0]);
            this.value = "";
        }
    };
    element("image").onclick = function() {
        element("input").click();
    };

    element("link").onclick = function() {
        var url = prompt("Enter a URL", "https://");
        editor.execCommand("CreateLink", false, url);
    };
    element("unlink").onclick = cmd("UnLink");
    element("undo").onclick = cmd("undo");
    element("redo").onclick = cmd("redo");

};