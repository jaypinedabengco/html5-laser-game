/*
* Level Data
*/
(function(){
		
	var LevelData = function(){
		
		var targetPoints = 	new Array(),
			laserGuns	=	new Array(),
			laserConnections =	new Array();
		
		return {
		
			/*
			* SET VALUES
			*/
			addToTargetPoints : function( posX, posY ){
				if ( typeof posX != 'number' || typeof posY != 'number' )
					throw 'invalid arguments, should be number';
					
				targetPoints.push({x : posX, y : posY});
			},
			
			addToLaserGuns : function( posX, posY, isStatic ){
				console.log(isStatic);
				if ( typeof posX != 'number' || typeof posY != 'number' || typeof isStatic != 'boolean' )
					throw 'invalid arguments, should be numbers and a boolean';
					
				laserGuns.push({x : posX, y : posY, isStatic : isStatic });
			},
			
			addToLaserConnections : function( connFrom, connTo ){
				if ( typeof connFrom != 'number' || typeof connTo != 'number' )
					throw 'invalid arguments, should be number';
					
				laserConnections.push({connectFrom: connFrom, connectTo: connTo});
			},
			
			/*
			* GET VALUES
			*/
			
			getTargetPoints : function(){
				return targetPoints;
			},
			
			getLaserGuns : function(){
				return laserGuns;
			},
			
			getLaserConnections : function(){
				return laserConnections;
			}
		}
	}
	
	window.LevelData = LevelData;
}());