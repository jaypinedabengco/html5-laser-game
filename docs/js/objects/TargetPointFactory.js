/*
* Laser Image Main Class
*/
(function(){
	var TargetPointFactory = function(){
					
		var defaultImage,
			selectedImage,
			targetPointStage;

		return{
			//initialize
			initialize : function( defaultImage, selectedImage , targetPointStage ){
			
				if ( 	!TargetPointImage.prototype.isPrototypeOf( defaultImage ) || 
						!TargetPointImage.prototype.isPrototypeOf( selectedImage ) ||
						typeof targetPointStage === 'undefined')
					throw 'invalid arguments';	
					
					this.defaultImage = defaultImage;
					this.selectedImage = selectedImage;
					this.targetPointStage = targetPointStage;
			
			},
				
			createTargetPoint : function(startX, startY){

				console.log(this.defaultImage);
				console.log(this.selectedImage);
				console.log(this.targetPointStage);
				
				if ( 	!TargetPointImage.prototype.isPrototypeOf( this.defaultImage ) || 
						!TargetPointImage.prototype.isPrototypeOf( this.selectedImage ) ||
						typeof this.targetPointStage === 'undefined' )
					throw 'Laser Gun factory may not be initialized, or check initialization arguments';
							
				return new TargetPointBitmap( 	this.defaultImage.getImageObject(), 
												this.selectedImage.getImageObject(),
												this.targetPointStage,
												startX, 
												startY
											);
			}
	
		}
	}
	
	window.TargetPointFactory = TargetPointFactory;
}());