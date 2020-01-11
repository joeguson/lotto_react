class BeritamusThumbnail extends HTMLElement {
    constructor() {
        super();
        this.src = null;
        this.dl = null;
        this.img = null;
        this.div = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__build();
        this.__start();
    }
    __start(){
        if(this.img){
            // this.dl.onload = () => {
            //     console.log(this.dl.offsetHeight);
            // };
            this.img.onload = () => {
                var src = this.src;
                var img = this.img;
                var div = this.div;
                var diff = 0;
                if(img.height <= img.width){
                    if(src.img.rotate == 'rotate090' || src.img.rotate =='rotate270'){
                        img.style.width = this.dl.offsetHeight + 'px';
                        if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                            diff = Math.abs(img.width - img.height)/2;
                            img.style.marginTop = diff+"px";
                            img.style.marginBottom = diff+"px";
                        }
                        else{
                            img.style.marginTop = '0px';
                            img.style.marginBottom = '0px';
                        }
                        img.className = src.img.rotate;
                        div.style.height = this.dl.offsetHeight + 'px';
                    }
                    else{
                        img.style.width = div.offsetWidth + 'px';
                        img.className = this.src.img.rotate;
                    }
                }
                else{
                    if(src.img.rotate == 'rotate090' || src.img.rotate =='rotate270'){
                        img.style.height = this.dl.offsetHeight + 'px';
                        img.className = src.img.rotate;
                        div.style.height = this.dl.offsetHeight + 'px';
                    }
                    else{
                        img.style.height = this.dl.offsetHeight + 'px';
                        img.className = this.src.img.rotate;
                    }

                }


                // if(img.height <= img.width){
                //     if(img.className == 'rotate090' || img.className =='rotate270'){ //가로가 세로가 됨. 가로를 높이에 맞춤
                //         div.style.height = this.dl.offsetHeight + 'px';
                //         img.style.width = this.dl.offsetHeight + 'px';
                //     }
                //     else{//가로는 가로. 가로를 길이에 맞춤
                //         img.style.width = div.offsetWidth + 'px';
                //     }
                // }
                // else{
                //     if(img.className == 'rotate090' || img.className =='rotate270'){//세로가 가로가 됨. 세로를 가로에 맞춤
                //         div.style.height = this.dl.offsetHeight + 'px';
                //         img.style.height = div.offsetWidth + 'px';
                        // if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                        //     diff = Math.abs(img.width - img.height);
                        //     img.style.marginTop = diff+"px";
                        //     img.style.marginBottom = diff+"px";
                        // }
                        // else{
                        //     img.style.marginTop = '0px';
                        //     img.style.marginBottom = '0px';
                        // }
                //     }
                //     else{//세로 맞추기
                //         img.style.height = this.dl.offsetHeight + 'px';
                //     }
                //
                // }
            };
        }
        // if(this.img){
        //     this.img.onload = function(){
        //         console.log(this);
        //         console.log(this.img.height);
        //     };
        // }
    }
    __build() {
        const li = document.createElement("li");
        li.appendChild(this.__buildArticle());
        li.appendChild(this.__buildImage());
        li.className = "thumbnailLi"

        const br = document.createElement("br");
        br.className = "clear";
        li.appendChild(br);
        this.appendChild(li);
    }
    __buildArticle() {
        const type = this.src.identifier === 'p'? 'penobrol' : 'tandya';
        this.dl = document.createElement("dl");
        this.dl.className = "articleDl";
        this.dl.onclick = () => {
            location.href = `${type}/${this.src.id}`;
        };

        const dt = document.createElement("dt");
        const title = document.createElement("a");
        title.href = `/${type}/${this.src.id}`;
        title.innerText = this.src.identifier === 'p'? this.src.title : this.src.question;
        dt.appendChild(title);
        this.dl.appendChild(dt);

        const content = document.createElement("dd");
        content.className = "ddcontent";
        content.innerText = this.src.thumbnail;
        this.dl.appendChild(content);

        const hashtag = document.createElement("b-hashtag");
        hashtag.className = "hashtag"
        hashtag.setAttribute("jsonSrc", JSON.stringify(this.src.hashtags));
        this.dl.appendChild(hashtag);

        const date = document.createElement("dd");
        date.innerText = this.src.date + ' / ' + this.src.view + ' views';
        this.dl.appendChild(date);

        return this.dl;
    }

    __buildImage() {
        this.div = document.createElement("div");
        this.div.className = "articleImage"
        if(this.src.img) {
            this.img = document.createElement("img");
            this.img.src = this.src.img.src;
            // this.img.className = this.src.img.rotate;
            this.div.appendChild(this.img);
        }
        return this.div;
    }
}

customElements.define('b-thumbnail', BeritamusThumbnail);
