let fs = require('fs')
fs.readFile('src/util/china.json','utf8',(err,data)=>{    
    let allData = JSON.parse(data).data;
    // console.log(allData,'allData');
    let temp = fun(allData);
    fs.writeFile('src/util/china.js',JSON.stringify(temp),err=>{
        console.log(err,'err');
    })
    console.log(temp);
})


function fun(arr){
	for(var i in arr){		
		arr[i].value = arr[i].label
		if(arr[i].children){
			fun(arr[i].children)
        }		       
    }
    return arr;
}
