class BeritamusEditor extends HTMLElement {
    constructor() {
        super();
        this.btnGradient = {};
        this.controlButtons = {};
        this.colorPicker = null;
        this.fontPicker = null;
        this.sizePicker = null;
        this.imageInput = null;
    }

    connectedCallback() {
        const width = this.getAttribute("width");
        const height = this.getAttribute("height");

        this.build(width, height);
        this.start();
    }

    build(w, h) {
        this.innerHTML = `
<style>
    button {
        background-color: transparent;
    }
    .b-editor-hover-transition:hover{
        background-color: #2043aa;
        transition: all 0.3s linear 0s;
    }
</style>`;

        const ta = this.buildEditor(w, h);

        const controls = this.buildControls(w);
        this.appendChild(controls);

        this.appendChild(ta);
    }

    buildControls(w) {
        const controls = document.createElement("div");
        controls.style.boxSizing = "border-box";
        controls.style.borderBottom = "none";
        controls.style.padding = "10px";
        controls.style.background = "#2e60f4";
        controls.style.color = "white";
        controls.style.borderRadius = "8px 8px 0 0";
        controls.style.width = w;
        controls.style.margin = "0 auto";

        this.addControlButton(controls, "Bold", "<b>B</b>");
        this.addControlButton(controls, "Italic", "<em>I</em>");
        this.addControlButton(controls, "Superscript", "X<sup>2</sup>");
        this.addControlButton(controls, "Subscript", "X<sub>2</sub>");
        this.addControlButton(controls, "Strikethrough", "<s>abc</s>");
        this.addControlButton(controls, "Numbered list", "(i)");
        this.addControlButton(controls, "Bulleted list", "&bull;");

        const cp = this.colorPicker = document.createElement("input");
        cp.type = "color";
        cp.title = "font color";
        cp.style.border = "none";
        cp.style.outline = "none";
        cp.style.backgroundColor = "transparent";
        controls.appendChild(cp);

        const fonts = this.fontPicker = document.createElement("select");
        [
            "Times New Roman",
            "Consolas",
            "Tahoma",
            "monospace",
            "cursive",
            "sans-serif",
            "Calibri"
        ].forEach((font) => {
            const option = document.createElement("option");
            option.value = font;
            option.innerText = font;
            option.style.fontFamily = font;
            fonts.append(option);
        });
        controls.append(fonts);

        const sizes = this.sizePicker = document.createElement("select");
        for(let i=1; i<10; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.innerText = i.toString();
            if(i === 3) option.selected = true;
            sizes.appendChild(option);
        }
        controls.appendChild(sizes);

        this.addControlButton(controls, "Create link", "Link");
        this.addControlButton(controls, "Remove link", "Unlink");

        const input = this.imageInput = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";

        this.addControlButton(controls, "Insert image", "Image");
        this.addControlButton(controls, "Undo", "←");
        this.addControlButton(controls, "Redo", "→");

        return controls;
    }

    buildEditor(w, h) {
        const ta = document.createElement("div");
        ta.style.width = w;
        ta.style.height = h;
        ta.style.margin = "0 auto";
        ta.style.boxSizing = "border-box";
        ta.style.border = "2px solid #2e60f4";

        const iframe = this.iframe = document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = w;
        iframe.style.height = h;

        ta.appendChild(iframe);

        return ta;
    }

    addControlButton(parent, title, innerHTML) {
        const btn = document.createElement("button");
        btn.title = title;
        btn.innerHTML = innerHTML;

        btn.className = "b-editor-hover-transition";

        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.outline = "none";
        btn.style.cursor = "pointer";
        parent.appendChild(btn);

        this.controlButtons[title] = btn;
    }

    start() {
        const editor = this.editor = this.iframe.contentWindow.document;
        editor.designMode = "on";

        this.controlButtons["Bold"].onclick = this.cmd("Bold");
        this.controlButtons["Italic"].onclick = this.cmd("Italic");
        this.controlButtons["Superscript"].onclick = this.cmd("Superscript");
        this.controlButtons["Subscript"].onclick = this.cmd("Subscript");
        this.controlButtons["Strikethrough"].onclick = this.cmd("Strikethrough");

        this.controlButtons["Numbered list"].onclick = this.cmd("InsertOrderedList", false,
            "newOL" + Math.round(Math.random() * 1000));
        this.controlButtons["Bulleted list"].onclick = this.cmd("InsertUnorderedList", false,
            "newUL" + Math.round(Math.random() * 1000));

        this.colorPicker.onchange = (e) => this.cmd("ForeColor", false, e.target.value)();
        this.fontPicker.onchange = (e) => this.cmd("FontName", false, e.target.value)();
        this.sizePicker.onchange = (e) => this.cmd("FontSize", false, e.target.value)();

        this.imageInput.onchange = () => {
            const i = this.imageInput;
            if (i.files && i.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    editor.body.focus();
                    const imgHTML = "<img width='500px'  src='" + e.target.result + "'/>";
                    editor.execCommand("insertHTML", false, imgHTML);
                };
                reader.readAsDataURL(i.files[0]);
                i.value = "";
            }
        };

        this.controlButtons["Create link"].onclick = () =>
            this.cmd("CreateLink", false, prompt("Enter a URL", "https://"))();
        this.controlButtons["Remove link"].onclick = this.cmd("UnLink");
        this.controlButtons["Insert image"].onclick = () => this.imageInput.click();
        this.controlButtons["Undo"].onclick = this.cmd("undo");
        this.controlButtons["Redo"].onclick = this.cmd("redo");
    }

    cmd(id, showUi, value) {
        const editor = this.editor;
        return function () {
            console.log(id);
            editor.execCommand(id, showUi, value);
        }
    }
}

customElements.define('b-editor', BeritamusEditor);