class BeritamusDialog extends HTMLElement{
    constructor() {
        super();
        this.dialog = null;
        this.content = null;
        this.control = null;

        this.contentAreaBuilder = null;
        this.buttonAreaBuilder = null;
    }

    connectedCallback() {
        this.__build();
    }

    __build(){
        this.dialog = document.createElement("dialog");
        this.dialog.appendChild(this.__buildContentArea());
        this.dialog.appendChild(this.__buildButtonArea());
        this.dialog.style.margin = "auto";
        this.dialog.className = "dialogForm";
        this.appendChild(this.dialog);
    }

    __buildContentArea() {
        this.content = document.createElement("div");
        this.content.className = "dialogContent";

        if (this.contentAreaBuilder != null) {
            const content = this.contentAreaBuilder();
            this.content.appendChild(content);
        }

        return this.content;
    }

    __buildButtonArea() {
        this.control = document.createElement("div");
        this.control.className = "dialogButton";

        if(this.buttonAreaBuilder != null){
            const button = this.buttonAreaBuilder();
            this.control.appendChild(button);
        }

        return this.control;
    }

    showModal(){
        this.dialog.showModal();
    }
}

customElements.define('b-dialog', BeritamusDialog);
