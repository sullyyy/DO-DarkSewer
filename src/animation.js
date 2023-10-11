

class Animation {
	constructor (nbrOfFrames, timeElapsed) {
		this.last = new Date().getTime();
		this.frame = 0;
		this.nbrOfFrames = nbrOfFrames;
		this.timeElapsed = timeElapsed;
		this.going = true;
		
	}
	
	updateAnimation(){
		
		let now = new Date().getTime();
		let delta = now - this.last;
		if (delta >= this.timeElapsed) {
			
			this.frame++;
			this.last = now;
			if(this.frame > this.nbrOfFrames)
			{
				this.frame = 0;
				
			}
		}
		
		return this.frame*100;
		
	}

	static updateTileAnimation(group){
		if(group == "FIRE")
		{
			return fireAnim.updateAnimation();
		}
	}
}

class Fire_Animation extends Animation{
	constructor (nbrOfFrames,timeElapsed) {
		super(nbrOfFrames,timeElapsed);
	}
	
}

let fireAnim = new Fire_Animation(4,150);