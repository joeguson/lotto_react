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

        if(this.youtublog === '1') this.addControlButton(controls, "Youtube", "Y");

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
        if(this.youtublog === '1') this.controlButtons["Youtube"].onclick = () => { this.__onYoutubeClick(); };

        this.colorPicker.onchange = (e) => this.cmd("ForeColor", false, e.target.value)();
        this.fontPicker.onchange = (e) => this.cmd("FontName", false, e.target.value)();
        this.sizePicker.onchange = (e) => this.cmd("FontSize", false, e.target.value)();
        this.imageInput.onchange = (e) => { this.__onImgClick(); };

        this.controlButtons["Create link"].onclick = () =>{
            this.__onLinkClick();
            // //modal로 다시 표현해서 meta tag 정보 가져오기
            // this.cmd("CreateLink", false, prompt("Enter a URL", "www."))();
        };

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

        this.youtubeIdDialog.onConfirmCallback = (youtubeId) => {
            this.youtubeDialog.showModal(youtubeId);
        };

        this.youtubeDialog.onConfirmCallback = (data) => {
            const table = document.createElement('table');
            const youtubeIframe = document.createElement('iframe');
            youtubeIframe.src = "https://www.youtube.com/embed/" + data.youtubeId + "?";
            youtubeIframe.id = data.youtubeId;

            data.times.forEach(e => {
                let row = document.createElement('tr');
                let time = document.createElement('td');
                let desc = document.createElement('td');

                let buttonTag = document.createElement('button');
                let spanTag = document.createElement('span');

                buttonTag.innerHTML = e.hour + e.minute + e.second;
                console.log(data.youtubeId);
                console.log(data.times);
                buttonTag.setAttribute('onclick', `changeStartTime("${data.youtubeId}", "${e.hour + e.minute + e.second}");`);
                spanTag.innerHTML = e.desc;

                time.appendChild(buttonTag);
                desc.appendChild(spanTag);
                row.appendChild(time);
                row.appendChild(desc);
                table.appendChild(row);
            });
            const youtubeHTML = youtubeIframe.outerHTML;
            const timeTable = table.outerHTML;
            this.editor.body.focus();
            this.editor.execCommand("insertHTML", false, youtubeHTML);
            this.editor.execCommand("insertHTML", false, timeTable);
        };
    }

    cmd(id, showUi, value) {
        const editor = this.editor;
        return function () {
            editor.execCommand(id, showUi, value);
        }
    }

    __onImgClick(){
        const i = this.imageInput;
        const rot = this.rotateImage;
        if (i.files && i.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.editor.body.focus();
                var img = document.createElement("img");
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
                    const imgHTML = "<img style='overflow:auto;' onclick='__rotateImage(this);' class='rotate000' src='" + dataurl +"'/>";
                    this.editor.execCommand("insertHTML", false, imgHTML);
                }
            };
            reader.readAsDataURL(i.files[0]);
            i.value = "";
        }
    }

    __onLinkClick(){
        this.linkDialog.showModal();
        const linkInput = document.getElementById('linkInput');
        const linkButton = document.getElementById('linkButton');
        linkButton.addEventListener('click', () => {
            let data = {"urlSource" : linkInput.value}
            let url = '/api/opengraph';
            console.log(data);
            getUrlOpengraph(url, data);
            async function getUrlOpengraph(url, data){
                let ajaxResult = await makeRequest('post', url, data);
                ajaxResult = JSON.parse(ajaxResult);
                console.log(ajaxResult.ogs.data.ogUrl);
                console.log(ajaxResult.ogs.data.ogDescription);
                console.log(ajaxResult.ogs.data.ogImage);
            }
        });
    }

    __onYoutubeClick() {
        this.youtubeIdDialog.showModal();
    }

}

customElements.define('b-editor', BeritamusEditor);
