class BeritamusMyThumbnail extends HTMLElement {
    constructor() {
        super();
        this.src = null;
        this.dl = null;
        this.div = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__build();
    }

    __build() {
        let type = '';
        if(this.src.identifier === 'p') type = 'penobrol';
        else if(this.src.identifier === 't') type = 'tandya';
        else type = 'youtublog';

        const li = document.createElement("li");
        li.appendChild(this.__buildLike());
        li.appendChild(this.__buildArticle(type));
        li.className = "thumbnailLi";

        const br = document.createElement("br");
        br.className = "clear";
        li.appendChild(br);
        li.onclick = () => {
            location.href = `${type}`+'/'+`${this.src.id}`;
        };
        this.appendChild(li);
    }

    __buildLike() {
        const likeDiv = document.createElement("div");
        const likeImg = document.createElement("img");
        const likeNum = document.createElement("span");

        likeDiv.className = "thumbnailLikeDiv";
        {
            likeImg.className = "thumbnailLikeImg";
            likeImg.src = this.src.likeCount ? 'icons/highlight_ed.png' : 'icons/highlight.png';
            likeImg.style.height = '24px';

            likeNum.style.marginLeft = '5px';
            likeNum.innerHTML = this.src.likeCount;
        }
        likeDiv.appendChild(likeImg);
        likeDiv.appendChild(likeNum);

        return likeDiv;
    }

    __buildArticle(type) {
        this.dl = document.createElement("dl");
        this.dl.className = "thumbnailDl";
        this.dl.onclick = () => {
            location.href = `${type}`+'/'+`${this.src.id}`;
        };

        const dt = document.createElement("dt");
        dt.className = "thumbnailDt";
        const title = document.createElement("a");
        title.href = `${type}`+'/'+`${this.src.id}`;
        title.innerText = this.src.identifier === 't'? this.src.question : this.src.title;
        dt.appendChild(title);
        this.dl.appendChild(dt);

        if(this.src.hashtags){
            const hashtag = document.createElement("dd");
            hashtag.className = "hashtag";
            this.src.hashtags.forEach((hash) => {
                const temp = document.createElement('span');
                temp.innerHTML = '#'+hash.hash+'  ';
                temp.style.backgroundColor = "#f4f5f0";
                hashtag.appendChild(temp);
            });
            this.dl.appendChild(hashtag);
        }

        const date = document.createElement("dd");
        date.className = "dddate";
        date.innerText = this.src.identifier === 't'? this.src.replyCount + ' answers': this.src.replyCount +' comments';
        date.innerText = date.innerText +  ' | ' + this.src.date + ' | ' + this.src.view + ' views';
        this.dl.appendChild(date);

        return this.dl;
    }
}

customElements.define('b-my-thumbnail', BeritamusMyThumbnail);
