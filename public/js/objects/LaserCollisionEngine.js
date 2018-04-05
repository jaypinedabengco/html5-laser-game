/*
* Laser Image Main Class
*/
(function(){
	var LaserCollisionEngine = function(){
					
		var targetPoints, 
			laserPointers,
			stage;

		//private functions : 
		var getAngle = function(x1, y1, x2, y2 ){
			var a_width 	= 	x1 - x2; //angle width
			var a_height 	= 	y2 - y1; //angle height
			var angle 		= 	Math.atan(a_width / a_height ) * ( 180/Math.PI) - 90; //get angle
			
			if ( ( 	a_width >= 0 && a_height <= 0 ) && angle != 0 || 
				(	a_width <= 0 && a_height <= 0) && angle !== -180 ){ //If position is on lower side ( if y < 0 )
				angle = angle + 180;
			}  		

			return angle;		
		}
			
		return{
			//initialize
			initialize : function( targetPoints, laserPointers, stage){
				this.targetPoints = targetPoints;
				this.laserPointers = laserPointers;
				this.stage = stage;
			},
				
			/*
			* Main Collision Logic
			*/
			update : function(){
				//main logic if collision occured
				var lp = this.laserPointers;
				var tp = this.targetPoints;			
				
				for ( x in tp ){ //turn all off
					tp[x].changeImageToDefault();
				}
				
				for ( x in lp ){
				
					var lpx 			= 	lp[x].parent.x,
						lpy 			= 	lp[x].parent.y,
						targetLpx 		= 	lp[x].targetPointer.parent.x,
						targetLpy 		= 	lp[x].targetPointer.parent.y,
						lpTargetAngle 	= 	getAngle(lpx, lpy, targetLpx, targetLpy);
				
					for ( y in tp ){
						var tpx 	= 	tp[y].x,
							tpy 	= 	tp[y].y,
							tp_deg = getAngle( lpx, lpy, tpx, tpy );
													
						 // validate if target point is covered by moving gun
						 var covered = false;
						 if ( lpTargetAngle <= -90 && lpTargetAngle >= -180 ) {
							if ( tpx >= lpx && tpx <= targetLpx && tpy >= lpy && tpy <= targetLpy)
								covered = true;
						 } else if ( lpTargetAngle >= -90 && lpTargetAngle <= 0 ) {

							if ( tpx <= lpx && tpx >= targetLpx && tpy >= lpy && tpy <= targetLpy)
								covered = true;
						 } else if ( lpTargetAngle >= 0 && lpTargetAngle <=90 ) {
							if ( tpx <= lpx && tpx >=targetLpx && tpy <= lpy && tpy >= targetLpy)
								covered = true;
						 } else if ( lpTargetAngle >= 90 && lpTargetAngle <= 180 ) {
							if ( tpx >= lpx && tpx <=targetLpx && tpy <= lpy && tpy >= targetLpy)
								covered = true;
						 } else {
							console.log('something went wrong : ' + lpTargetAngle);
						 }						
						
						if ( covered && tp_deg >= ( lpTargetAngle - 1 ) && tp_deg <= (lpTargetAngle + 1 ))
							tp[y].changeImageToSelected();
					} 
					
				}
				
				this.stage.update();
			}, 
			
			isAllTargetOn : function(){
			
				var all = this.targetPoints.length;
				var ctr = 0;
				for ( var i = 0; i < all; i ++ ){
					if ( this.targetPoints[i].isSelected())
						ctr++;
				}
				
				if ( ctr >= all )
					return true;
				
				return false;			
			}
			
		}
						
	}
	
	window.LaserCollisionEngine = LaserCollisionEngine;
}());