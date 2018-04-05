(function() {
	
	//variables		
	var LaserPointerBitmap = function(imgSrc, parentWidth, parentHeight){
		this.initialize(imgSrc, parentWidth, parentHeight);
	}
	
	//inherite
	var p = LaserPointerBitmap.prototype = new createjs.Bitmap();
	
	//variables
	p.targetPointer;
	p.laserLine;
	
	//run initialization
	p.Bitmap_initialize = p.initialize;
	p.initialize = function(imgSrc, parentWidth, parentHeight){			
		this.Bitmap_initialize(imgSrc);
		//initial position
		if ( parentWidth !== undefined && parentHeight !== undefined){ //set position based on parent
			this.x = parentWidth/2;
			this.y = parentHeight/2;
		}

		this.regY = this.getBounds().height / 2;
		this.regX = this.getBounds().width / 2;
		
	}
	
	p.handlePressMove = function(evt){
	}
	
	/*
	* PUBLIC FUNCTIONS
	*/
	LaserPointerBitmap.prototype.connectTo = function(targetPointer){
		if ( typeof this.targetPointer === 'undefined'){
			this.targetPointer = targetPointer;
			this.positionUpdate();
		} else {
			console.log('target already has a partner?, something went wrong dude');
		}
	}
	
	LaserPointerBitmap.prototype.setLaserLine = function(laserLine){
		if ( typeof this.laserLine === 'undefined'){
			this.laserLine = laserLine;
		} else {
			console.log('already has a laserline?, something went wrong dude');
		}
	}
	
	
	LaserPointerBitmap.prototype.positionUpdate = function(){
	
		/* 
		*	GET ANGLE FORMULA
		*	angle = atan( x1 - x2 / y2 - y1 ) * ( 180/pi )
		*
		*	because image is originaly positioned to 90deg, so angle = angle - 90
		*/
		 
		/*
		//get Length: // pythagoras theorem
		var laserLength = 	Math.abs( Math.sqrt( 
								( Math.abs( a_width ) * Math.abs( a_width ) )  + 
								( Math.abs( a_height ) * Math.abs( a_height ) )
									) - 
							( this.getBounds().width * 2 ) );  //minus guns length from both ends
		*/
		
		//Set Rotation for pointer and target
		var x1 			= 	this.parent.x;	//myX
		var y1 			= 	this.parent.y;	//myY
		var x2 			= 	this.targetPointer.parent.x;	//targetX
		var y2 			= 	this.targetPointer.parent.y;  //targetY	
		
		var angle = this.getAngle(x1,y1,x2,y2);
				
		this.rotation 					= 	angle - 180;
		this.targetPointer.rotation 	= 	angle;
				
		//laser line logic
		this.laserLine.graphics.clear();
		this.laserLine.alpha = .8;
		this.laserLine.graphics.setStrokeStyle(5).beginStroke("#F00").
					beginFill("#F00").
					moveTo(this.parent.x ,this.parent.y).
					lineTo(this.targetPointer.parent.x,this.targetPointer.parent.y);
					
	}
	
	/*
		PRIVATE FUNCTIONS
	*/
	p.getAngle = function( x1,y1, x2, y2 ){
				
		var a_width 	= 	x1 - x2; //angle width
		var a_height 	= 	y2 - y1; //angle height
		var angle 		= 	Math.atan(a_width / a_height ) * ( 180/Math.PI) - 90; //get angle
		 
		if ( ( 	a_width >= 0 && a_height <= 0 ) && angle != 0 || 
			(	a_width <= 0 && a_height <= 0) && angle !== -180 ){ //If position is on lower side ( if y < 0 )
			angle = angle + 180;
		}  		

		return angle;
	}
	
	window.LaserPointerBitmap = LaserPointerBitmap;
}());