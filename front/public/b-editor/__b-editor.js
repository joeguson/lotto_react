function changeStartTime(youtubeId, time) {
    let targetIframe = document.getElementById(youtubeId);
    let src = targetIframe.src;
    let startStringIndex = src.indexOf('rel=');
    src = src.slice(0, startStringIndex);
    let startingTime = '?&autoplay=1&rel=0&start='+time;
    src += startingTime;
    targetIframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; allowfullscreen');
    targetIframe.src = src;
}

// function __rotateInfo(target){
//     let infoDiv = document.createElement('div');
//     infoDiv.innerHTML='click to rotate';
//     infoDiv.style.backgroundColor='black';
//     infoDiv.style.color='white';
//     infoDiv.style.borderRadius='3px';
//     infoDiv.style.width='100px';
//     infoDiv.style.margin='0 auto';
//     infoDiv.style.textAlign='center';
//     target.parentNode.appendChild(infoDiv);
//     setTimeout(target.parentNode.removeChild(infoDiv), 2000);
// }
// function __pad(n, width) {
//     n = n + '';
//     return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
// }
// function __rotateImage(target) {
//     if(target.style.marginTop === '0px' || target.style.marginTop === ''){
//         var diff = (target.width - target.height)/2;
//         target.style.marginTop = diff+"px";
//         target.style.marginBottom = diff+"px";
//     }
//     else{
//         target.style.marginTop = '0px';
//         target.style.marginBottom = '0px';
//     }
//     let angle = parseInt(target.className.substr(-3, 3))/90;
//     if(angle<3){
//         angle++;
//     }
//     else{
//         angle = 0;
//     }
//     target.className = ("rotate"+__pad(angle*90, 3));
// }