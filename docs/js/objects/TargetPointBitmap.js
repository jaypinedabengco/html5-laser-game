(function() {
	
	//variables		
	var TargetPointBitmap = function( imageDefaultSrc, imageSelectedSrc, targetPointStage, startX, startY ){
		this.initialize( imageDefaultSrc, imageSelectedSrc, targetPointStage, startX, startY );
	}
	
	//inherite
	var p = TargetPointBitmap.prototype = new createjs.Bitmap();
	
	//variables
	p.stage;	
	p.imageDefaultSrc;
	p.imageSelectedSrc;
	p.targetPointStage;
	p.selected;
	
	//run initialization
	p.Bitmap_initialize = p.initialize;
	p.initialize = function( imageDefaultSrc, imageSelectedSrc, targetPointStage, startX, startY){
		this.Bitmap_initialize(imageDefaultSrc);
		
		this.stage 				= 	targetPointStage.parent;
		this.targetPointStage 	= 	targetPointStage;
		this.imageDefaultSrc 	= 	imageDefaultSrc;
		this.imageSelectedSrc 	= 	imageSelectedSrc;
		
		//initial position
		if ( startX !== undefined && startY !== undefined){ //set position
			this.x = startX;
			this.y = startY;
		}
		
		//set rotation to center
		this.regY = this.getBounds().height / 2;
		this.regX = this.getBounds().width / 2;
		
		var canvasBounds = this.stage.getBounds();
		
		var topLength = ( canvasBounds.height * 0.11 ),
			minY = topLength,
			maxY = ( canvasBounds.height - topLength ),
			minX = 0,
			maxX = ( canvasBounds.width );
		
		//add top length
		this.x += topLength;

		//Position Validation : 			
		//X
		if ( this.x < minX )
			this.x = minX;
		else if ( this.x > maxX )
			this.x = maxX;
		
		//Y
		if ( this.y < minY )
			this.y = minY;
		else if ( this.y > maxY)
			this.y = maxY;
		
		//adjust starting position x,y is now on center
		this.x += this.getBounds().width / 2;
		this.y += this.getBounds().height / 2;	

		//adjustment for laser point body and target point
		var laserGunDimension = ( this.getBounds().width * 1.3125 );
		var adjust = ( laserGunDimension - this.getBounds().width ) / 2;
		this.x = ( this.x + adjust );
		this.y = ( this.y + adjust );
		
				
		//configurations :
		//this.alpha = .8; // make transparent
		
		//set default for selected
		this.selected = false;
		
		//set target point bitmap to parent
		this.targetPointStage.addChild(this);
	}
	
	/* --------------------
		PUBLIC FUNCTIONS
	* ---------------------*/
	TargetPointBitmap.prototype.changeImageToDefault = function(){
		this.alpha = 1;
		this.selected = false;
		this.image = this.imageDefaultSrc;
	}
	
	TargetPointBitmap.prototype.changeImageToSelected = function(){
		this.alpha = .8
		this.selected = true;
		this.image = this.imageSelectedSrc;
	}
	
	TargetPointBitmap.prototype.isSelected = function(){
		return this.selected;
	}
	
	p.handlePressMove = function(evt){
	}

	window.TargetPointBitmap = TargetPointBitmap;
}());