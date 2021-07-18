function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
};
//取得身份證字號
export function generateTaiwanID(): string{
var a: string[] = [];
 var b=[10,11,12,13,14,15,16,17,34,18,19,20,21,22,35,23,24,25,26,27,28,29,32,30,31,33];
 var value="";
 for(var i = 65; i < 91; i++){
   a.push(String.fromCharCode(i));
  }
 value=a[getRandom(0,25)]+getRandom(1,2);
 for(var i=0;i<7;i++){
  value+=getRandom(1,9);
 }
 return value+=getchknum(value);
}
//取得身份證字號最後一個檢查碼
function getchknum(x){
 try{
        var a: string[] = [];
        var b=[10,11,12,13,14,15,16,17,34,18,19,20,21,22,35,23,24,25,26,27,28,29,32,30,31,33];

        for(var i = 65; i < 91; i++){
                a.push(String.fromCharCode(i));
         }    

        var num=a.indexOf(x.substr(0,1));
        var b1=parseInt(b[num].toString().substr(0,1));
        var b2=parseInt(b[num].toString().substr(1,1));

        var fnum=b1+(b2*9); //英文字母算出的數字
        var ff=1;
        for(var i=8;i>0;i--){
	    fnum+=x.substr(i,1)*ff;
	    ff++;
        }
        var final=(fnum%10==0)?0:10-(fnum%10); //檢查碼
        return final;
    }catch{
        return null;
    }
};