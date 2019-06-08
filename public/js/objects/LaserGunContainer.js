/*
*	LASER GUNS Container( Base )
*/
(function() {
	
	//variables		
	var LaserGunContainer = function( laserBodyImageSrc, laserPointImageSrc,
									  staticLaserTopImageSrc, isStaticLaser,
									  laserContainerStage, laserLineStage, 
									  laserScrewContainerStage, laserCollisionEngine, 
									  startX, startY ){
									  
		this.initialize(	laserBodyImageSrc, laserPointImageSrc, 
							staticLaserTopImageSrc, isStaticLaser,		
							laserContainerStage, laserLineStage, 
							laserScrewContainerStage ,laserCollisionEngine, 
							startX, startY 
						);
		
	}
	
	//inherite
	var p = LaserGunContainer.prototype = new createjs.Container();
				
	//containers :
	p.stage;
	p.laserContainerStage;
	p.laserLineStage;
	p.laserScrewContainerStage;

	//images
	p.laserGunBitmap;
	p.laserScrewTopImage
	p.laserBodyImageSrc;
	p.laserPointImageSrc;
	
	//collision engine
	p.laserCollisionEngine;
	
	//type 
	p.isStaticLaser;
	
	//run initialization
	p.Container_initialize = p.initialize;	
	p.initialize = function( 	laserBodyImageSrc, laserPointImageSrc, 
								laserScrewTopImage, isStaticLaser,		
								laserContainerStage, laserLineStage,
								laserScrewContainerStage,								
								laserCollisionEngine, startX, startY 
							){
							
		this.Container_initialize();
		
		//set stage
		this.stage 					= 	laserContainerStage.parent;
		this.laserContainerStage 	= 	laserContainerStage;
		this.laserLineStage 		= 	laserLineStage;
		this.laserScrewContainerStage = laserScrewContainerStage;
		
		//images
		this.laserBodyImageSrc 		= 	laserBodyImageSrc;
		this.laserPointImageSrc 	= 	laserPointImageSrc;
		this.laserScrewTopImage		= 	laserScrewTopImage;

		//collision engine
		this.laserCollisionEngine 	= 	laserCollisionEngine;
		
		//set type ( static or not ) i.e., with screw or not
		this.isStaticLaser 			=	isStaticLaser;
		
		//set starting position
		if ( startX !== undefined )
			this.x = startX;
			
		if ( startY !== undefined )
			this.y = startY;		
					
		//create gun
		this.laserGunBitmap = new LaserGunBitmap(laserBodyImageSrc); //create laser gun image
		this.setBounds(0,0,this.laserGunBitmap.getBounds().width, this.laserGunBitmap.getBounds().height);//set containers bounds
		this.addChild(this.laserGunBitmap);	
				
		//Set point to center :
		this.regY = this.getBounds().height / 2;
		this.regX = this.getBounds().width / 2;
		
		//validate position:
		var canvasBounds = this.stage.getBounds();
		
		var topLength = ( canvasBounds.height * 0.11 ),
			minY = topLength,
			maxY = ( canvasBounds.height - topLength ),
			minX = 0,
			maxX = ( canvasBounds.width );
		
		//add top length
		this.x += topLength;
		
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

				//set screw if static
		if (  isStaticLaser ){
			var screwImage = new createjs.Bitmap( laserScrewTopImage );
			screwImage.x = this.x;
			screwImage.y = this.y;
			
			screwImage.regX = screwImage.getBounds().width / 2;
			screwImage.regY = screwImage.getBounds().height / 2;
			
			this.laserScrewContainerStage.addChild(screwImage);
			
			
			
		}
		
		
		//Initial Configuration
		//make guns and pointers unclickable
		this.mouseChildren = false;
		
		//event listeners
		this.addEventListener('pressmove', this.handlePressMove);
		this.addEventListener('pressup', this.handlePressMove);
		
		//set laser gun container to appropriate container
		this.laserContainerStage.addChild(this);
		this.stage.update();
	}
	
	/* ----------------------
	* 	PUBLIC FUNCTIONS
	*  --------------------*/
	
	/*
	* Connect Two Containers by creating laser pointers
	*/
	LaserGunContainer.prototype.connectTo = function(laserGunContainer){
	
		if ( laserGunContainer.classname !== this.classname)
			throw "Invalid Class type, should be Laser Gun Container";

		var me = this;	

		var p1 = new LaserPointerBitmap(	me.laserPointImageSrc, me.getBounds().width, me.getBounds().height 	);			
		var p2 = new LaserPointerBitmap(	me.laserPointImageSrc, me.getBounds().width, me.getBounds().height 	);
		
		
		//setup laser pointer
		var laserLine = new createjs.Shape();
		me.laserLineStage.addChild(laserLine);

		p2.setLaserLine(laserLine);
		p1.setLaserLine(laserLine);
		
		// add pointers to designated laser gun holders
		me.addChild(p1);	// this 
		laserGunContainer.addChild(p2); // target 
					
		//setup pointers position ( IMPORTANT! : should connect only after having a parent)
		p1.connectTo(p2);
		p2.connectTo(p1);			
		
		// update target
		me.stage.update();
	}
		
	/* --------------------
	*  	PRIVATE FUNCTIONS
	*  -------------------*/
	
	/*
	*	Laser pointer position update
	*/
	p.handlePressMove = function(evt){
	
		var stage = evt.target.stage
		
		var evtChildren = evt.target.children;
		
		for ( x in evtChildren ){ 

			if ( LaserPointerBitmap.prototype.isPrototypeOf(evtChildren[x]) ){
				evtChildren[x].positionUpdate();
			}		
			
			/*if ( evtChildren[x].classname !== undefined && evtChildren[x].classname.toLowerCase() == "laserpointerbitmap" ){
				evtChildren[x].positionUpdate();
			}*/
			
		}
		
		/*
		* Collision Logic
		*/
		evt.target.laserCollisionEngine.update();
		
		//test 
		var testGameComplete = document.getElementById('testGameComplete');
		if ( evt.target.laserCollisionEngine.isAllTargetOn()){
			console.log('game complete');
			testGameComplete.innerHTML  = "Success!!!!!!!!!!!! Wohhhhhhh!!!! yeah!!!!!!!!!!!!!!";
		} else {
			testGameComplete.innerHTML  = "";
		}
			
		
		//end
		
		if ( evt.target.isStaticLaser == false ) { // if static, then don't move target item
		
			evt.target.x = evt.stageX;
			evt.target.y = evt.stageY;

			var cw = evt.target.getBounds().width / 2;
			var ch = evt.target.getBounds().height / 2;
			
			if ( evt.target.x > ( stage.canvas.width - cw ))
				evt.target.x = stage.canvas.width - cw;
			else if (evt.target.x < cw )
				evt.target.x = cw;
				
			if ( evt.target.y > ( stage.canvas.height - ch ) )
				evt.target.y = stage.canvas.height - ch;
			else if (  evt.target.y < ch )
				evt.target.y = ch;
		
		}
		
		stage.update(evt);
	}
		
	window.LaserGunContainer = LaserGunContainer;
}());