var acookie=document.cookie.split("; ");
 let getck = function(sname){//获取单个cookies
    for(var i=0;i<acookie.length;i++){
        var arr=acookie[i].split("=");
        if(sname==arr[0]){
            if(arr.length>1) return unescape(arr[1]);
            else return "";
        }
    }
    return "";
}

export {getck}