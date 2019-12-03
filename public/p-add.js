function postPenobrolAdd() {
    const title = document.getElementById('title').value;
    const public = document.getElementById('rbP').checked ? 'p' : 'a';
    const content = document.getElementById('editor').value();
    const hashtag = document.getElementById('hashtag').value;
    
    const req = {
        'title': title,
        'public': public,
        'content': content,
        'hashtag': hashtag
    };
    
    const parsed = parseImgTags(content);
    console.log('Content', parsed.content);
    console.log('Images', parsed.imgs);
}

function parseImgTags(content) {
    var id = 1;
    var imgIndex = 0;
    
    var imgMaps = {};
    var posMaps = {};
    
    while(true) {
        // <img
        imgIndex = content.indexOf('<img', imgIndex);
        if(imgIndex == -1) break;
        
        // src="
        const srcIndex = content.indexOf('src=\"', imgIndex);
        // data
        const dataIndex = srcIndex + 5;
        // ">
        const endIndex = content.indexOf('\">', imgIndex);
        
        const data = content.substring(dataIndex, endIndex);
        
        posMaps[id] = {s: dataIndex, e: endIndex};
        imgMaps[id] = data;
        id++;
        
        imgIndex = endIndex;
    }
    
    for(--id; id >= 1; id--) {
        const prev = content.substring(0, posMaps[id].s);
        const post = content.substring(posMaps[id].e);
        content = prev + id.toString() + post;
    }
    
    return {
        content: content,
        imgs: imgMaps
    };
}