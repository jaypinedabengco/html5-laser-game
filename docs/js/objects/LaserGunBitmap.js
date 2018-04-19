/*
*	LASER GUNS Bitmap( Image )
*/
(function() {
	
	//variables		
	var LaserGunBitmap = function(imgSrc){
		this.initialize(imgSrc);
	}
	
	//inherite
	var p = LaserGunBitmap.prototype = new createjs.Bitmap();
			
	//variables

	//run initialization
	p.Bitmap_initialize = p.initialize;	
	//initialize
	p.initialize = function(imgSrc){
		this.Bitmap_initialize(imgSrc);
	}
	
	p.handlePressMove = function(evt){
		
	}
	
	window.LaserGunBitmap = LaserGunBitmap;
}());