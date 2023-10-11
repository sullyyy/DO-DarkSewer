class Weapon{
	constructor(){

	}
}

//empty weapon class when no weapon is equipped
class Empty_Weapon extends Weapon{
	constructor(){
		super();
	}

	shoot(){
		return;
	}

	update(){
		return;
	}

	draw(x,y,faceX,faceY){
		return;
	}
}

class Gun extends Weapon{
	constructor(){
		super();
		this.lastShot  = new Date().getTime();
		this.gun_fire  = new Gun_Fire(false);
		this.bullets = [];
		this.incr = -1;
		
	}

	//shooting gun
	shoot(){
		//getting time since last shot
		let now = new Date().getTime();
		let delta = now - this.lastShot;

		//last shot is 500ms back
		if (delta >= 500) {
			this.lastShot = new Date().getTime();
			this.incr++;

			//adjusting gun fire effect to be drawn in correct direction and position
			//facing right
			if(player.faceDirX > 0)
				this.bullets.push(new Bullet(2000+this.incr,player.x+36,player.y+34,createVector(player.x+100+36,player.y+34)))
			//facing left
			else if(player.faceDirX < 0)
			{
				this.bullets.push(new Bullet(2000+this.incr,player.x,player.y+34,createVector(player.x-100,player.y+34)))
			}
			//facing top
			else if(player.faceDirY < 0)
				this.bullets.push(new Bullet(2000+this.incr,player.x+player.w-8,player.y+30,createVector(player.x+player.w-8,player.y-100+30)))
			//facing down
			else if(player.faceDirY > 0)
			{
				this.bullets.push(new Bullet(2000+this.incr,player.x+8,player.y+55,createVector(player.x+8,player.y+100+55)))
			}

			//this.bullets.push(new Bullet(2000+this.bullets.length,player.x,player.y,createVector(player.x+100,player.y)))
			
			//creating gun fire effect
			this.gun_fire.create();
		}

	}


	//updating bullets
	update(){

		//looping around bullets array
		for(let i = this.bullets.length - 1; i >= 0; i--)
		{
			//bullet hit something
			if(this.bullets[i].update())
			{
				//getting bullet id
				let id = this.bullets[i].id;

				//removing bullet from bullets array
				this.bullets.splice(i, 1);
				
				let index = -1;

				//looping around draw list
				for(let j = map.levels[map.curent_level].z_index_map.length-1; j >= 0; j--) {

					//finding bullet with id
				    if(map.levels[map.curent_level].z_index_map[j].id === id) {
				        index = j;
				        //removing bullet from draw list
				        //console.log("map.levels[map.curent_level].z_index_map ", map.levels[map.curent_level].z_index_map)
				        //console.log("map.levels[map.curent_level].z_index_map +1 ", map.levels[map.curent_level].z_index_map[index+1])
				        //console.log("map.levels[map.curent_level].z_index_map -1 ", map.levels[map.curent_level].z_index_map[index-1])
						map.levels[map.curent_level].z_index_map.splice(index,1);
						map.levels[map.curent_level].resort();

				        break;
				    }
				}
				
			}
		}

	}

	//drawing gun fire
	draw(x,y,faceX,faceY){

		//adjusting gun fire effect to be drawn in correct direction and position
		//facing right
		if(faceX > 0)
			this.gun_fire.draw(x+36,y+34);
		//facing left
		else if(faceX < 0)
		{
			push();
				translate(x+camera.offSetX,y+34+camera.offSetY);
				scale(-1,1);
			 	this.gun_fire.draw(-camera.offSetX,-camera.offSetY);
			pop();
		}
		//facing top
		else if(faceY < 0)
			this.gun_fire.draw(0,0);
		//facing down
		else if(faceY > 0)
		{
			push();
				translate(x+8+camera.offSetX,y+64+camera.offSetY);
    			rotate(90);
				this.gun_fire.draw(-camera.offSetX,-camera.offSetY);
			pop();
		}

		if(this.gun_fire.active)
			pg.image(light_circle,x + camera.offSetX-250,y+ camera.offSetY-250,500,500);
	}
}

class Gun_Fire{
	constructor(active){
		this.active = active;
		this.anim = new Animation(4,70);
		this.w = 5;
		this.h = 5;
	}

	//activating gun fire effect
	create(){
		this.active = true;
	}

	//drawing gun fire effect
	draw(x,y){
		if(!this.active)
			return;

		//shadowLvl = 200;

		//updating frame 
		let frame = this.anim.updateAnimation()/100;

		image(anim_gun_fire, x + camera.offSetX, y+ camera.offSetY, this.w, this.h,frame*this.w,0,this.w,this.h);

		//ending animation
		if(frame == 4)
		{
			//shadowLvl = 100;
			this.active = false;
		}

	}
}

class Bullet{
	constructor(id,x,y,dest){
		this.id = id;
		this.x = x;
		this.y = y;
		this.h = 35;
		this.dest = dest;
		this.ori = createVector(x, y);
		this.velocity = 7;
		this.show = true;
		map.levels[map.curent_level].z_index_map.push(new Game_Object(id, true, 0,0,this));
		map.levels[map.curent_level].resort();
		this.rotate = false;
		this.impact = new Impact();

		if(this.ori.x == this.dest.x)
			this.rotate = true;


	}

	//checking for collision
	checkCollision(){
		//checking for oob
		if(this.x < 0 || this.x > map.levels[map.curent_level].sizeY*100 || this.y < 0 || this.y > map.levels[map.curent_level].sizeX*100)
			return true;

		//looping around zombie array
		for(let i = 0;i < map.levels[map.curent_level].enemies.length; i++)
		{
			//getting zombie
			let zombie = map.levels[map.curent_level].enemies[i];

			//checking if zombie dead
			if(zombie.dead)
				continue;

			//checking for collision between zombie and bullet
			if(this.x > zombie.x && this.x < zombie.x+zombie.w
				&& this.y > zombie.y && this.y < zombie.y+zombie.h)
			{
				//adjusting hit position for blood effect
				let hit_y = this.y;
				if(this.y + 20 > zombie.y+zombie.h)
					hit_y = zombie.y+zombie.h-20;
				//ouch
				zombie.takeDmg(1,zombie.x,hit_y);
				return true;
			}
		}

		//getting bullet position on grid
		let i = floor(this.x/100);
		let j = floor(this.y/100);

		for(let k = -1; k < 2;k++){
			if(j+k < 0)
				continue;
			//checking if theres a game object at this position
			if(map.levels[map.curent_level].game_obj_array[j+k][i] != undefined)
			{
				//getting object
				let obj = map.levels[map.curent_level].game_obj_array[j+k][i];
				//console.log("obj ", obj)

				//checking if object has hitbox
				if(obj.weapon_hitbox_id == -1)
					return;

				//getting object data and position
				let id = obj.weapon_hitbox_id;
				let destX = i*100 + obj.decalX;
				let destY = (j+k)*100 + obj.decalY;

				//checking for collision between bullet and object
				//if(this.x > destX + whb[id].hitboxX && this.x < destX + whb[id].hitboxX + whb[id].hitboxW && this.y >  destY + whb[id].hitboxY && this.y < destY + whb[id].hitboxY + whb[id].hitboxH)
				if(this.x > destX + obj.w_hitboxX && this.x < destX + obj.w_hitboxX + obj.w_hitboxW && this.y >  destY + obj.w_hitboxY && this.y < destY + obj.w_hitboxY + obj.w_hitboxH)
				{
					this.impact.set(this.x,this.y);
					return true;
				}
			}
		}
		
	}

	//updating bullet position and checking for collision
	update(){
		let v1 = this.ori;
		let v2 = this.dest;
		  
		let dx = v1.x - v2.x;
		let dy = v1.y - v2.y;
		let angle = atan2(dy, dx)
		  
		let xVelocity = this.velocity * cos(angle);
		let yVelocity = this.velocity * sin(angle);
		
		//bullet hit something
		if(this.checkCollision())
			return true;

		//moving bullet
		this.x-=xVelocity;
		this.y-=yVelocity;
		
		//nothing hit
		return false;
	}

	//drawing bullet
	draw(){
		//bullet going left or right
		if(!this.rotate)
			image(bullet_img,this.x+camera.offSetX,this.y+camera.offSetY)
		//rotating bullet img if going top or down
		else
		{
			push();
				translate(this.x+camera.offSetX,this.y+camera.offSetY);
    			rotate(90);
				image(bullet_img,0,0);
			pop();
		}
	}
}