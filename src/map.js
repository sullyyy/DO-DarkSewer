

class Game_Object {
	constructor(id,dynamic,i,j,obj) {
		this.id = id;
		this.dynamic = dynamic;
		this.i = i;
		this.j = j;
		this.obj = obj;
	}

	//returning z index of game object 
	get_z_index(){
		
		if(!this.dynamic)
		{
			if(this.obj.group == "FLOOR")
				return 0;
			else
				return (this.i*100 + this.obj.hitboxY + this.obj.hitboxH + this.obj.customZIndex);
		}
		//dynamic obj
		else
		{
			if(this.obj.group == "BLOOD_DROP")
				return 1;
			else
				return (this.obj.y + this.obj.h);
		}
	}

	draw()
	{
		//drawing dynamic objects
		if(this.dynamic)
		{
			//not drawing dynamic obj in editor
			if(gameState == EDITOR)
				return;

			//drawing dynamic object
			this.obj.draw();
			return;
		}

		//if not dynamic, getting obj data
		let destX = this.j*100+camera.offSetX + this.obj.decalX;
		let destY = this.i*100+camera.offSetY + this.obj.decalY;
		let srcX = this.obj.draw_id*100;
		let srcY = 0;
		if(this.obj.animated)
			srcY = Animation.updateTileAnimation(this.obj.group);
		let srcW = this.obj.srcW;
		let srcH = this.obj.srcH;
		let destW = srcW;
		let destH = srcH;

		//drawing
		image(map.img_array[0],destX,destY,destW,destH,srcX,srcY,srcW,srcH);

		//drawing shadow
		if(this.obj.group == "FLOOR" || this.obj.group == "WALL" )
			map.drawDarkness(destX, destY, 100, 100);

		//drawing light
		if(this.obj.lightType != -1)
			Light.draw(this.i,this.j,this.obj.decalX,this.obj.decalY,this.obj.lightType);

		//drawing hitboxes
		if(this.obj.group != "FLOOR")
			map.drawHitbox(this,destX,destY);

		//displaying text info on tile
		/*push()
			stroke("black")
			textSize(10)
			text(this.get_z_index(),destX+50,destY);
		pop()*/
	}
}

class Level {
	constructor (id,name,sizeX,sizeY,loading,lvl) {
		//loading level from file
		if(loading)
		{
			this.loadLevel(lvl)
			return;
		}
		//creating empty level
		this.id = id;
		this.name = name;
		this.sizeX = sizeX;
		this.sizeY = sizeY;

		this.floor_array;
		this.game_obj_array;
		this.enemies = [];

		this.create();
	}

	saveEnemiesPosition(){
		let tab = [];
		for(let i = 0; i < this.enemies.length;i++)
			tab.push({x:this.enemies[i].x,y:this.enemies[i].y})
		
		return tab;
	}

	loadEnemies(tab){
		for(let i = 0; i < tab.length;i++)
			this.enemies.push(new Zombie(tab[i].x,tab[i].y,36,70,anim_zombie,1001));

	}

	//saving lvl to json file
	saveLevel(){
		//creating temp lvl obj
		let lvl = {};

		//getting data to save
		lvl.id = this.id;
		lvl.name = this.name;
		lvl.sizeX = this.sizeX;
		lvl.sizeY = this.sizeY;
		lvl.game_obj_array = this.game_obj_array;
		lvl.enemiesPosition = this.saveEnemiesPosition();

		//saving
		File.save(lvl,lvl.name);
	}

	//loading level from file
	loadLevel(lvl){
		this.id = lvl.id;
		this.name = lvl.name;
		this.sizeX = lvl.sizeX;
		this.sizeY = lvl.sizeY;
		this.game_obj_array = lvl.game_obj_array;
		this.enemies = [];

		this.createFloorArray();

		//this.createEnemies();
		this.loadEnemies(lvl.enemiesPosition)

		this.z_index_map = [];

		this.sort();
	}

	create(){
		this.floor_array = [];
		this.game_obj_array = [];
		this.enemies = [];
		this.createFloorArray();
		this.createGameObjArray();
		this.createEnemies();
		
		this.z_index_map = [];

		this.sort();
	}

	//initializes floor array with empty tiles
	createFloorArray(){
		this.floor_array = new Array(this.sizeX+1);
		
		for (var i = 0; i < this.floor_array.length; i++) {
			this.floor_array[i] = new Array(this.sizeY+1);
		}
		
		for(let i = 0; i < this.sizeX; i++)
			{
				for(let j = 0; j < this.sizeY; j++)
				{
					this.floor_array[i][j] = new Empty_Tile();
				}
			}
	}

	//initializes game obj array
	createGameObjArray(){
		this.game_obj_array = new Array(this.sizeX+1);
		
		for (var i = 0; i < this.game_obj_array.length; i++) {
			this.game_obj_array[i] = new Array(this.sizeY+1);
		}
	}

	//creating enemies for the level
	createEnemies(){
		this.enemies.push(new Zombie(700,800,36,70,anim_zombie,1001));
		//this.enemies.push(new Zombie(500,500,36,70,anim_zombie,1002));
		//this.enemies.push(new Zombie(200,400,36,70,anim_zombie,1003));
	}

	//updating enemies for the level
	updateEnemies(){
		for(let i = 0; i < this.enemies.length;i++)
			this.enemies[i].update();
	}

	//adding tiles to draw list and sorting by z index
	sort()
	{
		this.z_index_map = [];
		//going over floor_array to add tiles to draw list
		for(let i = 0; i < this.sizeX; i++)
		{
			for(let j = 0; j < this.sizeY; j++)
			{
				//adding  empty floor tiles
				let obj = this.floor_array[i][j];
				this.z_index_map.push(new Game_Object(0, false, i,j,obj))

				//adding game object tiles
				if (this.game_obj_array[i][j] != null)
				{
					let obj = this.game_obj_array[i][j];
					this.z_index_map.push(new Game_Object(0, false, i,j,obj));
				}


			}
		}
		
		//adding player
		this.z_index_map.push(new Game_Object(1000, true, 0,0,player));

		//adding enemies
		for(let i = 0; i < this.enemies.length;i++)
			this.z_index_map.push(new Game_Object(1001, true, 0,0,this.enemies[i]));

		this.add_special_obj();
		
		//sorting by z index
		this.z_index_map.sort(function(a, b){return a.get_z_index() - b.get_z_index()});
	}

	add_special_obj(){
		if(this.id == 6)
		{
			//this.z_index_map.push(new Game_Object(8500, true, (this.x+camera.offSetX),(this.y+camera.offSetY),new M_Car()));
			this.z_index_map.push(new Game_Object(8500, true, (this.x+camera.offSetX),(this.y+camera.offSetY),m_deadzombie));
			this.z_index_map.push(new Game_Object(8500, true, (this.x+camera.offSetX),(this.y+camera.offSetY),m_keycard));
			//map.levels[7].resort();
			
		}
		if(this.id == 7)
		{
			//this.z_index_map.push(new Game_Object(8500, true, (this.x+camera.offSetX),(this.y+camera.offSetY),new M_Car()));
			this.z_index_map.push(new Game_Object(8500, true, (this.x+camera.offSetX),(this.y+camera.offSetY),m_car));
			//map.levels[7].resort();
			
		}
	}

	resort(){
		//resorting by z index
		this.z_index_map.sort(function(a, b){return a.get_z_index() - b.get_z_index()});
	}


	//resetting level
	reset(){

		//this.enemies = [];
		
		//this.createFloorArray();
		//this.createGameObjArray();
		//this.createEnemies();
		
		this.z_index_map = [];

		this.sort();
	}
	
}

class Map {
	constructor () {
		
		this.img_array = this.loadImgs();
		
		this.levels = [];
		this.curent_level = 0;
		
		this.addLevels();


		
		this.lastLvlTrans = new Date().getTime();
		this.lvltransframe = 0;
		
	}
	
	//loading tile imgs
	loadImgs()
	{
		let r = [];
		
		/*r.push(data_0);
		r.push(data_1);
		r.push(data_2);
		r.push(data_3);
		r.push(data_4);*/

		r.push(data_0a);
		
		return r;
	}

	//resetting levels
	resetLevels(){
		for(let i = 0; i < this.levels.length;i++)
			this.levels[i].reset();
		camera.resetCameraPos();
		//player.setSpawnPosition();
		player.reset();
		camera.lookAtObj(player);
		camera.update();
	}
	
	
	//adding levels to map
	addLevels(){
		this.levels.push(new Level(0,"spawn",10,10,true,lvl1));
		this.levels.push(new Level(1,"corridor1",10,15,true,lvl2));
		this.levels.push(new Level(2,"sewers1",7,20,true,lvl3));
		this.levels.push(new Level(3,"sewers2",40,40,true,lvl4));
		this.levels.push(new Level(4,"metro1",20,10,true,lvl5));
		this.levels.push(new Level(5,"metro2",5,30,true,lvl6));
		this.levels.push(new Level(6,"corridor2",20,5,true,lvl7));
		this.levels.push(new Level(7,"metro3",7,50,true,lvl8));
		
	}

	goTo(lvl,x,y){
		this.curent_level = lvl;
		player.x = x;
		player.y = y;
		camera.lookAtObj(player);
		camera.update();
		gameState = LVL_TRANSITION;

	}

	update(){
		this.levels[this.curent_level].updateEnemies();
	}
	
	draw(){
		
		if(gameState == LVL_TRANSITION)
			return;
		
		//draw floor texture and darkness
		this.drawFloor();
		
		//draw background objects and dynamic objects
		this.drawGameObjects();
		
		//draw grid (editor only)
		this.drawGrid();
		
		//draw hud (play only)
		this.drawHUD();


	}
	
	//drawing floor texture
	drawFloor(){

		//cleaning screen
		background(0,0,0);

		//cleaning offscreen buffer
		pg.clear();
		
		//drawing floor texture
		fill(88,88,88);
		rect(camera.offSetX,camera.offSetY,100*this.levels[this.curent_level].sizeY,100*this.levels[this.curent_level].sizeX)
		
	}
	
	drawGameObjects(){



		//looping around z index game object drawing list
		for(let i = 0; i < this.levels[this.curent_level].z_index_map.length; i++)
		{
			//checking if current game object is player then skipping next if
			if(this.levels[this.curent_level].z_index_map[i].id < 1000)
			{
				//checking if game object is within camera viewport
				if(this.levels[this.curent_level].z_index_map[i].j*100+camera.offSetX < - 100
				|| this.levels[this.curent_level].z_index_map[i].j*100+camera.offSetX > camera.width
				|| this.levels[this.curent_level].z_index_map[i].i*100+camera.offSetY < - 100
				|| this.levels[this.curent_level].z_index_map[i].i*100+camera.offSetY > camera.height)
					continue;
			}

			//drawing game object
			this.levels[this.curent_level].z_index_map[i].draw();
			
		}

		this.drawLighting();
		
		//setting blendMode to apply darkness and lights to map
		blendMode(MULTIPLY);
		
		//blending offscreen buffer with drawn map
		image(pg, 0, 0);
		
		//returning to normal blend mode
		blendMode(BLEND);

	}
	
	//draw hitbox of objects
	drawHitbox(tile,destX,destY)
	{
		//if(!hitboxshow_active || gameState == PLAY)
		if(!hitboxshow_active)
			return;
		
		//getting obj data
		let hitboxX = tile.obj.hitboxX
		let hitboxY = tile.obj.hitboxY
		let hitboxW = tile.obj.hitboxW
		let hitboxH = tile.obj.hitboxH
		
		//drawing red rect 
		push();
			noFill();
			stroke(255,0,0);
			rect(destX+hitboxX,destY+hitboxY,hitboxW,hitboxH);
		pop();

		if(tile.obj.weapon_hitbox_id == -1)
			return;

		//getting obj data
		hitboxX = tile.obj.w_hitboxX
		hitboxY = tile.obj.w_hitboxY
		hitboxW = tile.obj.w_hitboxW
		hitboxH = tile.obj.w_hitboxH
		
		//drawing red rect 
		push();
			noFill();
			stroke(0,0,255);
			rect(destX+hitboxX,destY+hitboxY,hitboxW,hitboxH);
		pop();


	}
	
	//draw overlay stuff over tile
	drawOverlay(tile,x,y)
	{
		
	}
	
	//making screen darker
	drawDarkness(x,y,w,h)
	{
		if(!shadowsLighting_active)
			return;
		
		//setting darkness color
		let shadows_color = shadowLvl;
		let shadows = color(shadows_color, shadows_color, shadows_color);
		
		//drawing shadows (dark rectangle)
		pg.noStroke();
  		pg.fill(shadows);
		pg.rect(x,y,w,h);
	}
	
	//draws lighting in level
	/*drawLighting()
	{
		if(!shadowsLighting_active)
			return;

		pg.fill(255);

		for(let i = 0; i < this.levels[this.curent_level].light_array.length; i++)
		{
			pg.image(light_circle,this.levels[this.curent_level].light_array[i].j*100+camera.offSetX-75,this.levels[this.curent_level].light_array[i].i*100+camera.offSetY-75,250,250);
		}
	}*/

	drawLighting()
	{
		if(this.curent_level  == 0)
		{
			Light.draw(-0.5,1,-25,0,2)
			//Light.draw(0,3,-25,0,4)
		}
		if(this.curent_level  == 2)
		{
			//Light.draw(-0.5,1,-25,0,2)
			Light.draw(1,5,-25,-10,4)
			Light.draw(2,8,-25,-10,5)
		}

	}
	
	//draw flashlight
	drawFlashLight()
	{
		if(player.flashlightOn)
		{
			pg.image(light_circle,player.x+camera.offSetX-150+player.w/2,player.y+camera.offSetY-150+player.h/2,300,300);
		}
		
		return;
		if(!shadowsLighting_active)
			return;

		//calculating triangle coord
		let tlx1 = player.x+player.w/2+camera.offSetX + 250*player.faceDirX;
		let tly1 = player.y+player.h/2+camera.offSetY - 40;
		
		let tlx2 =  player.x+player.w/2+camera.offSetX + 250*player.faceDirX;
		let tly2 =  player.y+player.h/2+camera.offSetY + 40;

		//getting flashlight triangle start pos
		let i = floor((player.x+player.w)/100)
		let j = floor((player.y+player.h/2)/100)
		
		//checking if going up or down
		if(player.faceDirY == 1 || player.faceDirY == -1)
		{
			tlx1 = player.x+player.w/2+camera.offSetX - 40;
			tly1 = player.y+player.h/2+camera.offSetY + 250*player.faceDirY;
			
			tlx2 =  player.x+player.w/2+camera.offSetX + 40;
			tly2 =  player.y+player.h/2+camera.offSetY + 250*player.faceDirY;
			
			//recalculating triangle coord to stop at walls (up)
			if(player.faceDirY == -1)
			{
				for(let k = 0; k < 3;k++)
				{
					if(j-k < 0)
						continue;
					//if(typeof map.levels[map.curent_level].game_obj_array[j-k][i] == "undefined")
					if(map.levels[map.curent_level].game_obj_array[j-k][i] == null)
						continue;
					if(map.levels[map.curent_level].game_obj_array[j-k][i].group == "WALL")
					{
						if(player.y+player.h <  (j-k)*100+100)
							continue;
						tly2 =  (j-k)*100 + map.levels[map.curent_level].game_obj_array[j-k][i].decalY + camera.offSetY;
						tly1 =  (j-k)*100 + map.levels[map.curent_level].game_obj_array[j-k][i].decalY + camera.offSetY;
						break;
					}
				}
			}
			//recalculating triangle coord to stop at walls (down)
			else if(player.faceDirY == 1)
			{
				for(let k = 0; k < 3;k++)
				{
					if(j+k > map.levels[map.curent_level].sizeY-1)
						continue;
					//if(typeof map.levels[map.curent_level].game_obj_array[j+k][i] == "undefined")
					if(map.levels[map.curent_level].game_obj_array[j+k][i] == null)
						continue;
					if(map.levels[map.curent_level].game_obj_array[j+k][i].group == "WALL")
					{
						if(player.y+player.h >  (j+k)*100+100)
							continue;
						tly2 =  (j+k)*100 + 100 + camera.offSetY;
						tly1 =  (j+k)*100 + 100 + camera.offSetY;
						break;
					}
				}
			}
						
		}
		//checking if going right or left
		else if(player.faceDirX == 1 || player.faceDirX == -1)
		{
			//recalculating triangle coord to stop at walls (right)
			if(player.faceDirX == 1)
			{
				for(let k = 0; k < 3;k++)
				{
					if(i+k > map.levels[map.curent_level].sizeX-1)
						continue;
					//if(typeof map.levels[map.curent_level].game_obj_array[j][i+k] == "undefined")
					if(map.levels[map.curent_level].game_obj_array[j][i+k] == null)
						continue;
					if(map.levels[map.curent_level].game_obj_array[j][i+k].group == "WALL_VERT")
					{
						if(player.x+player.w/2 > (i+k)*100+100+ map.levels[map.curent_level].game_obj_array[j][i+k].decalX)
							continue;
						tlx2 =  (i+k)*100 + map.levels[map.curent_level].game_obj_array[j][i+k].decalX + 100 + camera.offSetX;
						tlx1 =  (i+k)*100 + map.levels[map.curent_level].game_obj_array[j][i+k].decalX + 100 + camera.offSetX;
						break;
					}
				}
			}
			//recalculating triangle coord to stop at walls (left)
			else if(player.faceDirX == -1)
			{
				for(let k = 0; k < 3;k++)
				{
					if(i-k < 0)
						continue;
					//if(typeof map.levels[map.curent_level].game_obj_array[j][i-k] == "undefined")
					if(map.levels[map.curent_level].game_obj_array[j][i-k] == null)
						continue;
					if(map.levels[map.curent_level].game_obj_array[j][i-k].group == "WALL_VERT")
					{
						if(player.x+player.w/2 < (i-k)*100+100+ map.levels[map.curent_level].game_obj_array[j][i-k].decalX)
							continue;
						tlx2 =  (i-k)*100 + map.levels[map.curent_level].game_obj_array[j][i-k].decalX - map.levels[map.curent_level].game_obj_array[j][i-k].hitboxW + 100 + camera.offSetX;
						tlx1 =  (i-k)*100 + map.levels[map.curent_level].game_obj_array[j][i-k].decalX - map.levels[map.curent_level].game_obj_array[j][i-k].hitboxW + 100 + camera.offSetX;
						break;
					}
				}
			}

		}
		
		//drawing player torchlight (white triangle)
		pg.fill(255,255,237)
		if(gameState != EDITOR && player.flashlightOn)
			pg.triangle(player.x+player.w/2+camera.offSetX, player.y+player.h/2+camera.offSetY,tlx1,tly1,tlx2,tly2);
	}
	
	
	//drawing grid
	drawGrid(){

		if(!grid_active || gameState !== EDITOR)
			return;
		
		push();
			let col = color(0,0,0);
			col.setAlpha(128);
			stroke(col);
			noFill();
			for(let i = 0; i < map.levels[map.curent_level].sizeX;i++)
			{
				for(let j = 0; j < map.levels[map.curent_level].sizeY;j++)
				{
					rect(j*100+camera.offSetX,i*100+camera.offSetY,100,100);
				}

			}
		pop();
	}
	
	//drawing HUD
	drawHUD(){
		player.drawHUD();

		if(gameState == GAME_OVER)
		{
			push();
				textSize(80);
				fill(200,0,0)
				strokeWeight(4);
				stroke(255,0,0);
				text("GAME OVER",windowWidth/2,windowHeight/4)
			pop();
		}
	}
	

	drawlvltrans()
	{
		let now = new Date().getTime();
		let delta = now - this.lastLvlTrans;
		if (delta >= 50) {
			this.lastLvlTrans = now;
			let squareColor = color(0, 0, 0);
			squareColor.setAlpha(24*this.lvltransframe);
			fill(squareColor);
			rect(0,0,windowWidth,windowHeight)
			this.lvltransframe++;
			if(this.lvltransframe == 10)
			{
				this.lvltransframe = 0;
				gameState = PLAY;
			}
		}
	}
}