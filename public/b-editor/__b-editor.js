function __pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function __rotateImage(target) {
    if(target.style.marginTop === '0px' || target.style.marginTop === ''){
        var diff = (target.width - target.height)/2;
        target.style.marginTop = diff+"px";
        target.style.marginBottom = diff+"px";
    }
    else{
        target.style.marginTop = '0px';
        target.style.marginBottom = '0px';
    }
    var angle = parseInt(target.className.substr(-3, 3))/90;
    if(angle<3){
        angle++;
    }
    else{
        angle = 0;
    }
    target.className = ("rotate"+__pad(angle*90, 3))
}