// Get named HTML object
function GetObject(name)
{
	var o=null;
	if(document.getElementById)
		o=document.getElementById(name);
	else if(document.all)
		o=document.all.item(name);
	else if(document.layers)
		o=document.layers[name];
	return o;
}

var txt="Click to remove.";
var krn=[9,3,3,7,8,4,4,8,4,4,7,10,7,6,7,7];
var lft=130;
var fin=0;
function setup()
{
	var x=lft;
	var h="";
	fin=0;
	for (var i=0; i<krn.length; i++)
	{
		var ch=txt.substr(i,1);
		if (ch!=" ")
		{
			h+="<DIV id='c"+i+"' style='left:"+x+"px; top:200px;' onclick='ck("+i+")'>"+ch+"</DIV>";
			fin++;
		}
		x+=krn[i]*4;
	}
	var o=GetObject("centerdiv");
	if (o)
	{
		o.style.width="640px";
		o.style.height="480px";
		o.style.top="30px";
		o.style.borderColor="#000000";
		o.onclick=ckd;
		o.innerHTML=h;
		document.body.style.backgroundColor="#E0E0E0";
	}
	GetObject("addthis").style.display="block";
}


var mc=new Array();
var ms=new Array();
var oc=new Array();
var os=new Array();
var sc=new Array();
var ss=new Array();

function anim(idx,frm)
{
	var o=GetObject("c"+idx);
	if (!o) return;

	if (frm==0)
	{
		mc[idx]=Math.random()-0.5;
		ms[idx]=Math.random()-0.5;
		oc[idx]=(Math.random()-0.5)*0.02;
		os[idx]=(Math.random()-0.5)*0.02;
		sc[idx]=(Math.random()-0.5)*60;
		ss[idx]=(Math.random()-0.5)*60;
	}

	frm++;
	var x=parseInt(o.style.left,10);
	var y=parseInt(o.style.top,10);
	x=Math.floor(x+(Math.cos(frm*mc[idx])+frm*oc[idx])*sc[idx]);
	y=Math.floor(y+(Math.sin(frm*ms[idx])+frm*os[idx])*ss[idx]);
	if (frm>30 || x<0 || x>640 || y<0 || y>420)
	{
		o.innerHTML="";
		fin-=1;
//		if(fin==0)
//		 setTimeout("setup()",2000);
	}
	else
	{
		o.style.left=x+"px";
		o.style.top=y+"px";
		o.style.fontSize=(50-frm)+"px";
		setTimeout("anim("+idx+","+frm+")",10);
	}
}

function animd(frm)
{
	var o=GetObject("centerdiv");

	if (frm==0)
		GetObject("addthis").style.display="none";

	frm+=1;
	if (frm>=150)
	{
		o.style.top="-100px";
		setTimeout("setup()",2000);
		return;
	}

	if (frm<=130)
	{
		var sc=(130-frm)/130;
		var clr=Math.floor(0xE0*sc).toString(16);
		document.body.style.backgroundColor="#"+clr+clr+clr;
		if (frm==125)
		{
			o.style.borderColor="#000000";
		}
	}

	if (frm<=100)
	{
		var sc=(100-frm)/100;
		var clr=Math.floor(0xE0*sc).toString(16);
		sc=1-(1-sc)*(1-sc);
		o.style.width=Math.floor(sc*640)+"px";
		o.style.height=Math.floor(sc*480)+"px";
		o.style.top=Math.floor(270-sc*240)+"px";
		if (frm>80)
			o.style.borderColor="#FFFFFF";
		else if (frm>60)
			o.style.borderColor="#808080";
	}
	setTimeout("animd("+frm+")",10);
}

function ck(idx)
{
	var o=GetObject("c"+idx);
	if (o)
	{
		o.onclick="void(null)";
		anim(idx,0);
	}
}

function ckd()
{
	if (fin>0) return;
	var o=GetObject("centerdiv")
	if (o)
	{
		o.onclick="void(null)";
		animd(0);
	}
}