/*
* Level Data
*/
(function(){
		
	var LevelInformation = function(){
		
		var id 				= 	0,
			levelData		=	null,
			authorSolution 	=	null;
					
		return {
		
			/*
			* SET VALUES
			*/
			setId	:	function(id){
				if ( typeof id !== 'number')
					throw 'id should be a number';
					
				this.id = id;
			},
			
			setLevelData	:	function( levelData ){
				if ( typeof levelData !== 'object')
					throw 'invalid argument, type should be object';
				
				this.levelData = levelData;
			}, 
			
			setAuthorSolution	:	function( authorSolution ){
				if ( typeof authorSolution !== 'object')
					throw 'invalid argument, type should be object';
					
				this.authorSolution = authorSolution;
			},

			
			/*
			* GET VALUES
			*/
			getId : function(){
				return this.id;
			},
			
			getLevelData : function(){
				return this.levelData;
			},
			
			getAuthorSolution : function(){
				return this.authorSolution;
			}
			
		}
	}
	
	window.LevelInformation = LevelInformation;
}());