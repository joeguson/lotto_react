  class BeritamusEditor extends HTMLElement {
    constructor() {
        super();
        this.editor = null;
        this.btnGradient = {};
        this.controlButtons = {};
        this.colorPicker = null;
        this.fontPicker = null;
        this.sizePicker = null;
        this.imageInput = null;
        this.youtubeTime = null;
        this.youtubeIdDialog = null;
        this.youtubeDialog = null;
    }

    // returns content as html tags
    value() {
        return this.editor.body.innerHTML;
    }

    // returns content as plain-text
    text() {
        return this.value()
            .replace(/(<br>|<div>|<\/div>)/g, "\n")  // replace new lines
            .replace(/<[^<>]+>/g, "");  // remove html tags
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

        this.youtubeIdDialog = this.buildYoutubeIdDialog(w, h);
        this.appendChild(this.youtubeIdDialog);

        this.youtubeDialog = this.buildYoutubeDialog(w, h);
        this.appendChild(this.youtubeDialog);
    }

    buildControls(w) {
        const controls = document.createElement("div");
        controls.style.textAlign = "center";
        controls.style.boxSizing = "border-box";
        controls.style.borderBottom = "none";
        controls.style.padding = "8px";
        controls.style.background = "#0f4c81";
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
        this.addControlButton(controls, "AlignCenter", "Center");
        this.addControlButton(controls, "AlignLeft", "Left");
        this.addControlButton(controls, "AlignRight", "Right");

        const cp = this.colorPicker = document.createElement("input");
        cp.type = "color";
        cp.title = "font color";
        cp.style.border = "none";
        cp.style.outline = "none";
        cp.style.backgroundColor = "transparent";
        cp.style.padding = "5px 0 0 0";
        cp.style.margin = "3px 5px 0 0";
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
        input.style.display = "block";

        this.addControlButton(controls, "Insert image", "Image");
        this.addControlButton(controls, "Undo", "←");
        this.addControlButton(controls, "Redo", "→");

        this.addControlButton(controls, "Youtube", "Y");

        return controls;
    }

    buildEditor(w, h) {
        const ta = document.createElement("div");
        ta.style.width = w;
        ta.style.height = h;
        ta.style.margin = "0 auto";
        ta.style.boxSizing = "border-box";
        ta.style.border = "1px solid #0f4c81";

        const iframe = this.iframe = document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = '100%';
        iframe.style.height = h;
        iframe.style.padding = '10px';
        iframe.id="iframe";
        ta.appendChild(iframe);

        return ta;
    }

    buildYoutubeIdDialog(w, h) {
        const dialog = document.createElement("dialog");
        dialog.style.margin = "auto";

        const div = document.createElement("div");
        {
            const idInput = document.createElement("input");
            idInput.style.display = "block";
            div.appendChild(idInput);

            const button = document.createElement("button");
            idInput.style.display = "block";
            button.innerText = "button";
            button.onclick = () => this.showYoutubeDialog(idInput.value);
            div.appendChild(button);
        }
        dialog.appendChild(div);

        return dialog;
    }

    buildYoutubeDialog(w, h) {
        const dialog = document.createElement("dialog");
        dialog.style.margin = "auto";
        const div = document.createElement("div");
        {
            const iframe = document.createElement("iframe");
            iframe.width = "560";
            iframe.height = "315";
            iframe.frameBorder = "0";
            // iframe.allowFullscreen = true;
            div.appendChild(iframe);
            dialog.iframe = iframe;

            const times = document.createElement("div");
            {
                const p = document.createElement("button");
                times.appendChild(p);
                p.innerText = "+";
                p.onclick = () => {
                    const c = this.__newYoutubeTimeDescriptionCard((card) => {
                        times.removeChild(c);
                    });
                    times.insertBefore(c, p);
                }
            }
            div.appendChild(times);

            const confirm = document.createElement("button");
            confirm.innerText = "confirm";

            confirm.onclick = () => {
                this.youtubeDialog.iframe.style.width = "100%";
                const youtubeHTML = this.youtubeDialog.iframe.outerHTML;
                this.youtubeDialog.close();
                this.youtubeIdDialog.close();
                this.editor.body.focus();
                this.editor.execCommand("insertHTML", false, youtubeHTML);
            };
            div.appendChild(confirm);
        }
        dialog.appendChild(div);
        return dialog;
    }

    showYoutubeDialog(youtubeUrl) {
        let youtubeId = (youtubeUrl.split('='))[1];
        this.youtubeDialog.iframe.src = "https://www.youtube.com/embed/" + youtubeId + "?start=1";
        this.youtubeDialog.showModal();
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
        btn.style.padding = "3px";
        btn.style.margin = "0 5px";
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
        this.controlButtons["AlignCenter"].onclick = this.cmd("JustifyCenter");
        this.controlButtons["AlignRight"].onclick = this.cmd("JustifyRight");
        this.controlButtons["AlignLeft"].onclick = this.cmd("JustifyLeft");

        this.controlButtons["Numbered list"].onclick = this.cmd("InsertOrderedList", false,
            "newOL" + Math.round(Math.random() * 1000));
        this.controlButtons["Bulleted list"].onclick = this.cmd("InsertUnorderedList", false,
            "newUL" + Math.round(Math.random() * 1000));

        this.controlButtons["Youtube"].onclick = () => { this.__onYoutubeClick(); };

        this.colorPicker.onchange = (e) => this.cmd("ForeColor", false, e.target.value)();
        this.fontPicker.onchange = (e) => this.cmd("FontName", false, e.target.value)();
        this.sizePicker.onchange = (e) => this.cmd("FontSize", false, e.target.value)();
        this.imageInput.onchange = () => {
            const i = this.imageInput;
            const rot = this.rotateImage;
            if (i.files && i.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    editor.body.focus();
                    var img = document.createElement("img");
                    img.src = e.target.result;
                    img.onload = function(){
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        var MAX_WIDTH = 800;
                        var MAX_HEIGHT = 800;
                        var width = img.width;
                        var height = img.height;
                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);
                        var dataurl = canvas.toDataURL("image/png");
                        const imgHTML = "<img width='90%' style='overflow:auto;' onclick='__rotateImage(this);' class='rotate000' src='" + dataurl +"'/>";
                        console.log(typeof(imgHTML));
                        editor.execCommand("insertHTML", false, imgHTML);
                    }
                };
                reader.readAsDataURL(i.files[0]);
                i.value = "";
            }
        };

        this.controlButtons["Create link"].onclick = () =>
            this.cmd("CreateLink", false, prompt("Enter a URL", "www."))();
        this.controlButtons["Remove link"].onclick = this.cmd("UnLink");
        this.controlButtons["Insert image"].onclick = () => this.imageInput.click();
        this.controlButtons["Undo"].onclick = this.cmd("undo");
        this.controlButtons["Redo"].onclick = this.cmd("redo");

        const js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "../../public/b-editor/__b-editor.js";
        editor.head.append(js);

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "../../public/b-editor/__b-editor.css";
        editor.head.append(css);
    }

    cmd(id, showUi, value) {
        const editor = this.editor;
        return function () {
            editor.execCommand(id, showUi, value);
        }
    }

    __onYoutubeClick() {
        this.youtubeIdDialog.showModal();
    }

    __newYoutubeTimeDescriptionCard(minusCallback) {
        const c = document.createElement("div");
        c.style.display = "flex";
        const d = document.createElement("b-youtube-time");
        c.appendChild(d);
        const b = document.createElement("button");
        b.innerText = "-";
        b.onclick = () => { minusCallback(c);};
        c.appendChild(b);

        return c;
    }
}

customElements.define('b-editor', BeritamusEditor);
