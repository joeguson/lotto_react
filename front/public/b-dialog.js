class BeritamusDialog extends HTMLElement{
    constructor(enableConfirmButton = true, enableCancelButton = true) {
        super();
        this.__dialog = null;
        this.__content = null;
        this.__control = null;
        this.contentAreaBuilder = null;
        this.__enableConfirmButton = enableConfirmButton;
        this.__enableCancelButton = enableCancelButton;
    }

    connectedCallback() {
        this.__build();
    }

    __build(){
        this.__dialog = document.createElement("dialog");
        this.__dialog.appendChild(this.__buildContentArea());
        this.__dialog.appendChild(this.__buildButtonArea());
        this.__dialog.style.margin = "auto";
        this.__dialog.style.width = "50%";
        this.__dialog.className = "dialogForm";
        this.appendChild(this.__dialog);
    }

    __buildContentArea() {
        this.__content = document.createElement("div");
        this.__content.className = "dialogContent";

        if (this.contentAreaBuilder != null) {
            const content = this.contentAreaBuilder();
            this.__content.appendChild(content);
        }

        return this.__content;
    }

    __buildButtonArea() {
        this.__control = document.createElement("div");
        this.__control.className = "dialogButton";

        if(this.__enableCancelButton){
            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'cancel';
            cancelButton.onclick = () =>{ this.onCancel();};
            this.__control.appendChild(cancelButton);
        }

        if(this.__enableConfirmButton){
            const confirmButton = document.createElement('button');
            confirmButton.innerText = 'confirm';
            confirmButton.onclick = () =>{ this.onConfirm();};
            this.__control.appendChild(confirmButton);
        }

        return this.__control;
    }
    onConfirm(){
        this.__dialog.close();
    }
    onCancel(){
        this.__dialog.close();
    }

    showModal(){
        this.__dialog.showModal();
    }
}

customElements.define('b-dialog', BeritamusDialog);
