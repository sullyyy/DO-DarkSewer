let stationsToLoadStr = ["./data/stations/OKHOTNY RYAD.json","./data/stations/TEATRAL'NAYA.json"];
let tunnelToLoadStr = ["./data/tunnels/tunnel_layout_1.json","./data/tunnels/tunnel_layout_2.json"];
let stationsData = [];
let stationsDataDyn = [];
let tunnelData = [];
let tunnelDataDyn = [];

class File {
    constructor () {
		
	}
	
	//loading stations map data
	static loadStationsData()
	{
		for(let i = 0; i < stationsToLoadStr.length; i++)
			{
				loadJSON(stationsToLoadStr[i], 
					function loadjson(json)
					{
						stationsData.push(json);
						
					}
				);
			}
		
		
	}
	
	static loadStations(){
		for(let k = 0; k < stationsToLoadStr.length; k++)
			{
		
		loadJSON(stationsToLoadStr[k], function f(json){
			
			stationsData[k] = json.lvl_array;
			stationsDataDyn[k] = json.dynamic_array;
			
			for(let i = 0; i < stationsDataDyn[k].length; i++)
				{
					stationsDataDyn[k][i] = new Tile_To_Draw(json.dynamic_array[i].tile_id, false, json.dynamic_array[i].i,json.dynamic_array[i].j,new FirePit_Tile(json.dynamic_array[i].i,json.dynamic_array[i].j));
				}
			
		}
		
		);
			}
		
	}
	
	static loadTunnels(){
		for(let k = 0; k < tunnelToLoadStr.length; k++)
			{
		
		loadJSON(tunnelToLoadStr[k], function f(json){
			
			tunnelData[k] = json.lvl_array;
			tunnelDataDyn[k] = json.dynamic_array;
			
			for(let i = 0; i < tunnelDataDyn[k].length; i++)
				{
					tunnelDataDyn[k][i] = new Tile_To_Draw(json.dynamic_array[i].tile_id, false, json.dynamic_array[i].i,json.dynamic_array[i].j,new FirePit_Tile(json.dynamic_array[i].i,json.dynamic_array[i].j));
				}
			
		}
		
		);
			}
		
	}
	
	//loading assets data
	static loadAssets()
	{
		loadJSON("./data/assets.json", function loadAssets_c(json){
			assets_array = json;
		}
		
		);
		
	}
	
	//saving level
	static save(obj,name)
	{
		saveJSON(obj,name + ".json");
	}
}

//loading a file map
function handleFile(file)
{
	editor.fileInputloadB.elt.value = "";
	editor.buttonsAssArr["fileInputloadB"].elt.blur();
	map.levels[map.curent_level].lvl_array = file.data.lvl_array;
	
	for(let i = 0; i < file.data.dynamic_array.length; i++)
	{
		map.levels[map.curent_level].dynamic_elements[i] = new Tile_To_Draw(file.data.dynamic_array[i].tile_id, false, file.data.dynamic_array[i].i,file.data.dynamic_array[i].j,new FirePit_Tile(file.data.dynamic_array[i].i,file.data.dynamic_array[i].j));
	}
	
	map.levels[map.curent_level].sort();
	
}








