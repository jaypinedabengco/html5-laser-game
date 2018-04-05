/*
* LASER GUN GAME ENGINE
*/
var LasersGame = LasersGame || (function () {

	/*
	* Constants
		- these items will never change programmatically,
		  and will only be updated by the developer
	*/
	var constants =
		{
			version: '1.0',

			//Types:
			laserBodyTypes: [0, 1, 2, 3, 4], 									// refer to image location for image
			targetPointTypes: ['point_basic', 'PointPrizm', 'PointTwin'],

			colors: ['blue', 'green', 'orange', 'red', 'violet'],	//colors
			laserPointImage: 'laser.png', 								//laser point image
			backgroundImage: 'background_xna.png', 						//background image
			laserScrewTopImage: 'top_point_freezed.png',

			//defaults values
			defaults:
				{
					color: 'blue',
					laserBodyType: 3,
					targetPoint: 'PointPrizm',
					backgroundImage: 'default'
				},

			//static guns on main level
			staticGuns: [
				{
					level: 2,
					gunPos: 2
				},
				{
					level: 17,
					gunPos: 1
				},
				{
					level: 28,
					gunPos: 1
				}
			],

		};

	/*
	* Globals 
		- 	these items are intended to be changed by user
			based on requirements, such as :
			 * laserStage - canvas container, add other containers, 
				bitmaps, etc. to use as display ( refer to Easel.js documentary )
			 * image_location - location of images to use, and will change based on
				viewport used. ( refer to google, keyword : responsive web design )
			 * etc..
	*/
	var globals =
		{
			//main stage
			laserStage: '', //parent

			//children 
			containers: {
				laserLineStage: null,
				targetPointStage: null,
				laserContainerStage: null,
				laserScrewContainerStage: null,
			},

			factories: {
				laserGunFactory: new LaserGunFactory(),
				targetPointFactory: new TargetPointFactory(),
			},

			mainCanvas: 'mainCanvas',

			//images
			image_location: 'images/lasers/', //default

			levels_location: 'resources/levels/levels.txt',

			targetPoints: new Array(),	//container for created target points
			laserPointers: new Array(),	//container for laser pointers

			//current images
			current:
				{
					laserGunImage: null,
					targetPointImageDefault: null,
					targetPointImage: null,
					laserPointImage: null,
					backgroundImage: null,
				},

			Levels: new Array(), //container for parsed levels

			laserCollisionEngine: new LaserCollisionEngine(),

		};

	/*
	* Image Globals 
		- Array containers for pre loaded Laser Image Objects
		  refer to LaserImageObjectLib.js file for object
		  structure
	*/
	var imageGlobals =
		{
			laserGunImages: new Array(), //will be preloaded on init
			targetPointImages: new Array(), //will be preloaded on init
			targetPointImagesDefault: new Array(), //default image, not selected
			laserPointImage: null,
			backgroundImage: null,
			laserScrewTopImage: null
		}

	/*
	* Variables Used for Preloading Resources
	*/
	//images
	var queuedImages = new Array(),
		imagesLoaded = 0,
		imagesFailedToLoad = 0,
		imagesIndex = 0,

		//level
		queuedLevel = 0,
		levelLoaded = 0,
		levelLoadFailed = 0;

	/*	------------------
	*	PRIVATE FUNCTIONS
	*	--------------------*/

	/*
	* Resources Utilities
	*/
	var resourceUtils = {

		/* ------------------------------
		* 	PRELOAD IMAGES FUNCTIONS
		* --------------------------------*/

		imageLoadedCallback: function (e) {
			imagesLoaded++;
		},

		imageLoadErrorCallback: function (e) {
			imagesFailedToLoad++;
		},

		/*
			Load Images Individually, and set image objects to 
			individual array objects
			
			Image Object Fields
				- type
				- imageObject
				- imageUrl
		*/
		loadImage: function (imageObject) {
			//validate object

			var image = new Image();
			image.src = imageObject.getImageUrl();

			image.addEventListener('load', function (e) {
				resourceUtils.imageLoadedCallback(e);
			});

			image.addEventListener('error', function (e) {
				console.log('error!');
				resourceUtils.imageLoadErrorCallback(e);
			});

			imageObject.setImageObject(image);//set image object

			/*	
				Set to image array based on object type 
			*/
			if (LaserGunImage.prototype.isPrototypeOf(imageObject)) {

				console.log('laser gun image : ' + imageObject.getImageUrl());
				imageGlobals.laserGunImages.push(imageObject);

			} else if (TargetPointImage.prototype.isPrototypeOf(imageObject)) {

				console.log('target point image : ' + imageObject.getImageUrl());
				if (imageObject.getColor() === 'default')
					imageGlobals.targetPointImagesDefault.push(imageObject);
				else
					imageGlobals.targetPointImages.push(imageObject);

			} else if (LaserPointImage.prototype.isPrototypeOf(imageObject)) {

				console.log('laser point image : ' + imageObject.getImageUrl());
				imageGlobals.laserPointImage = imageObject;

			} else if (BackgroundImage.prototype.isPrototypeOf(imageObject)) {

				console.log('laser point image : ' + imageObject.getImageUrl());
				imageGlobals.backgroundImage = imageObject;

			} else if (LaserScrewTopImage.prototype.isPrototypeOf(imageObject)) {

				console.log('laser point image : ' + imageObject.getImageUrl());
				imageGlobals.laserScrewTopImage = imageObject;

			} else {
				console.log('not part of imageObject?, something i VERY wrong here');
			}
		},

		/*
		* Add Image object to queued image to load
		*/
		queueImage: function (imageObject) {
			queuedImages.push(imageObject);
		},

		/*
		* Add Image object by group
		*/
		queueImageByBatch: function (imageObjects) {
			for (x in imageObjects) {
				resourceUtils.queueImage(imageObjects[x]);
			}
		},

		/*
		* Get Laser Body from Filepath
		*/
		getLaserBodyImagesFromFile: function () {

			var laserBodyFile_keyword = "point_movable";
			var laserBodyTotal = constants.laserBodyTypes.length;
			var laserBodyObjects = new Array();

			for (var i = 0; i < laserBodyTotal; i++) {
				for (var j = 0; j < constants.colors.length; j++) {

					var imageLocation = globals.image_location + laserBodyFile_keyword
					imageLocation += (i == 0) ? "_" : i + "_"; //verify if default or what
					imageLocation += constants.colors[j] + ".png";

					var laserGunImage = new LaserGunImage(imageLocation);
					laserGunImage.setType(i);
					laserGunImage.setColor(constants.colors[j]);

					laserBodyObjects.push(laserGunImage);
				}
			}

			return laserBodyObjects;
		},

		/*
		* Get Target Points from Filepath
		*/
		getTargetPointImagesFromFile: function () {

			var tp_default_keyword = constants.targetPointTypes[0];
			var tp_prism_keyword = constants.targetPointTypes[1];
			var tp_twin_keyword = constants.targetPointTypes[2];

			var targetPointsTotal = constants.targetPointTypes.length;
			var targetPointObjects = new Array();

			for (var i = 0; i < targetPointsTotal; i++) {
				for (var j = 0; j <= constants.colors.length; j++) {

					var keyword = (i == 0) ? tp_default_keyword : (i == 1) ? tp_prism_keyword : tp_twin_keyword;
					var imageColor = (j == constants.colors.length) ?
						"" : (i == 0) ?
							"_selected_" + constants.colors[j] : "_" + constants.colors[j];

					var imageLocation = globals.image_location;
					imageLocation += keyword;
					imageLocation += imageColor + ".png";

					var targetPointImage = new TargetPointImage(imageLocation);
					targetPointImage.setType(keyword);
					targetPointImage.setColor((j == constants.colors.length) ? 'default' : constants.colors[j]);

					targetPointObjects.push(targetPointImage);
				}
			}

			return targetPointObjects;
		},

		/*
		* Get Laser Points from Filepath
		*/
		getLaserPointImagesFromFile: function () {
			var laserPointImage = new LaserPointImage(globals.image_location + constants.laserPointImage);
			laserPointImage.setType('laserPoint');
			laserPointImage.setColor('default');

			return laserPointImage;
		},

		/*
		* Get Background Image from Filepath
		*/
		getBackgroundImagesFromFile: function () {
			var backgroundImage = new BackgroundImage(globals.image_location + constants.backgroundImage);
			backgroundImage.setType('background');
			backgroundImage.setColor('default');

			return backgroundImage;
		},

		/*
		* Get Background Image from Filepath
		*/
		getLaserScrewTopImageFromFile: function () {
			var laserScrewTopImage = new LaserScrewTopImage(globals.image_location + constants.laserScrewTopImage);
			laserScrewTopImage.setType('laserScrewTopImage');
			laserScrewTopImage.setColor('default');

			return laserScrewTopImage;
		},

		/* -------------------------
			PRELOAD IMAGES FUNCTIONS END
		----------------------------*/

		/* -------------------------
			PRELOAD LEVELS FUNCTIONS END
		----------------------------*/
		getLevelviaAjax: function () {
			queuedLevel++;

			var xmlhttp;
			if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp = new XMLHttpRequest();
			}
			else {// code for IE6, IE5
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {

						console.log('Successfully got level from location, now currently converting.....');

						levelLoaded++;	//increment level loaded	
						globals.Levels = new Array();

						var levels = xmlhttp.responseText;
						var levelObject = JSON.parse(levels);
						var staticGunInfo = constants.staticGuns;

						/*
						* Level Object Structure :
							id : int
							level_data : string
							authors_solution : string
						*/
						//add levels to level array logic
						for (x in levelObject) {
							var id = levelObject[x].id,
								levelData = levelObject[x].level_data,
								authorsSolution = levelObject[x].authors_solution;

							var gunPosition = null;
							for (y in staticGunInfo) { //check if level has static guns
								if (id == staticGunInfo[y].level)
									gunPosition = staticGunInfo[y].gunPos;
							}

							var levelDataObject = lasersUtils.createLevelMapObjectFromString(levelData, gunPosition);
							var authorsSolutionObject = lasersUtils.createLevelMapObjectFromString(authorsSolution, gunPosition);

							var lvlInfo = new LevelInformation();
							lvlInfo.setId(id);
							lvlInfo.setLevelData(levelDataObject);
							lvlInfo.setAuthorSolution(authorsSolutionObject);

							//ADD MAPPED LEVEL TO GLOBAL
							globals.Levels.push(lvlInfo);
						}
						console.log(' Conversion successful, now added to Globals Levels Array.....');
					} else {
						console.log(' Loading map failed');
						levelLoadFailed++; //increment level failed
						throw "unable to get level from " + globals.levels_location;
					}
				}
			};
			xmlhttp.open("GET", globals.levels_location, true);
			xmlhttp.send();
		},

		/*
		* Primary function used to 
		  check if Resources are fully loaded, 
		  
		  returns int :
			< 100 = not yet loaded
			  100 = all resources are loaded
		*/
		loadResources: function () {

			//image
			if (imagesIndex < queuedImages.length) {
				resourceUtils.loadImage(queuedImages[imagesIndex]);
				imagesIndex++; //increment image under process
			}

			var resourcesLoaded = (imagesLoaded + imagesFailedToLoad + levelLoaded + levelLoadFailed);
			var totalResourcesOnQueue = (queuedImages.length + queuedLevel);

			//return percent of resources loaded
			return (resourcesLoaded) / totalResourcesOnQueue * 100;

		},

	}

	var levelUtils = {

		getLevelInfoViaId: function (id) {
			var Levels = globals.Levels;
			for (x in Levels) {
				if (Levels[x].id === id)
					return Levels[x];
			}

			throw "invalid id information";
		}

	}

	/*----------------
	*	LASER UTILITIES
	* -----------------*/
	var lasersUtils = {

		setCurrentImages: function () {
			//check if browser storage has info on current options (n/a)
			/* under construction */
			//end

			var defaults = constants.defaults;

			var laserGunImages = imageGlobals.laserGunImages;
			var targetPointImages = imageGlobals.targetPointImages;
			var targetPointImagesDefault = imageGlobals.targetPointImagesDefault;
			var laserPoint = imageGlobals.laserPointImage;
			var background = imageGlobals.backgroundImage;

			//globals.current.laserGunImage
			//set current laser gun body
			var i = 0;
			for (i = 0; i < laserGunImages.length; i++) {
				if (defaults.color == laserGunImages[i].getColor() &&
					defaults.laserBodyType == laserGunImages[i].getType()) {

					globals.current.laserGunImage = laserGunImages[i]; //SET CURRENT LASER GUN BODY
				}
			}

			//set target point
			for (i = 0; i < targetPointImages.length; i++) {
				if (defaults.color == targetPointImages[i].getColor() &&
					defaults.targetPoint == targetPointImages[i].getType()) {

					globals.current.targetPointImage = targetPointImages[i]; //SET CURRENT SELECTED TARGET
				}
			}

			//set target point default
			for (i = 0; i < targetPointImagesDefault.length; i++) {
				if (defaults.targetPoint == targetPointImagesDefault[i].getType()) {
					globals.current.targetPointImageDefault = targetPointImagesDefault[i]; //SET CURRENT DEFAULT TARGET
				}
			}

			//set laser point
			globals.current.laserPointImage = laserPoint;

			//set background
			globals.current.backgroundImage = background;

		},

		/*
		* Convert LaserLevel Information from String into a 
			LevelMapObject :
			Level Map Object {  //array
				targetPoints 	 : {},
				laserGuns		 : {},
				laserConnections : {}
			}
		*/
		createLevelMapObjectFromString: function (str, staticGunPosition) {

			//console.log(staticGunPosition);
			if (typeof str != 'string')
				throw 'invalid argument';

			str = str.replace('{', '');
			str = str.replace('}', '');

			var strSplit = str.split('|');

			if (strSplit.length < 1)
				throw 'invalid argument';

			var sep = 1.5;

			var levelMapObject = new LevelData();
			var currentGunPosition = 1;
			for (x in strSplit) {

				var lvlInfo = strSplit[x].split(";");
				if (lvlInfo[0] == 0) { //target points

					levelMapObject.addToTargetPoints(parseInt(lvlInfo[1]) * sep, parseInt(lvlInfo[2]) * sep);

				} else if (lvlInfo[0] == 1) { //laser guns

					if (currentGunPosition === staticGunPosition)
						levelMapObject.addToLaserGuns(parseInt(lvlInfo[1]) * sep, parseInt(lvlInfo[2]) * sep, true);
					else
						levelMapObject.addToLaserGuns(parseInt(lvlInfo[1]) * sep, parseInt(lvlInfo[2]) * sep, false);

					currentGunPosition++;
				} else if (lvlInfo[0] == 3) { // laser gun connections
					levelMapObject.addToLaserConnections(parseInt(lvlInfo[2]), parseInt(lvlInfo[1]));
				} else {
					throw 'something very wrong happened here';
				}
			}

			return levelMapObject;
		}

	}

	var lasersCanvas = {

		/*
		*
		*/
		goToLevel: function (levelId) {

			var levelInformation = levelUtils.getLevelInfoViaId(levelId);
			lasersCanvas.setLaserGuns(levelInformation.getLevelData()); 			//set laser gun
			lasersCanvas.setTargetPoints(levelInformation.getLevelData()); 		//set target points

			//set targetpoints and laser pointers to collision engine
			globals.laserCollisionEngine.initialize(globals.targetPoints, globals.laserPointers, globals.laserStage);
			globals.laserCollisionEngine.update(); //initial run
		},

		goToLevelWithAuthorsSolution: function (levelId) {

			var levelInformation = levelUtils.getLevelInfoViaId(levelId);
			lasersCanvas.setLaserGuns(levelInformation.getAuthorSolution()); //set laser gun
			lasersCanvas.setTargetPoints(levelInformation.getLevelData());  //set target points

			//set targetpoints and laser pointers to collision engine
			globals.laserCollisionEngine.initialize(globals.targetPoints, globals.laserPointers, globals.laserStage);
			globals.laserCollisionEngine.update(); //initial run
		},

		/*
		* Add laser guns to canvas 
		  based on Level Map information object
		*/
		setLaserGuns: function (levelData) {

			console.log('adding laser guns');

			//level map information object validation
			if (typeof levelData !== 'object')
				throw 'not object';

			//clear all previous children
			globals.containers.laserContainerStage.removeAllChildren();
			globals.containers.laserLineStage.removeAllChildren();
			globals.containers.laserScrewContainerStage.removeAllChildren();

			console.log(imageGlobals.laserScrewTopImage);
			var laserGunFactory = globals.factories.laserGunFactory;
			laserGunFactory.initialize(
				globals.current.laserGunImage,
				globals.current.laserPointImage,
				imageGlobals.laserScrewTopImage,
				globals.containers.laserContainerStage,
				globals.containers.laserLineStage,
				globals.containers.laserScrewContainerStage,
				globals.laserCollisionEngine
			);


			var createdLasers = new Array();
			var laserGunsArr = levelData.getLaserGuns();

			var laserConnections = levelData.getLaserConnections();

			for (x in laserGunsArr) {

				//var lg = laserGunFactory.createLaserGun(laserGunsArr[x].x, laserGunsArr[x].y );
				var lg = null;
				if (laserGunsArr[x].isStatic !== true)
					lg = laserGunFactory.createLaserGun(laserGunsArr[x].x, laserGunsArr[x].y);
				else
					lg = laserGunFactory.createStaticLaserGun(laserGunsArr[x].x, laserGunsArr[x].y);

				createdLasers.push(lg);
			}

			var cd = new Array(); // (connection directory ) get tab if connection is already established
			for (x in laserConnections) {
				createdLasers[laserConnections[x].connectFrom].connectTo(createdLasers[laserConnections[x].connectTo]);
			}

			//set created point lasers to global point laser handler
			globals.laserPointers.length = 0; //empty previous
			for (x in createdLasers) {
				var pointLasers = createdLasers[x].children;
				for (y in pointLasers) {
					if (LaserPointerBitmap.prototype.isPrototypeOf(pointLasers[y]))
						globals.laserPointers.push(pointLasers[y]);
				}
			}

			globals.laserStage.update();
		},

		/*
		* Add targetPoints to canvas 
		  based on Level Map information object
		*/
		setTargetPoints: function (levelData) {
			if (typeof levelData !== 'object')
				throw 'not object';

			globals.containers.targetPointStage.removeAllChildren();//clear all children

			var defaultImage = globals.current.targetPointImageDefault;
			var selectedImage = globals.current.targetPointImage;

			var targetPointFactory = globals.factories.targetPointFactory;
			targetPointFactory.initialize(defaultImage, selectedImage, globals.containers.targetPointStage);

			var lvlTP = levelData.getTargetPoints();

			globals.targetPoints.length = 0; //empty previous
			for (x in lvlTP) {
				globals.targetPoints.push(targetPointFactory.createTargetPoint(lvlTP[x].x, lvlTP[x].y));
			}

			globals.laserStage.update();
		},

		/*
		* Add Background to canvas 
		  based on Level Map information object
		*/
		setBackground: function () {

			globals.laserStage.addChild(new createjs.Bitmap(globals.current.backgroundImage.getImageObject()));
			globals.laserStage.update();

			/*
			var graphLine = new createjs.Shape();
			
			graphLine.alpha = .8;
			graphLine.graphics.setStrokeStyle(1).beginStroke("gray").beginFill("#F00");
			
			var lsBounds 		=  globals.laserStage.getBounds();			
			var glX = 0;
			var glY = 0;
			
			var lsWidth = lsBounds.width;
			var lsHeight = lsBounds.height;
			var bounds = 20;
			
			//Horizonal line : 
			
			for (  var i = 0 ; i <= lsHeight; i = i+ bounds ) {
				graphLine.graphics.moveTo(0,i);
				graphLine.graphics.lineTo(lsWidth,i);
			}
			
			//Vertical line : 
			for (  var i = 0 ; i <= lsWidth; i = i+ bounds ) {
				graphLine.graphics.moveTo( i , 0 );
				graphLine.graphics.lineTo( i , lsWidth);
			}
						
			//event listener ( debug );
			globals.laserStage.addEventListener('click', function(evt){
				console.log("( x : " + Math.floor( evt.stageX )+ ", y : " + Math.floor( evt.stageY ) + " )");
			});
						
						
			globals.laserStage.addChild(graphLine);
			globals.laserStage.update();	
			*/

		},

	}


	/*	------------------
	*	PUBLIC FUNCTIONS
	*	--------------------*/
	return {

		/*
		* Prepare game resources
		*/
		init: function () {
			//set canvas
			console.log(globals);
			globals.laserStage = new createjs.Stage(globals.mainCanvas);

			console.log(globals.laserStage.getBounds());
			//create containers
			for (x in globals.containers) {
				console.log(globals.containers[x]);
				globals.containers[x] = new createjs.Container();
				console.log(globals.containers[x]);
			}

			/*
			* PRELOAD Resources
			*/

			//Images
			resourceUtils.queueImageByBatch(resourceUtils.getLaserBodyImagesFromFile());
			resourceUtils.queueImageByBatch(resourceUtils.getTargetPointImagesFromFile());
			resourceUtils.queueImage(resourceUtils.getLaserPointImagesFromFile());
			resourceUtils.queueImage(resourceUtils.getBackgroundImagesFromFile());
			resourceUtils.queueImage(resourceUtils.getLaserScrewTopImageFromFile());

			//Levels
			resourceUtils.getLevelviaAjax();

			loadingInterval = setInterval(function (e) {
				loadingPercentage = Math.floor(resourceUtils.loadResources());

				if (loadingPercentage == 100) {
					clearInterval(loadingInterval); // stop loop
					console.log('Resources fully loaded');

					//set canvas width and height based on background : 
					globals.laserStage.canvas.width = imageGlobals.backgroundImage.getImageObject().width;
					globals.laserStage.canvas.height = imageGlobals.backgroundImage.getImageObject().height;

					lasersUtils.setCurrentImages();
					lasersCanvas.setBackground();
					//set lasers stage bounds
					globals.laserStage.setBounds(0, 0, globals.laserStage.canvas.width, globals.laserStage.canvas.height);

					//set containers after background was set: 
					for (x in globals.containers) {
						var gbounds = globals.laserStage.getBounds();
						globals.containers[x] = new createjs.Container();
						globals.containers[x].setBounds(gbounds.x, gbounds.y, gbounds.width, gbounds.height);
						globals.laserStage.addChild(globals.containers[x]);
					}

					lasersCanvas.goToLevel(1);

				} else {
					console.log('Resources currently loading... : ' + loadingPercentage + '%');
				}
			}, 50);
		},

		tempChangeLevel: function (levelId) {
			lasersCanvas.goToLevel(levelId);
		},

		tempShowSolution: function (levelId) {
			lasersCanvas.goToLevelWithAuthorsSolution(levelId);
		}
	}


})();