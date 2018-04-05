/*
* Laser Image Main Class
*/
(function(){
	var LaserGunFactory = function(){
					
		var laserGunImage,
			laserPointImage,
			laserScrewTopImage,
			laserContainerStage,
			laserLineStage,
			laserScrewContainerStage,
			laserCollisionEngine;
		
		return{
			//initialize
			initialize : function(	laserGunImage, laserPointImage , 
									laserScrewTopImage, laserContainerStage, 
									laserLineStage, laserScrewContainerStage,
									laserCollisionEngine){
			
				if ( 	!LaserGunImage.prototype.isPrototypeOf( laserGunImage ) || 
						!LaserPointImage.prototype.isPrototypeOf( laserPointImage ) ||
						!LaserScrewTopImage.prototype.isPrototypeOf( laserScrewTopImage ) ||
						typeof laserContainerStage === 'undefined' || 
						typeof laserScrewContainerStage === 'undefined' || 
						typeof laserLineStage === 'undefined' )
					throw 'invalid arguments';	
			
				this.laserContainerStage 	= 	laserContainerStage;
				this.laserLineStage 		= 	laserLineStage;
				this.laserScrewContainerStage = laserScrewContainerStage;
				
				this.laserGunImage 			= 	laserGunImage;
				this.laserPointImage 		= 	laserPointImage;
				this.laserScrewTopImage 	= 	laserScrewTopImage;
				
				this.laserCollisionEngine 	= 	laserCollisionEngine;
			},
				
			createLaserGun : function(startX, startY){

				if ( 	!LaserGunImage.prototype.isPrototypeOf( this.laserGunImage ) || 
						!LaserPointImage.prototype.isPrototypeOf( this.laserPointImage ) ||
						!LaserScrewTopImage.prototype.isPrototypeOf( this.laserScrewTopImage ) ||						
						typeof this.laserContainerStage === 'undefined' || 
						typeof this.laserScrewContainerStage === 'undefined' || 						
						typeof this.laserLineStage === 'undefined' )
					throw 'Laser Gun factory may not be initialized, or check initialization arguments';
							
				return new LaserGunContainer( 	this.laserGunImage.getImageObject(), 
												this.laserPointImage.getImageObject(),
												this.laserScrewTopImage.getImageObject(),
												false,
												this.laserContainerStage, 
												this.laserLineStage,
												this.laserScrewContainerStage,
												this.laserCollisionEngine,
												startX, 
												startY );
			}, 
			
			createStaticLaserGun : function(startX, startY){

				if ( 	!LaserGunImage.prototype.isPrototypeOf( this.laserGunImage ) || 
						!LaserPointImage.prototype.isPrototypeOf( this.laserPointImage ) ||
						!LaserScrewTopImage.prototype.isPrototypeOf( this.laserScrewTopImage ) ||						
						typeof this.laserContainerStage === 'undefined' || 
						typeof this.laserScrewContainerStage === 'undefined' || 							
						typeof this.laserLineStage === 'undefined' )
					throw 'Laser Gun factory may not be initialized, or check initialization arguments';
							
				return new LaserGunContainer( 	this.laserGunImage.getImageObject(), 
												this.laserPointImage.getImageObject(),
												this.laserScrewTopImage.getImageObject(),
												true,
												this.laserContainerStage, 
												this.laserLineStage,
												this.laserScrewContainerStage,
												this.laserCollisionEngine,
												startX, 
												startY );
			}
	
		}
	}
	
	window.LaserGunFactory = LaserGunFactory;
}());