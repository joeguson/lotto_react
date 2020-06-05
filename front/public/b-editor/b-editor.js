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
        this.linkDialog = null;
        this.youtubeIdDialog = null;
        this.youtubeDialog = null;
        this.youtublog = null;
        this.youtubes = [];
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
        //to determine whether this editor is for youtublog or not
        this.youtublog = this.getAttribute("youtublog");
        this.build(width, height);
        this.start();
    }

    build(w, h) {
        const ta = this.buildEditor(w, h);
        const controls = this.buildControls(w);
        this.appendChild(controls);
        this.appendChild(ta);

        this.linkDialog = document.createElement("b-link-dialog");
        this.appendChild(this.linkDialog);

        this.youtubeIdDialog = document.createElement("b-youtube-id-dialog");
        this.appendChild(this.youtubeIdDialog);

        this.youtubeDialog = document.createElement("b-youtube-dialog");
        this.appendChild(this.youtubeDialog);

    }

    buildControls(w) {
        const controlContainer = document.createElement("div");
        const controlSection1= document.createElement("div");
        const controlSection2= document.createElement("div");
        const controlSection3= document.createElement("div");
        const controlSection4= document.createElement("div");
        const controlSection5= document.createElement("div");
        const controlSection6= document.createElement("div");
        controlContainer.className = 'controlContainer';
        controlSection1.className = 'controlSection';
        controlSection2.className = 'controlSection';
        controlSection3.className = 'controlSection';
        controlSection4.className = 'controlSection';
        controlSection5.className = 'controlSection';
        controlSection6.className = 'controlSection';
        controlContainer.style.width = w;

        //controlSection1 = font appearance
        this.addControlButton(controlSection1, "Bold", "<b>Bold</b>");
        this.addControlButton(controlSection1, "Italic", "<em>Italic</em>");
        this.addControlButton(controlSection1, "Strikethrough", "<s>abcd</s>");

        //controlSection2 = font align
        this.addControlButton(controlSection2, "AlignLeft", "left");
        this.addControlButton(controlSection2, "AlignCenter", "center");
        this.addControlButton(controlSection2, "AlignRight", "right");

        //controlSection3 = font color
        const cp = this.colorPicker = document.createElement("input");
        cp.className= 'color-control';
        cp.type = "color";
        cp.title = "font color";
        controlSection3.appendChild(cp);

        //controlSection4 = font style & size
        const fonts = this.fontPicker = document.createElement("select");
        fonts.className = 'font-control';
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

        const sizes = this.sizePicker = document.createElement("select");
        for(let i=1; i<10; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.innerText = i.toString();
            if(i === 3) option.selected = true;
            sizes.appendChild(option);
        }
        sizes.className = 'size-control';
        controlSection4.appendChild(sizes);
        controlSection4.append(fonts);

        //controlSection5 = Link, Image, Youtublog
        this.addControlButton(controlSection5, "Create link", "<u>link</u>");
        const input = this.imageInput = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "block";
        this.addControlButton(controlSection5, "Insert image", "image");
        if(this.youtublog === '1') this.addControlButton(controlSection5, "Youtube", "Youtublog");

        //controlSection6 = undo forward
        this.addControlButton(controlSection6, "Undo", "←");
        this.addControlButton(controlSection6, "Redo", "→");

        controlContainer.appendChild(controlSection1);
        controlContainer.appendChild(controlSection2);
        controlContainer.appendChild(controlSection3);
        controlContainer.appendChild(controlSection4);
        controlContainer.appendChild(controlSection5);
        controlContainer.appendChild(controlSection6);

        // this.addControlButton(control1, "Superscript", "X<sup>2</sup>");
        // this.addControlButton(control1, "Subscript", "X<sub>2</sub>");
        // this.addControlButton(control1, "Numbered list", "(i)");
        // this.addControlButton(control1, "Bulleted list", "&bull;");
        return controlContainer;
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

    addControlButton(parent, title, innerHTML) {
        const btn = document.createElement("button");
        btn.title = title;
        btn.innerHTML = innerHTML;
        btn.className = "b-editor-button";
        parent.appendChild(btn);

        this.controlButtons[title] = btn;
    }

    start() {
        const editor = this.editor = this.iframe.contentWindow.document;
        editor.designMode = "on";
        this.controlButtons["Bold"].onclick = this.cmd("Bold");
        this.controlButtons["Italic"].onclick = this.cmd("Italic");
        this.controlButtons["Strikethrough"].onclick = this.cmd("Strikethrough");
        this.controlButtons["AlignCenter"].onclick = this.cmd("JustifyCenter");
        this.controlButtons["AlignRight"].onclick = this.cmd("JustifyRight");
        this.controlButtons["AlignLeft"].onclick = this.cmd("JustifyLeft");
        if(this.youtublog === '1') this.controlButtons["Youtube"].onclick = () => { this.__onYoutubeClick(); };
        this.colorPicker.onchange = (e) => this.cmd("ForeColor", false, e.target.value)();
        this.fontPicker.onchange = (e) => this.cmd("FontName", false, e.target.value)();
        this.sizePicker.onchange = (e) => this.cmd("FontSize", false, e.target.value)();
        this.imageInput.onchange = (e) => { this.__onImgClick(); };
        this.controlButtons["Create link"].onclick = () =>{this.__onLinkClick();};
        this.controlButtons["Insert image"].onclick = () => this.imageInput.click();
        this.controlButtons["Undo"].onclick = this.cmd("undo");
        this.controlButtons["Redo"].onclick = this.cmd("redo");

        const js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "../../public/b-editor/__b-editor.js";
        editor.head.append(js);

        const blink = document.createElement("script");
        blink.type = "text/javascript";
        blink.src = "../../public/b-link/b-link.js";
        editor.head.append(blink);

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "../../public/b-editor/__b-editor.css";
        editor.head.append(css);

        this.linkDialog.onConfirmCallback = (linkAddress) => {
            let data = {"urlSource" : linkAddress};
            let url = 'api/opengraph';
            makeRequest('post', url, data)
                .then((sent) => {
                    let result = JSON.parse(sent);
                    let ogData = {
                        url : result.ogs.data['ogUrl'],
                        img : result.ogs.data.ogImage.url,
                        imgWidth : result.ogs.data.ogImage.width,
                        imgHeight : result.ogs.data.ogImage.height,
                        title : result.ogs.data.ogTitle,
                        desc : result.ogs.data.ogDescription
                    };
                    const linkDiv = document.createElement('b-link');
                    linkDiv.contentEditable = "false";
                    linkDiv.setAttribute('jsonSrc', JSON.stringify(ogData));
                    let linkDivHTML  = linkDiv.outerHTML;
                    linkDiv.style.margin = "0 auto";
                    editor.body.focus();
                    editor.execCommand('insertHTML', false, linkDivHTML);
                });
        };

        this.youtubeIdDialog.onConfirmCallback = (youtubeId) => {
            this.youtubeDialog.showModal(youtubeId);
        };

        this.youtubeDialog.onConfirmCallback = (id) => this.__onYoutubeAdd(id);
        // this.controlButtons["Numbered list"].onclick = this.cmd("InsertOrderedList", false,
        //     "newOL" + Math.round(Math.random() * 1000));
        // this.controlButtons["Bulleted list"].onclick = this.cmd("InsertUnorderedList", false,
        //     "newUL" + Math.round(Math.random() * 1000));
        // this.controlButtons["Superscript"].onclick = this.cmd("Superscript");
        // this.controlButtons["Subscript"].onclick = this.cmd("Subscript");
    }

    cmd(id, showUi, value) {
        const editor = this.editor;
        return function () {
            editor.execCommand(id, showUi, value);
        }
    }

    __onImgClick(){
        const i = this.imageInput;
        if (i.files && i.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.editor.body.focus();
                let img = document.createElement("img");
                img.src = e.target.result.toString();
                img.onload = () => {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    let MAX_WIDTH = this.editor.body.offsetWidth;
                    let MAX_HEIGHT = this.editor.body.offsetWidth;
                    let width = img.width;
                    let height = img.height;
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
                    ctx.drawImage(img, 0, 0, width, height);
                    let dataurl = canvas.toDataURL("image/png");
                    const imgHTML = `<img style='overflow:auto; width:90%; margin: 0 auto;' src='` + dataurl +`'/>`;
                    this.editor.execCommand("insertHTML", false, imgHTML);
                }
            };
            reader.readAsDataURL(i.files[0]);
            i.value = "";
        }
    }

    __onLinkClick(){this.linkDialog.showModal();}

    __onYoutubeClick() {this.youtubeIdDialog.showModal();}

    __onYoutubeAdd(id) {
        this.youtubes.push(id);

        const tagId = 'embed-' + id;

        const embed = document.createElement('iframe');
        embed.id = tagId;
        embed.src = '/youtublog/embed/' + id;
        embed.style.border = 'none';
        embed.style.width = '100%';

        const embedHTML = embed.outerHTML;
        this.editor.body.focus();
        this.editor.execCommand('insertHTML', false, embedHTML);

        const iframe = this.editor.getElementById(tagId);
        iframe.onload = () => {
            const content = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
            iframe.height = content.body.scrollHeight;
        };
    }

}

customElements.define('b-editor', BeritamusEditor);
