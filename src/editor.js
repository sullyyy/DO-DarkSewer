class Editor {
	constructor ()
	{
		this.selected = 0;
		this.decalX = 0;
		this.buttons = [];
		this.buttonsAssArr = {};
		this.prptoptButtons = [];
		this.optButtons = [];
		this.loadButtons();
		this.tilePropSel = 0;
		
	}
	
	//showing or hiding editor menu buttons
	showHideButtons(show)
	{
		for(let i = 0; i < this.buttons.length; i++)
		{
			if(!show)
			{
				this.buttons[i].hide();
				this.hide_option_buttons();
			}
			else
				this.buttons[i].show();
		}
	}
	
	//creating all editor buttons
	loadButtons(){

		this.newB = createButton('New');
		this.newB.size(50,20)
		this.newB.position(cnv.elt.getBoundingClientRect().x, cnv.elt.getBoundingClientRect().y+10);
		this.buttons.push(this.newB)
		this.newB.mousePressed(mp_new);
		
		this.saveB = createButton('Save');
		this.saveB.size(50,20)
		this.saveB.position(cnv.elt.getBoundingClientRect().x+50, cnv.elt.getBoundingClientRect().y+10);
		this.buttons.push(this.saveB)
		this.saveB.mousePressed(mp_save);
		
		this.fileInputloadB = createFileInput(handleFile);
		this.fileInputloadB.elt.hidden = true;
		this.fileInputloadB.elt.id = "load";
  		this.fileInputloadB.elt.accept = ".json";
		this.buttonsAssArr["fileInputloadB"] = this.fileInputloadB;
		
		this.label = createElement('label', 'load');
		this.label.elt.setAttribute("for", "load");
		this.label.position(cnv.elt.getBoundingClientRect().x+100, cnv.elt.getBoundingClientRect().y+10);
		this.label.elt.id = "button"
		this.label.style('border','1px solid black');
		this.label.style('padding','1px');
		this.label.style('width','50px');
		this.label.style('height','14px');
		this.label.style('text-align','center');
		this.buttons.push(this.label);
		
		
		
		this.layerB = createButton('Layer');
		this.layerB.size(65,20)
		this.layerB.position(cnv.elt.getBoundingClientRect().x+150, cnv.elt.getBoundingClientRect().y+10);
		this.layerB.attribute("disabled",true);
		this.buttons.push(this.layerB)
		this.selLayerB = createSelect();
		this.selLayerB.position(cnv.elt.getBoundingClientRect().x + 150, cnv.elt.getBoundingClientRect().y+30);
		this.selLayerB.option('layer 1',0);
		this.selLayerB.option('layer 2',1);
		this.buttons.push(this.selLayerB)
		this.optionsB = createButton('Options');
		this.optionsB.size(65,20)
		this.optionsB.position(cnv.elt.getBoundingClientRect().x+215, cnv.elt.getBoundingClientRect().y+10);
		this.optionsB.attribute("disabled",true);
		this.buttons.push(this.optionsB)
		
		this.seloptionsB = createSelect();
		this.seloptionsB.position(cnv.elt.getBoundingClientRect().x + 215, cnv.elt.getBoundingClientRect().y+30);
		this.seloptionsB.option('decalX',0);
		this.seloptionsB.option('decalY',1);
		this.seloptionsB.option('hitboxX',2);
		this.seloptionsB.option('hitboxY',3);
		this.seloptionsB.option('hitboxW',4);
		this.seloptionsB.option('hitboxH',5);
		this.seloptionsB.option('w_hitboxX',6);
		this.seloptionsB.option('w_hitboxY',7);
		this.seloptionsB.option('w_hitboxW',8);
		this.seloptionsB.option('w_hitboxH',9);
		this.seloptionsB.size(65,20)
		this.buttons.push(this.seloptionsB)
		this.buttonsAssArr["seloptionsB"] = this.seloptionsB;
		this.seloptionsB.changed(seloptionsBEvent);

		this.lvlB = createButton('Level');
		this.lvlB.size(65,20)
		this.lvlB.position(cnv.elt.getBoundingClientRect().x+280, cnv.elt.getBoundingClientRect().y+10);
		this.lvlB.attribute("disabled",true);
		this.buttons.push(this.lvlB)
		this.sellvlB = createSelect();
		this.sellvlB.position(cnv.elt.getBoundingClientRect().x + 280, cnv.elt.getBoundingClientRect().y+30);
		for(let i = 0; i < map.levels.length; i++)
				this.sellvlB.option(map.levels[i].name,i);
		this.sellvlB.changed(sellvlBEvent);
		this.sellvlB.size(65,20)
		this.buttons.push(this.sellvlB)
		this.buttonsAssArr["sellvlB"] = this.sellvlB;
		
		this.dispB = createButton('Display');
		this.dispB.size(65,20)
		this.dispB.position(cnv.elt.getBoundingClientRect().x+345, cnv.elt.getBoundingClientRect().y+10);
		this.dispB.attribute("disabled",true);
		this.buttons.push(this.dispB)
		
		this.seldispB = createSelect();
		this.seldispB.position(cnv.elt.getBoundingClientRect().x + 345, cnv.elt.getBoundingClientRect().y+30);
		this.seldispB.option('Display',0);
		this.seldispB.option('lighting',1);
		this.seldispB.option('hitboxes',2);
		this.seldispB.option('tile options',3);
		this.seldispB.option('grid',4);
		this.seldispB.disable('Display');
		this.seldispB.size(65,20)
		this.seldispB.changed(seldispBEvent);
		this.buttons.push(this.seldispB)
		this.buttonsAssArr["seldispB"] = this.seldispB;

		this.dispSlideB = createButton('Darkness');
		this.dispSlideB.size(65,20)
		this.dispSlideB.position(cnv.elt.getBoundingClientRect().x+410, cnv.elt.getBoundingClientRect().y+10);
		this.dispSlideB.attribute("disabled",true);
		this.buttons.push(this.dispSlideB);

		this.slider = createSlider(0, 255, 100);
  	this.slider.position(cnv.elt.getBoundingClientRect().x + 410, cnv.elt.getBoundingClientRect().y+30);
  	this.slider.style('width', '65px');
  	this.buttons.push(this.slider)
		
		this.loadOptionButtons();
		
		this.showHideButtons(false);
	}
	
	//creating + option button  
	loadOptionButtons()
	{
		  this.prptoptButtons[0] = createInput('');
		  this.prptoptButtons[0].position(0, +20);
		  this.prptoptButtons[0].size(50);
		  this.prptoptButtons[0].elt.value = 0;
		  this.prptoptButtons[0].hide();
		  this.optButtons[0] = createButton('+');
		  this.optButtons[0].position(cnv.elt.getBoundingClientRect().x+camera.offSetX, cnv.elt.getBoundingClientRect().y+camera.offSetY);
		  this.optButtons[0].mousePressed(tileOptionsEvent);
	}
	
	//showing and updating position of + option button
	showOptionButtons()
	{
		//getting grid mouse position
		let i = floor((mouseX - camera.offSetX)/100)
		let j = floor((mouseY - camera.offSetY)/100)
		
		//checking  if on grid
		if(i < 0 || j < 0 || i > map.levels[map.curent_level].sizeY || j > map.levels[map.curent_level].sizeX)
			return;
		
		//updating position  and showing + option button
		this.optButtons[0].show();
		let x = cnv.elt.getBoundingClientRect().x+camera.offSetX+i*100+45;
		let y = cnv.elt.getBoundingClientRect().y+camera.offSetY+j*100+45;
		this.optButtons[0].position(x, y);
		
		
	}
	
	//hiding + option button
	hide_option_buttons()
	{
		for(let i = 0; i < this.optButtons.length; i++)
				this.optButtons[i].hide();
	}
	
	update()
	{

		this.select_element();

		shadowLvl = this.slider.value();
	}
	
	draw_buttons()
	{
		push();
			
			//drawing + options buttons
			if(tileOptions_active)
				this.showOptionButtons();
			
			
		
			//draw bar
			fill(255,255,255);
			rect(0,0,1000,40);
		
		pop();
	}
	
	draw_assets_list()
	{
		push();
		
			//draw assets background
			fill(255,255,255);
			rect(0,700,1000,100)

			//console.log("assets_array.length", assets_array.length)

			//draw assets list
			for(let i = 0; i < assets_array.length; i++)
			{
				let img_array_id = assets_array[i].data_id;
				image(map.img_array[img_array_id], i*100+editor.decalX, 700, 100,100,100*assets_array[i].draw_id,0,100,100)
			}

			//draw red selected rect
			stroke(255,0,0);
			noFill();
			rect(this.selected*100+editor.decalX,700,100,100)
		
		pop();
	}
	
	draw()
	{
		this.draw_buttons();
		this.draw_assets_list();	
	}
	
	//selecting a tile and put it on map
	select_element()
	{
		//mouse clicked
		if (mouseIsPressed === true) {
			
			//checks if click pos on assets list 
			if((mouseX - this.decalX) > 0 && mouseY > 700 && mouseY < 800)
			{
				//select asset
				this.selected = floor((mouseX - this.decalX)/100);
			}
			
			//checks if click pos on map
			if(mouseX > 0 && mouseX < 1000 && mouseY > 20 && mouseY < 700 && document.activeElement == document.body)
			{
				let iw_i = floor((mouseX - camera.offSetX)/100);
				let iw_j = floor((mouseY - camera.offSetY)/100);
				let sizeX = map.levels[map.curent_level].sizeX;
				let sizeY = map.levels[map.curent_level].sizeY;
				
				//checks if click within map boundaries
				if(iw_i >= 0 && iw_i < sizeY && iw_j >= 0 && iw_j < sizeX)
				{
					//adding dynamic element
					if(editor.selected == -1)
						{
							/*console.log(" ", map.levels[map.curent_level].dynamic_elements)
							//adding a fire pit
							map.levels[map.curent_level].dynamic_elements.push(new Tile_To_Draw(900, false, iw_j,iw_i,new FirePit_Tile(iw_j,iw_i)))
							//resorting z index 
							map.levels[map.curent_level].sort();*/
						}
					//adding background element
					else
					{
						//erasing tile
						if(editor.selected == 0)
							map.levels[map.curent_level].game_obj_array[iw_j][iw_i] = null;
						else
						//put tile 
							map.levels[map.curent_level].game_obj_array[iw_j][iw_i] = assets_array[editor.selected];
						//resorting z index 
						map.levels[map.curent_level].sort();
					}
					
				}
			}
			mouseIsPressed = false;
		}

	}
}

//selecting a tile property (decalX decalY hitboxX ...)
function seloptionsBEvent(){
	editor.tilePropSel = editor.buttonsAssArr["seloptionsB"].value();
}

//clicking on + tile options and modifying selected tile property
function tileOptionsEvent()
{
	let i = floor((this.x - camera.offSetX - cnv.elt.getBoundingClientRect().x)/100)
	let j = floor((this.y - camera.offSetY - cnv.elt.getBoundingClientRect().y)/100)
	
	//console.log("map.levels[map.curent_level].game_obj_array[j][i]  ", map.levels[map.curent_level].game_obj_array[j][i])
	
	if(map.levels[map.curent_level].game_obj_array[j][i] == null)
		return;
	
	if(editor.tilePropSel == 0)
	{
		let decal = prompt("decalX", map.levels[map.curent_level].game_obj_array[j][i].decalX);
		map.levels[map.curent_level].game_obj_array[j][i].decalX =  parseInt(decal);
	}
	else if(editor.tilePropSel == 1)
	{
		let decal = prompt("decalY", map.levels[map.curent_level].game_obj_array[j][i].decalY);
		map.levels[map.curent_level].game_obj_array[j][i].decalY =  parseInt(decal);
	}
	else if(editor.tilePropSel == 2)
	{
		let decal = prompt("hitboxX", map.levels[map.curent_level].game_obj_array[j][i].hitboxX);
		map.levels[map.curent_level].game_obj_array[j][i].hitboxX =  parseInt(decal);
	}
	else if(editor.tilePropSel == 3)
	{
		let decal = prompt("hitboxY", map.levels[map.curent_level].game_obj_array[j][i].hitboxY);
		map.levels[map.curent_level].game_obj_array[j][i].hitboxY =  parseInt(decal);
	}
	else if(editor.tilePropSel == 4)
	{
		let decal = prompt("hitboxW", map.levels[map.curent_level].game_obj_array[j][i].hitboxW);
		map.levels[map.curent_level].game_obj_array[j][i].hitboxW =  parseInt(decal);
	}
	else if(editor.tilePropSel == 5)
	{
		let decal = prompt("hitboxH", map.levels[map.curent_level].game_obj_array[j][i].hitboxH);
		map.levels[map.curent_level].game_obj_array[j][i].hitboxH =  parseInt(decal);
	}
	else if(editor.tilePropSel == 6)
	{
		let decal = prompt("w_hitboxX", map.levels[map.curent_level].game_obj_array[j][i].w_hitboxX);
		map.levels[map.curent_level].game_obj_array[j][i].w_hitboxX =  parseInt(decal);
	}
	else if(editor.tilePropSel == 7)
	{
		let decal = prompt("w_hitboxY", map.levels[map.curent_level].game_obj_array[j][i].w_hitboxY);
		map.levels[map.curent_level].game_obj_array[j][i].w_hitboxY =  parseInt(decal);
	}
	else if(editor.tilePropSel == 8)
	{
		let decal = prompt("w_hitboxW", map.levels[map.curent_level].game_obj_array[j][i].w_hitboxW);
		map.levels[map.curent_level].game_obj_array[j][i].w_hitboxW =  parseInt(decal);
	}
	else if(editor.tilePropSel == 9)
	{
		let decal = prompt("w_hitboxH", map.levels[map.curent_level].game_obj_array[j][i].w_hitboxH);
		map.levels[map.curent_level].game_obj_array[j][i].w_hitboxH =  parseInt(decal);
	}
	map.levels[map.curent_level].resort();
}


//select display event
function seldispBEvent(){
	
	//returns options selected
	let selected = editor.buttonsAssArr["seldispB"].selected();
	
	//lights
	if(selected == 1)
	{
		if(shadowsLighting_active)
			shadowsLighting_active = false;
		else
			shadowsLighting_active = true;
	}
	
	//hitbox
	if(selected == 2)
	{
		if(hitboxshow_active)
			hitboxshow_active = false;
		else
			hitboxshow_active = true;
	}
	
	//tile options
	if(selected == 3)
	{
		if(tileOptions_active)
		{
			tileOptions_active = false;
			editor.hide_option_buttons();
		}
		else
			tileOptions_active = true;
	}
	
	//grid
	if(selected == 4)
	{
		if(grid_active)
			grid_active = false;
		else
			grid_active = true;
	}
	
	editor.buttonsAssArr["seldispB"].selected(0);
	editor.buttonsAssArr["seldispB"].elt.blur();
	
}

function sellvlBEvent(){
	
	//returns options selected
	let selected = editor.buttonsAssArr["sellvlB"].selected();
	
	//changing level
	map.curent_level = selected;
	
	//setting player spawn position
	player.setSpawnPosition();
	
	//defocusing select list
	editor.buttonsAssArr["sellvlB"].elt.blur();
}

function seltunBEvent(){
	
	//returns options selected
	let selected = editor.buttonsAssArr["seltunB"].selected();
	
	//changing level
	map.curent_level = parseInt(selected)+1000;
	
	//setting player spawn position
	player.setSpawnPosition();
	
	//defocusing select list
	editor.buttonsAssArr["seltunB"].elt.blur();
}

//new option event
function mp_new(){
	//map.levels[map.curent_level].create();
	map.levels[map.curent_level].create();
}

//save option event
function mp_save(){

	map.levels[map.curent_level].saveLevel();
	
	//creating new map object with background array and dynamic array
	/*let combined_map = {lvl_array:map.levels[map.curent_level].lvl_array,dynamic_array:map.levels[map.curent_level].dynamic_elements}
	
	if(map.curent_level >= 1000)
		File.save(combined_map, "tunnel")
	else
		File.save(combined_map, game_map.stations[map.curent_level].name)*/
}

//load option event
function mp_load(){
	//map.levels[map.curent_level].create();
	//map.levels[map.curent_level].loadLevel();
}


//mouse wheel event
function mouseWheel(event) {
  if(event.deltaY  >  0)
  {
	  	  //scrolling tiles
	      editor.decalX-=100;
  }
  else
  {
	  if(editor.decalX!=0)
		  editor.decalX+=100;
  }
}