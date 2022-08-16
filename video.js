class Video{
    constructor(frames,compressed,gamma,mcName,tps,update){
        this.LastID=12;
        this.width=frames[0].width;
        this.height=frames[0].height;
        this.compressed=compressed;
        this.gamma=gamma;
        this.components=[];
        this.update=update;
        this.frames=frames;
        this.mcName=mcName;
        this.tps=tps;
    }
    async start(){
        var frameData=[];
        let frameCount=this.frames.length;
        for(var i=0;i<this.frames.length;i++){
            this.update("Part 1/2",`Building Frame: ${i}/${frameCount}`,~~i/frameCount);
            frameData.push(this.getBufferedData(this.frames[i]));
            await sleep(50);
            console.log("frame")
        }
        this.framePropertyCount = frameData[0].length - 1;
        this.components=[...this.components,...(await this.getPropertyComponents(frameData))];
        //build it all?
        var file =template.replace("MICROCONTROLLERNAME", this.mcName);
        file = file.replaceAll("SCRIPT HERE",this.getScript());
        //file = file.replace("SCRIPT HERE",this.getScript());
        file = file.replaceAll("IDCOUNTER", this.LastID);
        //file = file.replace("IDCOUNTER", this.LastID);
        file = file.replaceAll("TICKS PER FRAME",this.tps);
     //   file =file.replaceAll("framePropertyCount",this.framePropertyCount)
        //file = file.replace("TICKS PER FRAME",tps);
        file = file.replaceAll("NEW COMPONENTS HERE",this.components.join("\n"));
        return file;
    }
    getScript(){
        var s=script;
        var framesCount = this.frames.length - 1;
        s = s.replace("FRAMECOUNT", framesCount);
        var colorCharLength = this.compressed ? 2 : 3;
        var CompressedMulti = this.compressed ? "*2.55" : "";
        s = s.replace("TABINSERT", `tonumber(t..c)${CompressedMulti}`);
        s = s.replace("FRAMEPROPERTYCOUNT", this.framePropertyCount);
        s = s.replace("COLORCHARLENGTH", colorCharLength);
        s=s.replace("WIDDTH", this.width);
        s=s.replace("HEIIGHT", this.height);
        return s;
    }
  async getPropertyComponents(data){
        let ret=[];
        for(var i=0;i<data.length;i++){
            var frame=data[i];
            for(var a=0;a<frame.length;a++){
              this.LastID++;
              var c = `<c type=\"58\">\n\t\t\t\t<object id=\"${this.LastID}\" n=\"frame${i}o${a}\" v=\"${frame[a]}\">\n\t\t\t\t\t<pos x=\"${i-10}\" y=\"${(-10)-a}\"/>\n\t\t\t\t</object>\n\t\t\t</c>`;
              ret.push(c);
              
            }
            await sleep(20);
            this.update("Part 2/2",`Building Property Components ${i}/${data.length}`,~~i/data.length);
        }
        return ret;
    }
    getFrameData(canvas){
        let data="";
        let rgba=canvas.getContext("2d").getImageData(0,0,this.width,this.height).data;
        for(var i=0;i<rgba.length;i+=4){
            let r=rgba[i];
            let g=rgba[i+1];
            let b=rgba[i+2];
            if(this.gamma){
                r=Math.round(Math.pow(r / 255,2.2) * 255);
                g=Math.round(Math.pow(g / 255,2.2) * 255);
                b=Math.round(Math.pow(b / 255,2.2) * 255);
            }
            if(this.compressed){
                r = Math.min((Math.round((r / 255.0) * 100)), 99);
                g = Math.min((Math.round((g / 255.0) * 100)), 99);
                b = Math.min((Math.round((b / 255.0) * 100)), 99);
                data += (r < 10 ? "0" + r : "" + r) + (g < 10 ? "0" + g : "" + g) + (b < 10 ? "0" + b : "" + b);
            }else{
                let sr = (r < 100 ? (r < 10 ? "00" : "0") : "") + r;
                let sg = (g < 100 ? (g < 10 ? "00" : "0") : "") + g;
                let sb = (b < 100 ? (b < 10 ? "00" : "0") : "") + b;
                data +=sr+sg+sb;
            }
        }
        return data;
    }
    getBufferedData(canvas){
        let data=this.getFrameData(canvas);
        let maxBuff=4096;
        return maxBuff > 0? data.match(new RegExp('.{1,' + maxBuff + '}', 'g')) : [data];
    }
}
function fillTemplate(){

}
const template=`<?xml version="1.0" encoding="UTF-8"?>
<microprocessor name="MICROCONTROLLERNAME" description="Made by Alphapixel" hide_in_inventory="false" width="2" length="1" id_counter="IDCOUNTER" id_counter_node="4" transform_index="0" sym0="61455" sym1="59367" sym2="53235" sym3="40761" sym4="15932" sym5="31806" sym6="30782" sym7="28734" sym8="28734" sym9="30782" sym10="31806" sym11="15932" sym12="40761" sym13="53235" sym14="59367" sym15="61455">
  <nodes>
    <n id="3" component_id="12" built_slot_index="0">
      <node orientation="0" label="Video Out" mode="0" type="6" description="" flags="0">
        <position x="0" y="0" z="0"/>
      </node>
    </n>
    <n id="4" component_id="10" built_slot_index="0">
      <node orientation="0" label="Play/Pause" mode="1" type="0" description="" flags="0">
        <position x="1" y="0" z="0"/>
      </node>
    </n>
  </nodes>
  <group id="0">
    <pos x="0" y="0"/>
    <data type="0" name="" desc="">
      <inputs/>
      <outputs/>
    </data>
    <components>
      <c type="56">
        <object id="6" script="SCRIPT HERE">
          <pos x="-0.5" y="0"/>
          <in1 component_id="7" node_index="0">
            <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
          </in1>
          <in2 component_id="0" node_index="0">
            <v/>
          </in2>
          <out1>
            <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
          </out1>
          <out2>
            <v/>
          </out2>
        </object>
      </c>
      <c type="41">
        <object id="7" count="1" offset="0">
          <pos x="-1.75" y="0"/>
          <inc component_id="0" node_index="0">
            <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
          </inc>
          <in1 component_id="10" node_index="0" v="false"/>
          <out1>
            <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
          </out1>
        </object>
      </c>
      <c type="34">
        <object id="8" n="Ticks per Frame">
          <pos x="-3" y="1"/>
          <out1 v="0"/>
          <v text="TICKS PER FRAME" value="TICKS PER FRAME"/>
        </object>
      </c>
    NEW COMPONENTS HERE
    </components>
    <components_bridge>
      <c type="0">
        <object id="10">
          <pos x="-3" y="0"/>
          <in1 component_id="0" node_index="0" v="false"/>
          <out1 v="false"/>
        </object>
      </c>
      <c type="7">
        <object id="12">
          <pos x="0.75" y="0"/>
          <in1 component_id="6" node_index="1">
            <v/>
          </in1>
          <out1>
            <v/>
          </out1>
        </object>
      </c>
    </components_bridge>
    <groups/>
    <component_states>
      <c0 id="6" script="SCRIPT HERE">
        <pos x="-0.5" y="0"/>
        <in1 component_id="7" node_index="0">
          <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
        </in1>
        <in2 component_id="0" node_index="0">
          <v/>
        </in2>
        <out1>
          <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
        </out1>
        <out2>
          <v/>
        </out2>
      </c0>
      <c1 id="7" count="1" offset="0">
        <pos x="-1.75" y="0"/>
        <inc component_id="0" node_index="0">
          <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
        </inc>
        <in1 component_id="10" node_index="0" v="false"/>
        <out1>
          <v bools="0" 01="0" 02="0" 03="0" 04="0" 05="0" 06="0" 07="0" 08="0" 09="0" 10="0" 11="0" 12="0" 13="0" 14="0" 15="0" 16="0" 17="0" 18="0" 19="0" 20="0" 21="0" 22="0" 23="0" 24="0" 25="0" 26="0" 27="0" 28="0" 29="0" 30="0" 31="0" 32="0"/>
        </out1>
      </c1>
      <c2 id="8" n="Ticks per Frame">
        <pos x="-3" y="1"/>
        <out1 v="0"/>
        <v text="TICKS PER FRAME" value="TICKS PER FRAME"/>
      </c2>
    </component_states>
    <component_bridge_states>
      <c0 id="10">
        <pos x="-3" y="0"/>
        <in1 component_id="0" node_index="0" v="false"/>
        <out1 v="false"/>
      </c0>
      <c1 id="12">
        <pos x="0.75" y="0"/>
        <in1 component_id="6" node_index="1">
          <v/>
        </in1>
        <out1>
          <v/>
        </out1>
      </c1>
    </component_bridge_states>
    <group_states/>
  </group>
</microprocessor>`
const script=`
function getFrame(fNum)
	local data=''
	for c=0,framePropertyCount do
		data = data..property.getText('frame'..fNum..'o'..c)
	end
	local ret={}
	local t=''
	for a=1,#data do
		local c=data:sub(a,a)
		if(a%colorCharLength==0)then
			table.insert(ret,TABINSERT)
			t=''
		else
			t=t..c
		end
	end
	return ret
end
frameRate=property.getNumber('Ticks per Frame')
currentFrame=1
tickcount = 0
frameCount=FRAMECOUNT
framePropertyCount=FRAMEPROPERTYCOUNT
colorCharLength=COLORCHARLENGTH--set to 2 for compressed images, 3 for uncompressed
width=WIDDTH
height=HEIIGHT
vid={}
playpause=false
loadedF=0
loaded=false
function onTick()
	playpause = input.getBool(1)
	if playpause and loaded then
		tickcount=tickcount+1
		if tickcount==frameRate then
			tickcount=0
			
			if currentFrame-1==frameCount then
				currentFrame=1
			else
				currentFrame=currentFrame+1	
			end
		end
	else
		
		for i=loadedF,math.min(frameCount,loadedF+5) do
			table.insert(vid,getFrame(i,framePropertyCount))
		end
		loadedF=loadedF+5
		loaded=loadedF>=frameCount
	end
end
function onDraw()		
	p=-1
	local image=vid[currentFrame]
	for i=1,#image,3 do
	p=p+1
	screen.setColor(image[i],image[i+1],image[i+2])
	screen.drawRect(p%width,(p-(p%width))/height,1,1)--I swapped xy on pixel 
	--screen.drawRect((p-(p%height))/width,p%height,1,1)--new one to counteract
	end
end`
function sleep(ms) {
   // console.log("sleep",ms)
    return new Promise(resolve => setTimeout(resolve, ms));
}