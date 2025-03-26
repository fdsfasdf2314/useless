var GraphicsUtil = {};

/**
 * Adapted from http://www.createjs.com/docs/easeljs/classes/Graphics.html#method_decodePath
 * @param String str String of encoded path (as encoded by exporting from Flash/Animate)
 * @params Boolean ignoreControlPoints If true, controlpoints of (quadratic) bezier curves are ignored. Useful for obtaining approx bounds of shape.
 * @return Flat array with x,y values
 **/
GraphicsUtil.decodePathToXYs = function(str, ignoreControlPoints)
{
	//log("GraphicsUtil.decodeShapeDef",str);
	//var instructions = ["moveTo", "lineTo", "quadraticCurveTo", "bezierCurveTo", "closePath"];
	var paramCount = [2, 2, 4, 6, 0];
	var i=0, l=str.length;
	var xys = [];
	var x=0, y=0;
	var base64 = Graphics.BASE_64;
	while (i<l) {
		var c = str.charAt(i);
		var n = base64[c];
		var fi = n>>3; // highest order bits 1-3 code for operation.
		// check that we have a valid instruction & that the unused bits are empty:
		if (fi>4 || (n&3)) { throw("bad path data (@"+i+"): "+c); }
		var pl = paramCount[fi];
		if (!fi) { x=y=0; } // move operations reset the position.
		i++;
		var charCount = (n>>2&1)+2;  // 4th header bit indicates number size for this operation.
		for (var p=0; p<pl; p++) {
			var num = base64[str.charAt(i)];
			var sign = (num>>5) ? -1 : 1;
			num = ((num&31)<<6)|(base64[str.charAt(i+1)]);
			if (charCount == 3) { num = (num<<6)|(base64[str.charAt(i+2)]); }
			num = sign*num*.1;
			if (p%2) { x = (num += x); }
			else { y = (num += y); }
			i += charCount;
			//WISH: optimize this condition?
			if (!ignoreControlPoints || fi < 2 || (fi==2 && p>=2) || (fi==3 && p>=4))
			{
				xys.push(Math.round(num*10)/10);
			}
		}
		//log(instructions[fi], params.join(","));
	}
	//log.apply(null, xys);
	return xys;
}


