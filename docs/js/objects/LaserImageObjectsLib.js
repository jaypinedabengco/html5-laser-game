/*
* Laser Image Main Class
*/
(function(){
		
	var LaserImageObject = function(imageSrc){
		
		var type = '',
			imageUrl = imageSrc,
			imageObject = {},
			color	= '';
		
		/*
		* getter and setter
		*/
		
		//type
		return{
			//initialize
			initialize : function(imageSrc){
				this.imageUrl = imageSrc;
			},
			
			getType : function(){
				return this.type;
			}, 
			setType : function(type){
				this.type = type;
			},
			
			//imageurl
			getImageUrl : function(){
				return this.imageUrl;
			},
			setImageUrl : function(imageUrl){
				this.imageUrl = imageUrl;
			},
			
			//imageObject
			getImageObject : function(){
				return this.imageObject;
			},
			setImageObject : function(imageObject){
				this.imageObject = imageObject;
			},
			
			//imageColor
			getColor : function(){
				return this.color;
			},
			setColor : function(color){
				this.color = color;
			}
		}
	}
	
	window.LaserImageObject = LaserImageObject;
}());

/*
* Laser Image Object ( Laser Body )
*/
(function(){
	
	var LaserGunImage = function(imageSrc){
		this.initialize(imageSrc);
	}
	
	var p = LaserGunImage.prototype = new LaserImageObject();
		
	p.laserGunImage_initialize = p.initialize;
	p.initialize = function(imageSrc){
		this.laserGunImage_initialize(imageSrc);
	}

	window.LaserGunImage = LaserGunImage;
}());

/*
* Target Point Object ( Targets )
*/
(function(){
	
	var TargetPointImage = function(imageSrc){
		this.initialize(imageSrc);
	}
	
	var p = TargetPointImage.prototype = new LaserImageObject();
		
	p.targetPoint_initialize = p.initialize;
	p.initialize = function(imageSrc){
		this.targetPoint_initialize(imageSrc);
	}

	window.TargetPointImage = TargetPointImage;
}());

/*
* Laser Point Object ( Laser Tip )
*/
(function(){
	
	var LaserPointImage = function(imageSrc){
		this.initialize(imageSrc);
	}
	
	var p = LaserPointImage.prototype = new LaserImageObject();
	p.laserPoint_initialize = p.initialize;
	p.initialize = function(imageSrc){
		this.laserPoint_initialize(imageSrc);
	}

	window.LaserPointImage = LaserPointImage;
}());

/*
* Background Image
*/
(function(){
	
	var BackgroundImage = function(imageSrc){
		this.initialize(imageSrc);
	}
	
	var p = BackgroundImage.prototype = new LaserImageObject();
	p.background_initialize = p.initialize;
	p.initialize = function(imageSrc){
		this.background_initialize(imageSrc);
	}

	window.BackgroundImage = BackgroundImage;
}());

/*
* Static Laser Image ( Screw )
*/
(function(){
	
	var LaserScrewTopImage = function(imageSrc){
		this.initialize(imageSrc);
	}
	
	var p = LaserScrewTopImage.prototype = new LaserImageObject();
	p.background_initialize = p.initialize;
	p.initialize = function(imageSrc){
		this.background_initialize(imageSrc);
	}

	window.LaserScrewTopImage = LaserScrewTopImage;
}());

