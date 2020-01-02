class BeritamusComAndAns extends HTMLElement {
    constructor() {
        super();
        this.src = null;
        this.loginId = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.loginId = JSON.parse(this.getAttribute("jsonLogin"));
        this.__build();
    }

    __build() {
        const dl = document.createElement("dl");

        dl.className = "caCommentDl";

        dl.appendChild(this.__buildComAns());
        this.appendChild(dl);
    }

    __buildComAns() {
        const type = this.src.identifier === 'p'? 'comment' : 'tandya';
        const user = this.loginId.id;

        const caCommentDt = document.createElement("dt");
        const caCommentDd = document.createElement("dd");

        caCommentDt.className = "comAnsDt";
        caCommentDd.className = "comAnsDd";

        //inside caCommentDt
        const pre = document.createElement("pre");
        pre.innerText = this.src.content;
        caCommentDt.appendChild(pre);

        //inside caCommentDd
        caCommentDd.innerText = this.src.date;
        const warnButton = document.createElement("button");
        value='t/tac/'+ac.id onclick="warningAjax(this);"
        warnButton.setAttribute('value', 't/tac/'+this.src.id);

        caCommentDt.appendChild(pre);

        //dt - content, warnbutton, edit
        //dd1 - by, date, like count, likebutton
        //dd2 - cc text area
        //dd3 - cc

        const title = document.createElement("a");
        title.href = `/${type}/${this.src.id}`;
        title.innerText = this.src.identifier === 'p'? this.src.title : this.src.question;
        dt.appendChild(title);
        article.appendChild(dt);

        const content = document.createElement("dd");
        content.className = "ddcontent";
        content.innerText = this.src.thumbnail;
        article.appendChild(content);

        const hashtag = document.createElement("dd");
        hashtag.innerText = this.src.hashtags.map(e => `#${e.hash}`).join(' ');
        article.appendChild(hashtag);

        const date = document.createElement("dd");
        date.innerText = this.src.date + ' / ' + this.src.view + ' views';
        article.appendChild(date);
        li.appendChild(this.__buildCc());
        return article;
    }

    __buildCc() {
        const ccDl = document.createElement("dl");
        const ccDt = document.createElement("dt");
        const ccDd = document.createElement("dd");
    }
}

customElements.define('b-comAndAns', BeritamusComAndAns);
