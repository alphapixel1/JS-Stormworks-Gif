const frames=document.getElementById("frames");
var filename="";
const uploadedImage=document.getElementById("outImage");
const acceptedSizes=[32,64,96];
var outImage="outImage";
document.querySelector("#section1 a").onclick=function(){
    window.open("https://ezgif.com/",'_blank').focus();
}
var tpfSldier=document.querySelector("#nameDiv input[type=range]");
var tpfLabel=document.querySelector("#nameDiv label");
tpfSldier.oninput=function(){
    tpfLabel.innerHTML=tpfSldier.value;
}
document.getElementById('picField').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement, files = tgt.files;
    
    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            uploadedImage.src = fr.result;
            uploadedImage.onload=function(){
            if(-1==acceptedSizes.findIndex(z=>z==uploadedImage.width && uploadedImage.height==z)){
                alert("Gif Must Be 32x32, 64x64 or 96x96")
                window.location.reload(); 
            }else{
                document.getElementById("StartButton").style.visibility="visible";
                filename=document.getElementById("picField").value.replace(/.+(?=\\)\\(.+)\.gif/g,"$1");
            }
            }
        }
        fr.readAsDataURL(files[0]);
    }
    
    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}
$("#sliderHelp").on("click",function(){
    alert("1 tick happens every 1/60th of a second, the higher the Ticks Per Frame, the slower the gif")
});
///https://jsfiddle.net/7gtLtkbw/
document.getElementById("StartButton").onclick=function(){
    console.log("start click");
    if (/^.+\.gif$/.test($(uploadedImage).prop("src"))||true) {
        //console.log("is gif")
        var rub = new SuperGif({
            gif: uploadedImage,
            progressbar_height: 20
          });
          rub.get_loading(function(a,b,c){
            console.log(a,b,c);
          })
          rub.load(function() {
            document.getElementById("section1").remove();
            //console.log(rub)
            console.log("RUB",rub);
            for (var i = 0; i < rub.get_length(); i++) {
              
              rub.move_to(i);
              var canvas = cloneCanvas(rub.get_canvas());
              $("#frames").append(canvas);
            }
            document.getElementById("gifDataDiv").style.display="block";
            updateGifData();
            document.getElementById("nameInput").value=filename;
          });
          //changing item visibilities
          [...document.getElementById("section1").children].forEach(element => {
            if(element.className=="")
                element.remove();
          });
          document.querySelector("#section1 .ignore").style.visibility="visible";

    }
 
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function updateGifData(){
    document.getElementById("frameCount").innerHTML=frames.children.length;
    document.getElementById("frameSize").innerHTML=frames.firstChild.width+"x"+frames.firstChild.height
    document.getElementById("estComponentCount").innerHTML=estimateComponentCount(false);
    document.getElementById("estCompressedComponentCount").innerHTML=estimateComponentCount(true);
}

function getAdjustedTicksPerSecond(fps){
    return Math.max(Math.round(fps/60),1);   
}
function estimateComponentCount(compressed){
    let baseComps=5;
    let w=frames.firstChild.width;
    let h=frames.firstChild.height;
    let charcount= compressed? 6:9;
    return baseComps + Math.ceil((w * h * charcount * frames.children.length) / 4096.0);
}

document.getElementById("scene2Start").onclick=function(){
    document.getElementById("gifDataDiv").style.display="none";
    document.getElementById("section3").style.display="block";
    let s3=document.querySelector("#section3");
    var video=new Video(
        [...frames.children],
        document.getElementById("compressedCheck").checked,
        document.getElementById("gammaCheck").checked,
        document.getElementById("nameInput").value,
        parseInt(tpfSldier.value),
        function(title,message,percent){
            s3.querySelector("h2").innerHTML=title;
            s3.querySelector("h4").innerHTML=message;
            s3.querySelector("meter").value=percent;
            console.log(s3.querySelector("meter").value)
        }
    );
    video.start().then(function(data){
        console.log("Done");
        
        document.getElementById("section3").remove();
        var s4=document.getElementById("section4");
        s4.style.display="block";
        var link=s4.querySelector("a");
        link.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(data));
        link.setAttribute('download', document.getElementById("nameInput").value);
    });  
    
    
        
}
