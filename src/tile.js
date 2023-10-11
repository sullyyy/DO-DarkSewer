class Empty_Tile {
	constructor() {
	  this.game_id = 0;
	  this.draw_id = 0;
	  this.data_id = 0;
	  this.hitboxX = 0;
	  this.hitboxY = 0;
	  this.hitboxW = 100;
	  this.hitboxH = 0;
	  this.decalX = 0;
	  this.decalY = 0;
	  this.srcW = 100;
	  this.srcH = 100;
	  this.customZIndex = 0;
	  this.group = "FLOOR";
	  this.animated = false;
	  this.lightType = -1;
	  this.weapon_hitbox_id = -1;
	}
}

class Test_Tile {
	constructor() {
	  this.game_id = 1;
	  this.draw_id = 1;
	  this.data_id = 0;
	  this.hitboxX = 0;
	  this.hitboxY = 82;
	  this.hitboxW = 100;
	  this.hitboxH = 18;
	  this.decalX = 0;
	  this.decalY = 0;
	  this.srcW = 100;
	  this.srcH = 100;
	  this.customZIndex = 0;
	  this.group = "WALL";
	  this.animated = false;
	  this.lightType = -1;
	  this.weapon_hitbox_id = 0;
	}
}

class Test_Tile2 {
	constructor() {
	  this.game_id = 2;
	  this.draw_id = 2;
	  this.data_id = 0;
	  this.hitboxX = 82;
	  this.hitboxY = 0;
	  this.hitboxW = 18;
	  this.hitboxH = 100;
	  this.decalX = 0;
	  this.decalY = 0;
	  this.srcW = 100;
	  this.srcH = 100;
	  this.customZIndex = 0;
	  this.group = "WALL_VERT";
	  this.animated = false;
	  this.lightType = -1;
	  this.weapon_hitbox_id = 1;
	}
}

class Test_Tile3 {
	constructor() {
	  this.game_id = 3;
	  this.draw_id = 3;
	  this.data_id = 0;
	  this.hitboxX = 35;
	  this.hitboxY = 50;
	  this.hitboxW = 29;
	  this.hitboxH = 16;
	  this.decalX = 0;
	  this.decalY = 0;
	  this.srcW = 100;
	  this.srcH = 100;
	  this.customZIndex = 0;
	  this.group = "ON_FLOOR";
	  this.animated = false;
	  this.lightType = 0;
	  this.weapon_hitbox_id = -1;
	}
}

class Weapon_HitBox{
	constructor(id,hitboxX,hitboxY,hitboxW,hitboxH){
		this.id = id;
		this.hitboxX = hitboxX;
	 	this.hitboxY = hitboxY;
	  	this.hitboxW = hitboxW;
	  	this.hitboxH = hitboxH;

	}
}

/*let whb = [];
function temp_createHitBoxes(){
	whb.push(new Weapon_HitBox(0,0,50,100,20))
	whb.push(new Weapon_HitBox(1,80,0,20,100))
	//saveJSON(whb, 'weapon_hitbox.json');
}*/

class Light{
	constructor(type,i,j,active)
	{
		this.type = type;
		this.i = i;
		this.j = j;
		this.active = active;
	}

	static draw(i,j,decalX,decalY,type){

		if(!shadowsLighting_active)
			return;

		if(type == 0)
			pg.image(light_circle,j*100+camera.offSetX-75+decalX,i*100+camera.offSetY-75+decalY,250,250);
		else if(type == 1)
		{
			pg.tint(255,0,0);
			pg.image(light_circle,j*100+camera.offSetX+decalX+80-25,i*100+camera.offSetY+decalY-25,50,50);
			pg.noTint();
		}
		else if(type == 2)
		{
			pg.image(light_drop,j*100+camera.offSetX+decalX,i*100+camera.offSetY+decalY);
		}
		else if(type == 3)
		{
			pg.tint(255,119,0);
			pg.image(light_circle,j*100+camera.offSetX+decalX-50,i*100+camera.offSetY+decalY-50,200,200);
			pg.noTint();
		}
		else if(type == 4)
		{
			//pg.tint(255,119,0);
			pg.image(light_drop_rect,j*100+camera.offSetX+decalX-50,i*100+camera.offSetY+decalY-250);
			//pg.noTint();
			
		}
		else if(type == 5)
		{
			//pg.tint(255,119,0);
			pg.image(light_drop_grilled,j*100+camera.offSetX+decalX-50,i*100+camera.offSetY+decalY-250);
			//pg.noTint();
			
		}

	}
}

class Blood_Drop{
	constructor(x,y)
	{
		this.w = 20;
		this.h = 10;
		this.x = x-this.w/2;
		this.y = y;
		this.group = "BLOOD_DROP";
		map.levels[map.curent_level].z_index_map.push(new Game_Object(3000, true, (this.x+camera.offSetX)/100,(this.y+camera.offSetY)/100,this));
	}

	draw()
	{
		image(blood_drop_img,this.x+camera.offSetX,this.y+camera.offSetY);
	}
}

class Impact{
	constructor()
	{
		this.x = 0;
		this.y = 0;
		this.w = 20;
		this.h = 100;
		this.active = false;
		this.group = "IMPACT";
		this.anim = new Animation(4,70);
		//this.incr = -1;
	}

	set(x,y)
	{
		//this.incr++;
		this.x = x;
		this.y = y;
		this.active = true;
		map.levels[map.curent_level].z_index_map.push(new Game_Object(3000, true, 0,0,this));
		map.levels[map.curent_level].resort();
	}

	draw(){
		if(!this.active)
			return;

		//updating frame 
		let frame = this.anim.updateAnimation()/100;

		image(anim_impact, this.x + camera.offSetX, this.y + camera.offSetY, this.w, 20,frame*this.w,0,this.w,20);

		//ending animation
		if(frame == 4)
		{
			this.active = false;

			let index = -1;

			//looping around draw list
			for(let j = map.levels[map.curent_level].z_index_map.length-1; j >= 0; j--) {

				//finding bullet with id
			    if(map.levels[map.curent_level].z_index_map[j].id === 3000) {

			    	
			        index = j;
			        //removing bullet from draw list
					map.levels[map.curent_level].z_index_map.splice(index,1);
					map.levels[map.curent_level].resort();

			        break;
			    }
			}
		}

	}
}

class M_Car{
	constructor()
	{
		this.img = car;
		this.group = "M_CAR";
		this.x = 4800;
		this.y = 205;
		this.h = 1;
		this.moving = false;
		this.loaded = false;
		this.dir = 1;
	}

	update()
	{
		if(this.moving)
		{
			this.x-=5;
			if(this.x < 200 )
			{	
				this.moving  = false;
				player.on_car = false;
				//player.move_speed = 5;
			}

		}

	}

	draw()
	{
		this.update();
		//console.log("this.x ", this.x)
		image(this.img,this.x+camera.offSetX,this.y+camera.offSetY);
	}
}

class M_DeadZombie{
	constructor()
	{
		this.img = deadzombie;
		this.group = "M_DEADZOMBIE";
		this.x = 446;
		this.y = 200;
		this.h = 50;
		
	}
	
	draw()
	{
		image(this.img,this.x+camera.offSetX,this.y+camera.offSetY);
	}
}

class M_Keycard{
	constructor()
	{
		this.img = keycard;
		this.group = "M_KEYCARD";
		this.x = 446;
		this.y = 270;
		this.h = 1;
		
	}
	
	draw()
	{
		image(this.img,this.x+camera.offSetX,this.y+camera.offSetY);
	}
}