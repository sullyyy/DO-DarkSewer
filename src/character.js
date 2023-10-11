
class Blood_Effect{
	constructor()
	{
		this.active = false; 
		this.w = 20;
		this.h = 20;
		this.x = 0;
		this.y = 0;
		this.anim = new Animation(6,50);
	}

	create(x,y){
		//this.x = x-(this.w*1.5)/2;
		this.x = x;
		this.y = y;
		this.active = true;
		this.anim = new Animation(6,50);
	}

	draw(){
		if(!this.active)
			return;

		let frame = this.anim.updateAnimation()/100;
		image(anim_blood_effect,this.x+camera.offSetX,this.y+camera.offSetY,this.w*1.5,this.h*1.5,this.w*frame,0,this.w,this.h);

		if(frame == 6)
			this.active = false;
	}
}

let tileC;

class Character{
	 constructor (x, y, w, h, img, id) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = img;
		this.id = id;
		this.animation = new Animation(7,130);
		this.moving = false;
		this.life = 3;
		this.dead = false;
		this.group = "CHARACTER";
		this.blood_effect = new Blood_Effect();
		 
		 this.faceDirX = 0;
		 this.faceDirY = 0;
		 
		//foot height
		this.d = 10;
	 }
	
	update(){
		
	}
	
	//drawing character
	draw(){
		if(this.dead)
			image(this.img, this.x + camera.offSetX, this.y+ camera.offSetY, this.w, this.h);
		else
			this.drawAnimation();
		//this.blood_effect.draw();

		if(!hitboxshow_active)
			return;
		//hitbox
		push();
			noFill();
			stroke("red");
			rect(this.x+camera.offSetX,this.y+(this.h-this.d)+camera.offSetY,this.w,this.d);
		pop();
	}
	
	drawAnimation(){
		
		//getting current frame from animation
		let frame = this.animation.updateAnimation()/100;
		let srcY = 0;
		
		//stop animation if character is immobile
		if(!this.moving)
			frame = 0;
		
		//getting facing direction of character
		if(this.faceDirY == -1)
			srcY = 70;
		if(this.faceDirX == 1)
			srcY = 140;
		if(this.faceDirX == -1)
		{
			//mirroring img if going to the left
			srcY = 140;
			push();
				translate(this.x + camera.offSetX,this.y+ camera.offSetY);
				scale(-1,1);
				image(this.img, -36, 0, this.w, this.h,frame*36,srcY,36,70);
			pop();
		}
		else
			//drawing img
			image(this.img, this.x + camera.offSetX, this.y+ camera.offSetY, this.w, this.h,frame*36,srcY,36,70);
		
	}
	
	//checking for collision with game objects
	handleCollision(x,y)
	{
		
		//blocking character when on map limit
		if(x < 0 || y < 0 || x + this.w > map.levels[map.curent_level].sizeY*100 || y + this.h > map.levels[map.curent_level].sizeX*100)
		{
			//console.log("map.levels[map.curent_level].sizeX ");
			return false;
			
		}

		//return true;
		
		//adjusting y to calc collision with feet
		y+=this.h;
		
		let i;
		let j;
		
		
		//checking 9 tiles around character
		for(let k = -1; k < 2; k++)
		{
			for(let l = -1; l < 2; l++)
			{
				//getting tile coord
				i = floor(x/100) + k;
				j = floor(y/100) + l;
				
				//checking for oob
				if(i < 0 || j < 0 || i > map.levels[map.curent_level].sizeY || j > map.levels[map.curent_level].sizeX)
				{
					
					continue;
				}
					
				//getting tile
				let tile = map.levels[map.curent_level].game_obj_array[j][i];
				
				//checking for oob
				if(tile == undefined)
				{
					continue;
				}

				if(this instanceof Player)
					tileC = tile;
				
				//checking collision between character and tile hitboxes 
				if(x + this.w/2 > i*100+tile.hitboxX+tile.decalX && x + this.w/2 < i*100 + tile.hitboxX + tile.hitboxW+tile.decalX && y > j*100 + tile.hitboxY+tile.decalY && y < j*100 + tile.hitboxY + tile.hitboxH+tile.decalY
				  || x + this.w/2 > i*100+tile.hitboxX+tile.decalX && x + this.w/2 < i*100 + tile.hitboxX + tile.hitboxW+tile.decalX && y - this.d > j*100 + tile.hitboxY+tile.decalY && y - this.d < j*100 + tile.hitboxY + tile.hitboxH+tile.decalY
				  || x > i*100+tile.hitboxX+tile.decalX && x < i*100 + tile.hitboxX + tile.hitboxW+tile.decalX && y > j*100 + tile.hitboxY+tile.decalY && y < j*100 + tile.hitboxY + tile.hitboxH+tile.decalY
				  || x + this.w > i*100+tile.hitboxX+tile.decalX && x + this.w < i*100 + tile.hitboxX + tile.hitboxW+tile.decalX && y > j*100 + tile.hitboxY+tile.decalY && y < j*100 + tile.hitboxY + tile.hitboxH+tile.decalY
				  || x > i*100+tile.hitboxX+tile.decalX && x < i*100 + tile.hitboxX + tile.hitboxW+tile.decalX && y - this.d > j*100 + tile.hitboxY+tile.decalY && y - this.d < j*100 + tile.hitboxY + tile.hitboxH+tile.decalY
				  || x + this.w > i*100+tile.hitboxX+tile.decalX && x + this.w < i*100 + tile.hitboxX + tile.hitboxW+tile.decalX && y - this.d > j*100 + tile.hitboxY+tile.decalY && y - this.d < j*100 + tile.hitboxY + tile.hitboxH+tile.decalY)
					return false;
				
			}
		}
		
		return true;
	}

	//taking dmg
	takeDmg(dmg,x,y){
		//ouch
		this.life-=dmg;

		//creating blood drop on floor
		new Blood_Drop(this.x+this.w/2,this.y+this.h-this.d);

		//creating blood on hit effect animation
		//this.blood_effect.create(this.x+this.w/2,this.y+20);
		this.blood_effect.create(x,y);

		//RIP
		if(this.life <= 0)
			this.die();
	}

	//RIP
	die(){
		this.dead = true;
		this.moving = false; 
	}
	
}

 const STATE = {
    IDLE: 0,
	ROAMING: 1,
	CHASING: 2,
	DEAD: 3,
	VOMITING: 4,
	STUNNED: 5,
	WAITING: 6,
	SPITTING: 7,
	RUSHING: 8,
	 SPEAKING: 9,
	 SCRIPTED: 10
 };

class NPC extends Character{
	constructor (x, y, w, h, img, id)
	{
		super(x, y, w, h, img, id);
		this.state = STATE.IDLE;
	}

	update(){
		switch(this.state){
			case STATE.IDLE:
			break;
		}
	}

	setFaceDir(xVel,yVel)
	{
		this.faceDirX = 0;
		this.faceDirY = 0;
		if(Math.abs(xVel) > Math.abs(yVel))
			{
				if(xVel > 0)
					this.faceDirX = -1;
		  		else
					this.faceDirX = 1;
			}
		else
			{
				if(yVel > 0)
				  this.faceDirY = -1;
			    else
				  this.faceDirY = 1;
			}
	}

	/*takeDmg(dmg){
		super.takeDmg(dmg);
	}*/

	die(){
		super.die();
		this.state = STATE.DEAD;
		this.y+=this.h-14;
		this.w = 70;
		this.h = 14;
		this.x+=this.w/2;
		this.img = player_dead;
		map.levels[map.curent_level].resort();
	}



}

class Zombie extends NPC{
	constructor (x, y, w, h, img, id)
	{
		super(x, y, w, h, img, id);
		this.chaseLine = [createVector(0, 0),createVector(0, 0)];
		this.vecRoam = createVector(0, 0);
		this.velocity = 2;
		this.state = STATE.ROAMING;
		this.moving = true;
	}

	update(){
		//console.log("jupdate?")
		super.update();

		//detecting if player is nearby
		this.detectPlayer(this.x+this.w/2,player.x+player.w/2, this.y+this.h/2,player.y+player.h/2);

		switch(this.state){
			case STATE.ROAMING:
				this.roam();
			break;

			case STATE.CHASING:
				this.chase();
			break;

			case STATE.DEAD:

			break;
		}
	}

	draw(){
		super.draw();
		this.blood_effect.draw();
		this.drawChaseLine();
	}

	roam(){

		//creating vectors
		let v1 = createVector(this.x + this.w/2, this.y + this.h/2);
		let v2 = createVector(this.vecRoam.x, this.vecRoam.y)
		this.chaseLine[0].set(v1.x + camera.offSetX, v1.y + camera.offSetY);
		this.chaseLine[1].set(v2.x + camera.offSetX, v2.y + camera.offSetY);

		//calculating distance between npc and destination
		let distance = p5.Vector.dist(v1, v2);
		
		//if npc reached destination creating new  destination
		if(distance < 5)
		{
			this.vecRoam = createVector(random(100,map.levels[map.curent_level].sizeX*100), random(100,map.levels[map.curent_level].sizeY*100));
			v2 = createVector(this.vecRoam.x, this.vecRoam.y)
		}

		//setting variable to calculate directions
		let dx = v1.x - v2.x;
		let dy = v1.y - v2.y;
		let angle = atan2(dy, dx)
		  
		//calculating movement horizontally and vertically
	    let xVelocity = this.velocity * cos(angle);
	    let yVelocity = this.velocity * sin(angle);

	    //checking for collision with environment
	    if(this.handleCollision(this.x - xVelocity, this.y))
	    {
		  this.x-=xVelocity;
		  map.levels[map.curent_level].resort();
	    }
	    else
		  this.vecRoam = createVector(random(100,map.levels[map.curent_level].sizeX*100), random(100,map.levels[map.curent_level].sizeY*100));
	  
	    //checking for collision with environment
	    if(this.handleCollision(this.x, this.y - yVelocity))
	    {
		  this.y-=yVelocity;
		  map.levels[map.curent_level].resort();
	    }
	    else
		  this.vecRoam = createVector(random(100,map.levels[map.curent_level].sizeX*100), random(100,map.levels[map.curent_level].sizeY*100));

		//setting facing direction
		this.setFaceDir(xVelocity,yVelocity);

	}

	chase()
	{
		//creating vectors
		let v1 = createVector(this.x + this.w/2, this.y + this.h/2);
		let v2 = createVector(player.x + this.w/2, player.y + this.h/2);
		this.chaseLine[0].set(v1.x + camera.offSetX, v1.y + camera.offSetY);
		this.chaseLine[1].set(v2.x + camera.offSetX, v2.y + camera.offSetY);

		//setting variable to calculate directions
		let dx = v1.x - v2.x;
		let dy = v1.y - v2.y;
		let angle = atan2(dy, dx)

		let xVelocity = this.velocity * cos(angle);
		let yVelocity = this.velocity * sin(angle);

		//checking for collision with environment
		if(this.handleCollision(this.x - xVelocity, this.y))
		{
			this.x-=xVelocity;
			map.levels[map.curent_level].resort();
		}
		if(this.handleCollision(this.x, this.y - yVelocity))
		{
			this.y-=yVelocity;
			map.levels[map.curent_level].resort();
		}

		//setting facing direction
		this.setFaceDir(xVelocity,yVelocity);
		 
	}

	//detecting if player is nearby and changing state
	detectPlayer(x1,x2,y1,y2)
	{
		if(this.dead || this.state == STATE.IDLE)
			return;

		var dist = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
		
		if(dist < 300 && !player.dead)
		{
			this.state = STATE.CHASING;

			if(dist < 30)
				player.takeDmg(1,player.x,player.y);
		}
		else
		{
			this.state = STATE.ROAMING;
		}
	}

	//drawing zombie chase line
	drawChaseLine()
	{
		if(!hitboxshow_active || this.dead)
			return;
		push();
			stroke(255,0,0);
			line(this.chaseLine[0].x, this.chaseLine[0].y, this.chaseLine[1].x, this.chaseLine[1].y);
		pop();
	}

	//checking collision between zombies so they dont overlap
	checkCollisionMovObj(x,y,i)
	{
		let xw = x + this.w;
		let yh = y + this.h;
		y = yh - 10;
		let x2 = map.levels[map.curent_level].enemies[i].x;
		let x2w = x2 + map.levels[map.curent_level].enemies[i].w;
		let y2 = map.levels[map.curent_level].enemies[i].y;
		let y2h = y2 + map.levels[map.curent_level].enemies[i].h;
		y2 = y2h - 10;

		if(x > x2 && x < x2w && y > y2 && y < y2h)
			return false;
		if(xw > x2 && xw < x2w && y > y2 && y < y2h)
			return false;
		if(x > x2 && x < x2w && yh > y2 && yh < y2h)
			return false;
		if(xw > x2 && xw < x2w && yh > y2 && yh < y2h)
			return false;
		return true;
	}

	//checking collision with other zombies
	handleCollisionMovObj(x,y)
	{
		for(let i = 0; i < map.levels[map.curent_level].enemies.length; i++)
		{
			if( map.levels[map.curent_level].enemies[i].id === this.id || map.levels[map.curent_level].enemies[i].dead)
			{
				continue;
			}
			if(!this.checkCollisionMovObj(x,y,i))
				return false;
				
		}
		return true;
	}

	//handling collision
	handleCollision(x,y){
		if(!this.handleCollisionMovObj(x,y))
			return false;
		return super.handleCollision(x,y);
	}
}

//player character class
class Player extends Character{
	constructor (x, y, w, h, img, id) {
		super(x, y, w, h, img, id);
		this.move_speed = 5;
		this.flashlightOn = false;
		this.invulnerable = false;
		this.lastInvulnerable;
		this.weapons = [new Empty_Weapon(),new Gun()];
		this.current_weapon = 0;
		this.imgs = [anim_dwight,anim_dwight_gun];
		this.talking = false;
		this.lastTalk;
		this.on_car = false;
	}
	
	update(){
		if(this.dead)
			return;
		this.update_invulnerability();
		this.move();
		this.weapons[this.current_weapon].update();

	}

	reset(){
		this.setSpawnPosition();
		this.dead = false;
		this.life = 3;
		this.h = 70;
	}
	
	setSpawnPosition(){
		this.x = 150-this.w/2;
		this.y = 250-this.h;
	}
	
	spawnAt(x,y){
		this.x = x;
		this.y = y;
	}

	takeDmg(dmg,x,y)
	{
		if(this.invulnerable)
			return;
		super.takeDmg(dmg,x,y)
		this.lastInvulnerable = new Date().getTime();
		this.invulnerable = true;
	}

	die()
	{
		super.die();
		this.y+=this.h-14;
		this.h = 14;
		this.x+=this.w/2;
		map.levels[map.curent_level].resort();
		gameState = GAME_OVER;
	}

	update_invulnerability()
	{
		let now = new Date().getTime();
		let delta = now - this.lastInvulnerable;
		if (delta >= 1000) {
			this.invulnerable = false;
		}
	}
	
	move(){
		if(this.on_car)
		{
			
			this.x = m_car.x+20;
			camera.update();
			return;
		}
		
		this.moving = false;
		
		//left arrow pushed
		if(keys[LEFT_ARROW])
		{
			//checking for collision
			if(this.handleCollision(this.x - this.move_speed, this.y))
			{
				//moving player
				this.x -= this.move_speed;
				//updating camera pos
				camera.update();
				//resorting the draw list
				map.levels[map.curent_level].resort();
			}
			
			//updating player variables
			this.moving = true;
			this.faceDirX = -1;
			this.faceDirY = 0;
			
		}
		//right arrow pushed
		if(keys[RIGHT_ARROW])
		{
			//checking for collision
			if(this.handleCollision(this.x + this.move_speed, this.y))
			{
				this.x += this.move_speed;
				camera.update();
				map.levels[map.curent_level].resort();
			}
			
			this.moving = true;
			this.faceDirX = 1;
			this.faceDirY = 0;
			
		}
		//up arrow pushed
		if(keys[UP_ARROW])
		{
			//checking for collision
			if(this.handleCollision(this.x, this.y - this.move_speed))
			{
			
				this.y -= this.move_speed;
				camera.update();
				map.levels[map.curent_level].resort();
			}
			
			this.moving = true;
			this.faceDirY = -1;
			this.faceDirX = 0;
		}
		//down arrow pushed
		if(keys[DOWN_ARROW])
		{
			
			//checking for collision
			if(this.handleCollision(this.x - this.move_speed, this.y + this.move_speed))
			{
				this.y += this.move_speed;
				camera.update();
				map.levels[map.curent_level].resort();
			}
			
			this.moving = true;
			this.faceDirY = 1;
			this.faceDirX = 0;
		}
		//spacebar pushed shooting gun
		if(keys[32])
		{
			this.weapons[this.current_weapon].shoot();

			keys[32] = 0;
		}
		//turn on/off flashlight T
		if(keys[84])
		{
			if(this.flashlightOn)
				this.flashlightOn = false;
			else
				this.flashlightOn = true;
			
			keys[84] = 0;
			
		}
		//drop flare Y
		if(keys[89])
		{
			
			keys[89] = 0;
			
		}
		//Pressing the E key
		if(keys[69])
		{
			if(tileC.game_id == 9)
			{
				if(map.curent_level == 0)
					map.goTo(1,100,500)
				else if(map.curent_level == 1)
					map.goTo(0,900,700)
				else if(map.curent_level == 2)
					map.goTo(3,50,800)
				else if(map.curent_level == 3)
					map.goTo(2,1900,100)
				else if(map.curent_level == 4)
					map.goTo(5,100,200)
				else if(map.curent_level == 5)
					map.goTo(4,900,1800)
				else if(map.curent_level == 7)
					map.goTo(1,1400,800)

			}
			else if(tileC.game_id == 12)
			{
				if(map.curent_level == 1)
					map.goTo(2,200,550)
				else if(map.curent_level == 2)
					map.goTo(1,200,100)
			}
			else if(tileC.game_id == 25)
			{
				if(map.curent_level == 3)
					map.goTo(4,500,1800)
				else if(map.curent_level == 4)
					map.goTo(3,3800,200)
				else if(map.curent_level == 5)
					map.goTo(6,200,100)
				else if(map.curent_level == 6)
					map.goTo(5,2500,300)
			}
			else if(tileC.game_id == 4)
			{
				this.lastTalk = new Date().getTime();
				this.talking = true;
				this.talkText = "I cant go back up.\nI need to explore the sewers...";
			}
			else if(tileC.game_id == 5)
			{
				if(map.curent_level == 6)
				{
					map.goTo(7,4700,100)
					return;
				}
				else if(map.curent_level == 7)
				{
					map.goTo(6,200,1900)
					return;
				}
				this.lastTalk = new Date().getTime();
				this.talking = true;
				this.talkText = "It's locked.Looks like\ni need some kind of key card...";
			}

			if(map.curent_level == 7)
			{
				console.log("Math.floor(this.x/100) ",Math.floor(this.x/100) )
				if(Math.floor(this.x/100) == 48 && Math.floor((this.y+70)/100)  == 2)
				{
					this.on_car = true;
					m_car.moving = true;
					//this.move_speed = 0;
				}
			}
			keys[69] = 0;
			
		}

		if(keys[CONTROL])
		{
			this.switchWeapon();
			keys[CONTROL] = 0;
		}
		
	}

	//switching weapon equipped
	switchWeapon(){
		this.current_weapon++;

		if(this.current_weapon >= this.weapons.length)
			this.current_weapon = 0;

		//changing player img to match weapon equipped
		this.img = this.imgs[this.current_weapon];
	}
	
	//drawing character
	draw(){

		//drawing dead player img
		if(this.dead)
		{
			image(player_dead,this.x+camera.offSetX,this.y+camera.offSetY)
			this.blood_effect.draw();
			return;
		}

		//if character got hit and is invulnerable
		if(this.invulnerable)
		{	
			//getting time since invulnerable
			let now = new Date().getTime();
			let delta = now - this.lastInvulnerable;

			//invulnerable since 100ms
			if(delta < 100)
			{
				//tinting player red
				push();
					tint(255,0,0,255);
					super.draw();
					this.blood_effect.draw();
				pop();

				map.drawFlashLight();
				return;
			}
			//making player wink
			else if ((delta >= 300 && delta < 400) || (delta >= 600 && delta < 700) || (delta >= 900 && delta < 1000)) {
				map.drawFlashLight();
				this.blood_effect.draw();
				return;
			}
		}

		//drawing
		super.draw();
		this.blood_effect.draw();
		this.weapons[this.current_weapon].draw(this.x,this.y,this.faceDirX,this.faceDirY);
		map.drawFlashLight();
		//map.drawDarkness(this.x+camera.offSetX,this.y+camera.offSetY,36,70)
		

		//testing
		/*push()
			textSize(15);
			fill("red")
			if(tileC!=null)
				text("tileC " + tileC.game_id, this.x+camera.offSetX,this.y+camera.offSetY)
		pop()*/
	}

	//drawing HUD
	drawHUD(){
		for(let i = 0; i < this.life; i++)
			image(heart_img,5+i*30+1,5);

		if(this.talking)
			this.talk();

	}

	talk(){
		//testing
		push()
			textSize(15);
			fill("white")
			stroke("black")
			text(this.talkText, this.x+camera.offSetX,this.y+camera.offSetY)
		pop()

		let now = new Date().getTime();
		let delta = now - this.lastTalk;
		if (delta >= 1500) {
			this.talking = false;
		}
	}
	
}