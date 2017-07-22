import {Base} from 'engine/base'
import {GameCore} from 'game/gamecore'

import $ from 'jquery'

var core = null;
function Precache()
{
	Base.log.elementid = "loadinglog";
	core = new GameCore();
	setTimeout(() => {
		core.Precache({
			canvasid: "glcanvas"
		});
		let I = setInterval(() => {
			if(core.Resource.Redundancy == 0)
			{
				clearInterval(I);
				core.Log("Precache Completed!");
				PrecacheCompleted();
			}
		}, 500);
	}, 0);
	PrecacheCompleted();
}

function PrecacheCompleted()
{
	$("#startbutton").removeClass("disabled");
	$("#startbutton").addClass("enabled");
}

function OnStart()
{
	$("#loadingdiv").remove();
	core.Start();
}
export {core, Precache, OnStart};
