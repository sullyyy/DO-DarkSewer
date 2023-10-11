let selected = 0;

class Menu {
    constructor () {
	}
	
	//esc key pressed -> set game state to main menu
	static s_return()
	{
		if(keys[ESCAPE])
		{
			selected = 0;
			if(gameState == HOW_TO_PLAY)
				gameState = MAIN_MENU;
			else if(gameState == PLAY)
				gameState = IN_GAME_MENU;
			else if(gameState == EDITOR)
			{
				editor.showHideButtons(false);
				gameState = MAIN_MENU;
			}
			else if(gameState == IN_GAME_MENU)
				gameState = PLAY;
			else if(gameState == GAME_OVER)
				gameState = MAIN_MENU;

			keys[ESCAPE] = 0;
		}
	}

	//manages player selection on main menu
	static s_select_option(max)
	{
		if(keys[UP_ARROW] && selected != 0)
		{
			selected--;
			keys[UP_ARROW] = 0;
		}
		if(keys[DOWN_ARROW] && selected != max)
		{
			selected++;
			keys[DOWN_ARROW] = 0;
		}

		if(keys[32] && selected == 0)
		{
			gameState = PLAY;
			map.resetLevels();
			/*camera.resetCameraPos();
			player.setSpawnPosition();
			camera.lookAtObj(player);
			camera.update();*/
			keys[32] = 0;
		}
		if(keys[32] && selected == 1)
		{
			gameState = HOW_TO_PLAY;
			keys[32] = 0;
		}
		if(keys[32] && selected == 2)
		{
			gameState = EDITOR;
			editor.showHideButtons(true);
			camera.resetCameraPos();
			keys[32] = 0;
		}
	}
	
	//draws main menu
	static s_draw()
	{
			background(220);
			fill(0);
			image(main_menu_bckgrnd,0,0)
			textSize(40);
			push()
			fill('red')
			strokeWeight(4);
			stroke("black")
			text('DEAD OFFICE', windowWidth/2, windowHeight/4);
			textSize(20);
			text('Dark Sewer', windowWidth/2, windowHeight/4+30);
			pop()
			textSize(25);
		
			textAlign(LEFT)
			strokeWeight(2);
			stroke("red")
			text('->', 335, windowHeight/4 + 200+selected*25);
			text('PLAY', windowWidth/2 - 50, windowHeight/4 + 200);
			text('HOW TO PLAY', windowWidth/2 - 50, windowHeight/4 + 225);
			text('EDITOR', windowWidth/2 - 50, windowHeight/4 + 250);
			textAlign(CENTER)
			noStroke();
		
			push()
			textSize(20);
			fill("red")
			stroke("black")
			strokeWeight(4);
			image(zombie_head_intro,windowWidth/2,windowHeight-70,17,25);
			text("- DEAD ENGINE -",windowWidth/2,windowHeight-90);

			pop();
		
			push()
			fill("green")
			textSize(20);
			strokeWeight(4);
			stroke("black")
			image(logo_intro,windowWidth/2 + 300,windowHeight-70,24,26);
			text("- FNEK GAME STUDIOS -",windowWidth/2+300,windowHeight-90);

			pop();
	}

	//manages player selection on main menu
	static s_ig_select_option(max)
	{
		if(keys[UP_ARROW] && selected != 0)
		{
			selected--;
			keys[UP_ARROW] = 0;
		}
		if(keys[DOWN_ARROW] && selected != max)
		{
			selected++;
			keys[DOWN_ARROW] = 0;
		}

		if(keys[32] && selected == 0)
		{
			gameState = PLAY;
			keys[32] = 0;
		}
		if(keys[32] && selected == 1)
		{
			gameState = MAIN_MENU;
			keys[32] = 0;
		}
	}

	static s_ig_draw()
	{
		push();
			ig_menu_lyr.strokeWeight(4);
			ig_menu_lyr.stroke(0);
			ig_menu_lyr.fill(220);
			ig_menu_lyr.rect(100,100,windowWidth-200,windowHeight-400,20);
			ig_menu_lyr.noStroke();
			ig_menu_lyr.fill(0);
			ig_menu_lyr.textSize(40);
			ig_menu_lyr.push()
			ig_menu_lyr.fill('red')
			ig_menu_lyr.strokeWeight(4);
			ig_menu_lyr.stroke("black")
			ig_menu_lyr.text('DEAD OFFICE', windowWidth/2, windowHeight/4);
			ig_menu_lyr.textSize(20);
			ig_menu_lyr.text('Dark Sewer', windowWidth/2, windowHeight/4+30);
			ig_menu_lyr.pop()
			ig_menu_lyr.textSize(25);
		
			ig_menu_lyr.textAlign(LEFT);
			ig_menu_lyr.text('->', 250, windowHeight/4 + 150+selected*25);
			ig_menu_lyr.text('RESUME', windowWidth/2 - 50, windowHeight/4 + 150);
			ig_menu_lyr.text('MAIN MENU', windowWidth/2 - 50, windowHeight/4 + 175);
			ig_menu_lyr.textAlign(CENTER);
			image(ig_menu_lyr,0,0);
		pop();
	}
	
	//draws how to play menu
	static s_drawHowToPlay()
	{
		background(220);
		fill(0);
		textSize(40);
		text('HOW TO PLAY', windowWidth/2, windowHeight/4);
		textSize(20);
		text('Move = ← → ↑ ↓', windowWidth/2, (windowHeight/4)+100);
		//text('Drop Flare = Y', windowWidth/2, (windowHeight/4)+140);
		text('Interact = E', windowWidth/2, (windowHeight/4)+140);
		text('Attack/Shoot = Space', windowWidth/2, (windowHeight/4)+160);
		text('Switch weapon = Ctrl', windowWidth/2, (windowHeight/4)+180);
		text('Cancel/Menu = Esc', windowWidth/2, (windowHeight/4)+220);
		text('Turn on/off lantern = T', windowWidth/2, (windowHeight/4)+120);

		push();
		fill("lightgray");
		
		text('Reload weapon = R', windowWidth/2, (windowHeight/4)+200);
		pop();
	}
}

class Intro{
	constructor()
	{
		this.last = new Date().getTime();
		this.currentTitle = 0;
	}

	draw(){
		clear();
		let now = new Date().getTime();
		let delta = now - this.last;
		if (delta >= 1500) {
			this.currentTitle++;
			this.last = now;
		}
		

		if(this.currentTitle == 0)
		{
			push()
			fill("red")
			stroke("black")
			strokeWeight(4);
			image(zombie_head_intro,windowWidth/2-17,windowHeight/2,34,50);
			text("- DEAD ENGINE -",windowWidth/2,windowHeight/2+100);

			pop();

		}
		else if(this.currentTitle == 1)
		{
			push()
			fill("green")
			strokeWeight(4);
			stroke("black")
			image(logo_intro,windowWidth/2-24,windowHeight/2,48,52);
			text("- FNEK GAME STUDIOS -",windowWidth/2,windowHeight/2+100);

			pop();

		}
		else
			gameState = MAIN_MENU;
		

	}
}