(function(window) {
	var Piece = function(canvas, config)
	{
		this.initialize(canvas, config);
	}
	var p = Piece.prototype = new BasePiece();
	//
	p.initialize = function(canvas, config)
	{
		BasePiece.prototype.initialize.call(this, canvas, config);
		this.initInteraction();
		this.calcShapeBounds();
	}

	p.onKeyUp = function(e)
	{
		BasePiece.prototype.onKeyUp.call(this, e);
		if (!this.config.debug) return;
		var c = String.fromCharCode(e.which);
		if (c=="R") this.reset();
		else if (c=="T") this.testShapes();
		else if (c=="O") this.testOutput();
		else if (c=="A") this.toggleAutoMode();
	}
	
	
	/*********************************
	 *					INTERACTION
	 ********************************/
	
	p.initInteraction = function()
	{
		var type = isMobile ? "pressmove" : "stagemousemove";
		this.stage.addEventListener("stagemousemove", this.handleMouseMove.bind(this));
		this.stage.addEventListener("stagemousedown", this.handleMouseDown.bind(this));
		this.stage.addEventListener("stagemouseup", this.handleMouseUp.bind(this));
	}
	p.handleMouseDown = function(e)
	{
		var p = this.stage.globalToLocal(e.stageX, y = e.stageY);
		this.mouseIsDown = true;
		this.decelerating = false;
		this.speed = 0;
		this.lastPos = p.x;
		//
		this.pauseAutoMode();
	}
	p.handleMouseMove = function(e)
	{
		if (!this.mouseIsDown) return;
		var p = this.stage.globalToLocal(e.stageX, y = e.stageY);
		this.speed = p.x - this.lastPos;
		this.shiftShapes(this.speed);
		this.lastPos = p.x;
	}
	p.handleMouseUp = function(e)
	{
		this.mouseIsDown = false;
		this.decelerating = true;
	}
		
		
	/*********************************
	 *			AUTOMODE
	 ********************************/
	
	p.startAutoMode = function()
	{
		this.stopAutoMode();
		this.decelerating = false;
		this.autoModeOn = true;
		var w = this.width, w2 = w/2, r = .6;
		//
		var dx = this.dx;
		if (dx==0) dx = -this.shapeLeft.x;
		var d = 3000, d2 = d/2;
		this.autoModeLastX = this.shapeLeft.x;
		var xL = -r*w2, xR = r*w2;
		var x = dx<0 ? xL : xR, d0 = d2*Math.abs(x-this.shapeLeft.x)/w;
		var x0 = dx<0 ? xR : xL, x1 = dx<0 ? xL : xR;
		var proxy = {x:this.shapeLeft.x};
		this.autoModeTween = Tween.get(proxy).to({x:x},d0,Ease.quadInOut).call(function()
			{
				this.autoModeTween = Tween.get(proxy,{loop:true}).to({x:x0},d2,Ease.quadInOut).to({x:x1},d2,Ease.quadInOut);
			}.bind(this));
	}
	p.stopAutoMode = function(pause)
	{
		if (this.autoModeTween) 
		{
			Tween.removeTweens(this.autoModeTween.target);
			if (!pause) this.autoModeOn = false;
		}
		this.autoModeTween = null;
	}
	p.pauseAutoMode = function()
	{
		if (this.autoModeTween) this.stopAutoMode(true);
	}
	p.resumeAutoMode = function()
	{
		if (this.autoModeOn) this.startAutoMode();
	}
	p.toggleAutoMode = function()
	{
		if (this.autoModeTween) this.stopAutoMode();
		else this.startAutoMode();
	}
	 
	/*********************************
	 *					FLOW
	 ********************************/
	
	p.setSize = function(w,h,dpr)
	{
		this.dpr = dpr;
		w = Math.floor(w*dpr);
		h = Math.floor(h*dpr);
		//
		this.stage.x = w/2;
		this.stage.y = h/2;
		//rotate 90deg when in portrait mode
		this.stage.rotation = w<h ? 90 : 0;
		if (w<h)
		{
			var tmp = w;
			w = h;
			h = tmp;
		}
		//scale stage
		var cfg = this.config;
		var s = this.scale = (h-2*cfg.margin_vert)/this.shapesRect.height;
		w = this.width = w/s;
		h = this.height = h/s;
		this.stage.scaleX = this.stage.scaleY = s;
		//
		var w2= w/2, h2 = h/2;
		var ox = cfg.division_offset/s;
		var dx = Math.tan(cfg.division_angle/180*Math.PI) * h2;
		this.divisionTopX = ox + dx;
		this.divisionBottomX = ox - dx;
		this.divisionCenterX = ox;
		//
		if (this.tickLast) this.reset();
	}

	p.start = function()
	{
		BasePiece.prototype.start.apply(this);
		log("start",this.width, this.height, this.dpr);
		var cfg = this.config;
		//create all layers
		this.bgLeft = this.stage.addChild(new Shape());
		this.bgRight = this.stage.addChild(new Shape());
		this.shapeLeft = this.stage.addChild(new Shape());
		this.shapeRight = this.stage.addChild(new Shape());
		this.shapeLeft.mask = new Shape();
		this.shapeRight.mask = new Shape();
		if (this.width) this.reset();
	}
	
	p.reset = function()
	{
		var cfg = this.config, s = this.scale, w = this.width, h = this.height;//determine colors
		this.colorIndexBgLeft = Math.random() < .5 ? 0 : 1;
		var left = getQueryParam("l"), right = getQueryParam("r");
		this.shapeLeft.def = left!=null? cfg.shapeDefs[left] : RandomUtil.pick(cfg.shapeDefs);
		this.shapeRight.def = right!=null? cfg.shapeDefs[right] : RandomUtil.pick(cfg.shapeDefs, [this.shapeLeft.def]);
		//calc startup position
		var ix = -2000, ivp = cfg.initiallyVisiblePixels * h;
		var w2 = w/2, r0 = this.shapeLeft.def.rect, r1 = this.shapeRight.def.rect;
		if (Math.random() < .5) ix = -w2 + ivp - (r0.x + r0.width);
		else ix = w2 - ivp - r1.x;
		//debug: relative offsetX
		var xDbg = getQueryParam("x");
		if (xDbg!=null) ix = w * xDbg;
		//
		this.setShapesX(ix);
		this.dx = ix>0 ? -1 : 1;
		//
		this.shapeLeft.rotation = -this.stage.rotation;
		this.shapeRight.rotation = -this.stage.rotation;
		//
		this.shapeLeftVisible = true;
		this.shapeRightVisible = true;
		//
		this.drawBackground();
		this.drawShapes();
		//
		this.stopAutoMode();
		if (getQueryParam("auto")!=null) this.startAutoMode();
	}
	
	p.update = function()
	{
		if (this.decelerating)
		{
			var cfg = this.config;
			this.speed *= Math.abs(this.speed)>cfg.threshold_release_speed ? cfg.acceleration_factor_above_threshold : cfg.acceleration_factor;
			this.shiftShapes(this.speed);
			//
			if (Math.abs(this.speed)<.05)
			{
				this.resumeAutoMode();
			}
		}
		if (this.autoModeTween)
		{
			this.shiftShapes(this.autoModeTween.target.x-this.autoModeLastX);
			this.autoModeLastX = this.autoModeTween.target.x;
		}
		return true;
	}	
		
	p.setShapesX = function(x)
	{
		this.dx = x - this.shapeLeft.x;
		this.shapeLeft.x = this.shapeRight.x = x;
	}
	
	p.shiftShapes = function(dx)
	{
		var cfg = this.config, w2 = this.width/2;
		var s0 = this.shapeLeft, s1 = this.shapeRight;
		var r = this.shapesRect, r0 = s0.def.rect, r1 = s1.def.rect;		
		if (!this.shapeLeftVisible && !this.shapeRightVisible)
		{
			if (this.decelerating) return;//do not shift when shapes are out of view
			// position x just out of view according to mouse direction
			if (dx > 0) this.setShapesX(-w2 - (r0.x+r0.width));
			else this.setShapesX(w2 - r1.x);
		}
		//reposition shapes:
		this.setShapesX(s0.x+dx);
		//check if shapes are in viewport. If newly not, randomize
		var mid = this.divisionCenterX;			
		var mid = this.divisionCenterX, margin = r.height/2 * Math.tan(cfg.division_angle/180 * Math.PI);
		if (s0.x + r.x+r.width < -w2 || s0.x + r.x > mid - margin)
		{
			this.shapeLeftVisible = false;
		}
		else if (!this.shapeLeftVisible) {
			this.shapeLeftVisible = true;
			//randomize again
			s1.def = RandomUtil.pick(cfg.shapeDefs, [s0.def, s1.def]);
			this.drawShape(LEFT);
		}
		//reposition shapes: right
		if (s1.x + r.x > w2 || s1.x + r.x+r.width < mid + margin)
		{
			this.shapeRightVisible = false;
		}
		else if (!this.shapeRightVisible) {
			this.shapeRightVisible = true;
			//randomize again
			s0.def = RandomUtil.pick(cfg.shapeDefs, [s0.def, s1.def]);
			this.drawShape(RIGHT);
		}
	}
	

	p.drawShapes = function()
	{
		this.drawShape(LEFT);
		this.drawShape(RIGHT);
	}
	p.drawShape = function(pos)
	{
		var ci = pos==LEFT ? 1-this.colorIndexBgLeft : this.colorIndexBgLeft;
		var shape = pos==LEFT ? this.shapeLeft : this.shapeRight;
		shape.graphics.c().f(this.config.colors[ci]).p(shape.def.path);
		var g = shape.mask.graphics.c().f("#000");
		this.drawBackgroundPart(pos, g, pos==LEFT?.5:-.5);//overlap to avoid artefacts
	}
	p.drawBackground = function()
	{
		var cfg = this.config, w = this.width, h = this.height, w2= w/2, h2 = h/2;
		var cl = this.colorIndexBgLeft;
		var g = this.bgLeft.graphics.c().f(cfg.colors[cl]).r(-w2,-h2,w,h);
		g = this.bgRight.graphics.c().f(cfg.colors[1-cl]);
		this.drawBackgroundPart(RIGHT, g);
	}
	p.drawBackgroundPart = function(pos, g, overlap) 
	{
		overlap = overlap || 0;
		var cfg = this.config, w = this.width, h = this.height, w2= w/2, h2 = h/2;
		var xt = this.divisionTopX + overlap;
		var xb = this.divisionBottomX + overlap;
		if (pos == LEFT) g.mt(-w2, -h2).lt(xt,-h2).lt(xb,h2).lt(-w2,h2);
		else g.mt(xb,h2).lt(xt,-h2).lt(w2,-h2).lt(w2,h2);
	}
	
	
	p.calcShapeBounds = function()
	{
		var maxBounds = [0,0,0,0];
		this.config.shapeDefs.forEach(function(def)
		{
			var xys = GraphicsUtil.decodePathToXYs(def.path, true);
			var b = xys.reduce(function(bounds, val, idx) {
				if (idx%2) 
				{
					bounds[1] = Math.min(bounds[1],val);
					bounds[3] = Math.max(bounds[3],val);
				}
				else
				{
					bounds[0] = Math.min(bounds[0],val);
					bounds[2] = Math.max(bounds[2],val);
				}
				return bounds;
			}, [0,0,0,0]);//minx,miny,maxx,maxy
			def.rect = new Rectangle(b[0],b[1],b[2]-b[0],b[3]-b[1]);	
			maxBounds[0] = Math.min(maxBounds[0], b[0]);
			maxBounds[1] = Math.min(maxBounds[1], b[1]);
			maxBounds[2] = Math.max(maxBounds[2], b[2]);
			maxBounds[3] = Math.max(maxBounds[3], b[3]);
		});
		var b = maxBounds;	
		this.shapesRect = new Rectangle(b[0],b[1],b[2]-b[0],b[3]-b[1]);
	}
	
	// TEMP / TEST	
	p.testShapes = function()
	{
		if (this.testContainer) 
		{
			this.testContainer.parent.removeChild(this.testContainer);
			this.testContainer = null;
			return;
		}
		this.testContainer = this.stage.addChild(new Container());
		this.testContainer.x = -this.stage.x;
		this.testContainer.y = -this.stage.y;
		var r = 280, r2 = r/2;
		for (var idx=0;idx<this.config.shapeDefs.length;idx++)
		{
			var shape = this.testContainer.addChild(new Shape());
			shape.x = r2 + idx%6 * r;
			shape.y = r2 + Math.floor(idx/6) * r;
			var def = this.config.shapeDefs[idx];
			var g = shape.graphics.c().s('#FF0000').p(def.path).ef();
			g.s('#00f').r(-r2,-r2,r,r);
			var xys = GraphicsUtil.decodePathToXYs(def.path, true);
			for (var i=0;i<xys.length;i+=2) g.s('#000').dc(xys[i],xys[i+1],5);
		}
	}
	//end TEMP
	
	
	/**********************************
	 *            constants
	 **********************************/
	
	var LEFT = 0, RIGHT = 1;
	
	//
	
	window.Piece = Piece;
	

}(window));

