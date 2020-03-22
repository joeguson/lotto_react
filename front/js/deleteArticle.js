function __selectDeleteFunc(delete_target) {
    return (delete_id) => {
        if (confirm("Are you sure to delete this content?")) {
            let data = {delete_id: delete_id};
            const url = '/api/article/'+ delete_target;
            makeRequest('delete', url, data)
                .then(res => {
                    alert("Deleted");
                    location.reload();
                }).catch(res => {
                alert("Cannot delete this");
            })
        }
    }
}

deletePenobrol = __selectDeleteFunc("penobrol");
deleteTandya = __selectDeleteFunc("tandya");
deleteYoutublog = __selectDeleteFunc('youtublog');

deletePenobrolCom = __selectDeleteFunc("penobrol/reply");
deleteTandyaAns = __selectDeleteFunc("tandya/reply");
deleteYoutublogCom = __selectDeleteFunc('youtublog/reply');

deletePenobrolComCom = __selectDeleteFunc("penobrol/re-reply");
deleteTandyaAnsCom = __selectDeleteFunc("tandya/re-reply");
deleteYoutublogComCom = __selectDeleteFunc('youtublog/re-reply');