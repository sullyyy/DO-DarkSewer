let ctx;

const MAIN_MENU = 0;
const PLAY = 1;
const HOW_TO_PLAY = 2;
const EDITOR = 3;
const IN_GAME_MENU = 4;
const LVL_TRANSITION = 5;
const GAME_OVER = 6;
const INTRO = 7;

let game_scale = 1.0;

let keys = [];

let gameState = MAIN_MENU;
let fr = 60;

let windowWidth = 1000
let windowHeight = 800;

let font;
let fontSize = 40;

let  pg;

let assets_array = [];
let whb = [];
let lvl1;
let lvl2;
let lvl3;

let m_car;
let m_deadzombie;
let m_keycard;



//let therundmc = PUTE;

let shadowsLighting_active = true;
let grid_active = true;
let hitboxshow_active = false;
let tileOptions_active = false;

let shadowLvl = 100;

function preload() {

	//loading fonts
	font = loadFont('assets/font/joystix.ttf');

	//loading assets img
	/*data_0 = loadImage('assets/img/tileset/data_0.png');
	data_1 = loadImage('assets/img/tileset/data_1.png');
	data_2 = loadImage('assets/img/tileset/data_2.png');
	data_3 = loadImage('assets/img/tileset/data_3.png');
	data_4 = loadImage('assets/img/tileset/data_4.png');*/
	data_0a = loadImage('assets/img/tileset/data_0a.png');

	//imgs
	player_img = loadImage('assets/img/player.png');
	player_dead = loadImage('assets/img/dwight_dead.png');
	heart_img = loadImage('assets/img/heart.png');
	light_circle = loadImage('assets/img/light_circle.png');
	light_drop = loadImage('assets/img/light_drop.png');
	light_drop_rect = loadImage('assets/img/light_drop_rect.png');
	light_drop_grilled = loadImage('assets/img/light_drop_grilled.png');
	blood_drop_img = loadImage('assets/img/blood.png');
	bullet_img = loadImage('assets/img/bullet.png');
	main_menu_bckgrnd = loadImage('assets/img/main_menu_bckgrnd.png');
	car = loadImage('assets/img/car.png');
	deadzombie = loadImage('assets/img/dead_pnj.png');
	keycard = loadImage('assets/img/keycard.png');

	zombie_head_intro = loadImage('assets/img/zombie_head_intro.png');
	logo_intro = loadImage('assets/img/logo_intro.png');

	//animations
	anim_dwight = loadImage('assets/anim/animation_dwight.png');
	anim_dwight_gun = loadImage('assets/anim/animation_dwight_gun.png');
	anim_zombie = loadImage('assets/anim/animation_zombie.png');
	anim_blood_effect = loadImage('assets/anim/anim_bleeding.png');
	anim_gun_fire = loadImage('assets/anim/gun_fire_animation.png');
	anim_impact = loadImage('assets/anim/impact.png');

	//loading assets data
	loadJSON("assets/img/tileset/assets.json", function loadAssets_c(json){
			assets_array = json;
	});
	loadJSON("data/weapon_hitbox.json", function loadAssets_c(json){
			whb = json;
	});
	loadJSON("data/spawn.json", function loadAssets_c(json){
			lvl1 = json;
	});
	loadJSON("data/corridor1.json", function loadAssets_c(json){
			lvl2 = json;
	});
	loadJSON("data/sewers1.json", function loadAssets_c(json){
			lvl3 = json;
	});
	loadJSON("data/sewers2.json", function loadAssets_c(json){
			lvl4 = json;
	});
	loadJSON("data/metro1.json", function loadAssets_c(json){
			lvl5 = json;
	});
	loadJSON("data/metro2.json", function loadAssets_c(json){
			lvl6 = json;
	});
	loadJSON("data/corridor2.json", function loadAssets_c(json){
			lvl7 = json;
	});
	loadJSON("data/metro3.json", function loadAssets_c(json){
			lvl8 = json;
	});
	
	
}

function setup() {
	
	//creating canvas
	cnv = createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	ctx = cnv.canvas.getContext('2d', {willReadFrequently: true});

	//creating offscreen drawing buffers
	pg = createGraphics(windowWidth,windowHeight);

	ig_menu_lyr = createGraphics(windowWidth,windowHeight);
	ig_menu_lyr.textFont(font);
	ig_menu_lyr.textSize(fontSize);
	
	//setting up framerate
	frameRate(fr);
	
	//setting up fonts and texts
	textFont(font);
	textSize(fontSize);
	textAlign(CENTER, CENTER);

	//creating Player
	player = new Player(100,100,36,70,anim_dwight,1000);

	//creating zombie
	//zombie = new Zombie(100,200,36,70,anim_zombie,1001);

	//temp_createHitBoxes();
	m_car = new M_Car();
	m_deadzombie = new M_DeadZombie();
	m_keycard = new M_Keycard();

	//creating map
	map = new Map();
	
	//creating camera
	camera = new Camera(0, 0,1000,800);

	editor = new Editor();

	intro = new Intro();

	

	
}

function draw() {
	
	//looping around gamestate
	switch (gameState) {
			
		case MAIN_MENU:
			Menu.s_draw();
	  	Menu.s_select_option(2);
		break;
			
		case HOW_TO_PLAY:
			Menu.s_drawHowToPlay();
			Menu.s_return();
		break;
			
		case PLAY:
			map.update();
			player.update();
			map.draw();
			Menu.s_return();
		break;
			
		case EDITOR:
			map.draw();
			editor.update();
			editor.draw();
			camera.move();
			Menu.s_return();
		break;

		case IN_GAME_MENU:
			Menu.s_ig_draw();
			Menu.s_ig_select_option(1);
			Menu.s_return();
		break;

		case GAME_OVER:
			map.update();
			map.draw();
			Menu.s_return();
			break;
			
		case LVL_TRANSITION:
			map.drawlvltrans();
		break;

		case INTRO:
			intro.draw();
		break;
	}

	drawFrameRate();
	
}

//draws framerate in the top right of window
function drawFrameRate()
{
	push();
		textSize(8);
		fill(0, 255, 0);
		text(int(getFrameRate()) + " fps", windowWidth-50, 50);
		//console.log(int(getFrameRate()) + " fps");
	pop();
}

//resizes canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	keys[keyCode] = 1;
}

function keyReleased() {
	keys[keyCode] = 0;	
}