
let loadMore = function(pathname) {
    makeRequest('GET', 'api/article'+pathname+'/load')
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
    let pathname = window.location.pathname;
    if(pathname != '/cari'){
        if (document.documentElement.scrollTop + document.documentElement.clientHeight  == document.documentElement.scrollHeight) {
            loadMore(pathname);
        }
    }
});

