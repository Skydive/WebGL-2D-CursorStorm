import {Base} from '../base'

var KEYCODE_MAX = 223;
function CtoK(str)
{
	switch(str.toUpperCase())
	{
		case "SHIFT": 	return 16;
		case "CTRL": 	return 17;
		case "ALT": 	return 18;
		case "LALT": 	return 18;
		case "RALT" : 	return 225;
		case "SPACE": 	return 32;
		case "BKSP": 	return 8;
		case "TAB": 	return 9;
		case "ENTER": 	return 13;
		case "LEFT": 	return 37;
		case "UP":		return 38;
		case "RIGHT":	return 39;
		case "DOWN":	return 40;
	}
	return str.toUpperCase().charCodeAt(0);
}

class Input extends Base
{
	constructor()
	{
		super();
		this.keys = [];
		this.mouse = new Object();
		this.mouse.keys = [];
		this.mouse.Location = [0, 0];
		this.mouse.Velocity = [0, 0];
	}

	BeginPlay()
	{
		document.addEventListener("keyup", function(event)
		{
			console.log(event.which);
			//this.OnKeyUp(event.which);
		});
		document.addEventListener("keydown", function(event)
		{

		});
		document.addEventListener("mousedown", function(event)
		{

		});
		document.addEventListener("mouseup", function(event)
		{

		});
		document.addEventListener("contextmenu", function(event)
		{
    		event.preventDefault();
		});
	}

	Tick(dt)
	{
		this.keys = this.keys.filter(x => x.down);
		this.mouse.keys = this.mouse.keys.filter(x => x.down);


	}

	OnKeyUp(keycode)
	{

	}
	OnKeyDown(keycode)
	{

	}

	OnMouseUp(keycode)
	{

	}
	OnMouseDown(keycode)
	{

	}

	MouseUp(n)
	{

	}
	MouseDown(n)
	{

	}


}
export {Input};
