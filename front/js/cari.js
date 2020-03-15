
let loadMore = function() {
    makeRequest('GET', 'api/cari')
        .then(result => {
            result = JSON.parse(result);
            let randomUl = document.getElementById('uls');
            result.map((data) => {
                let lis = document.createElement("b-thumbnail");
                lis.setAttribute("jsonSrc", JSON.stringify(data));
                return lis;
            }).forEach((li) => { randomUl.appendChild(li); });
        })
        .catch(() => {
                console.log(err);
            }
        );
};

window.addEventListener('scroll', function(){
    if (document.documentElement.scrollTop * 1.01 + document.documentElement.clientHeight  >= document.documentElement.scrollHeight) {
        loadMore();
    }
});
