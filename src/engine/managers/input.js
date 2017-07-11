import {Base} from '../base'

const KEYCODE_MAX = 223;




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

		this.phone = new Object();
		this.phone.alpha = null;
		this.phone.beta = null;
		this.phone.gamma = null;
		this.phone.touch = new Object();
		this.phone.touch.state = false;
		this.phone.touch.Location = [0, 0];
	}

	BeginPlay()
	{
		document.addEventListener("keyup", function(event)
		{
			this.OnKeyUp(event.which);
		}.bind(this));
		document.addEventListener("keydown", function(event)
		{
			this.OnKeyDown(event.which);
		}.bind(this));
		document.addEventListener("mousedown", function(event)
		{
			this.OnMouseDown(event.which);
		}.bind(this));
		document.addEventListener("mouseup", function(event)
		{
			this.OnMouseUp(event.which);
		}.bind(this));
		document.addEventListener("contextmenu", function(event)
		{
    		event.preventDefault();
		}.bind(this));
		window.addEventListener("deviceorientation", function(event)
		{
			this.phone.alpha = event.alpha;
			this.phone.beta = event.beta;
			this.phone.gamma = event.gamma;
		}.bind(this), true);
	}

	Tick(dt)
	{
		this.keys = this.keys.filter(x => x.down);
		this.mouse.keys = this.mouse.keys.filter(x => x.down);
	}

	OnKeyUp(keycode)
	{
		if(keycode >= 0 && keycode < KEYCODE_MAX)
		{
			for(var i=0; i<this.keys.length; i++)
			{
				if(this.keys[i].code == keycode)
				{
					this.keys[i].down = false;
				}
			}
		}
	}
	OnKeyDown(keycode)
	{
		if(keycode >= 0 && keycode < KEYCODE_MAX)
		{
			if(this.keys.map(function(x){return x.code;}).indexOf(keycode) == -1)
			{
				this.keys.push({code: keycode, down: true});
			}
			else
			{
				for(var i=0; i<this.keys.length; i++)
				{
					if(this.keys[i].code == keycode)
					{
						this.keys[i].down = true;
					}
				}
			}
		 }
	}

	OnMouseUp(n)
	{
		for(var i=0; i<this.mouse.keys.length; i++)
		{
			if(this.mouse.keys[i].code == n)
			{
				this.mouse.keys[i].down = false;
			}
		}
	}
	OnMouseDown(n)
	{
		if(this.mouse.keys.map(function(x){return x.code;}).indexOf(n) == -1)
		{
			this.mouse.keys.push({code: n, down: true});
		}
		else
		{
			for(var i=0; i<this.mouse.keys.length; i++)
			{
				if(this.mouse.keys[i].code == n)
				{
					this.mouse.keys[i].down = true;
				}
			}
		}
	}


	KeyUp(n)
	{
		return this.keys.filter( x => x.code==Input.CtoK(n) && !x.down ).length > 0;
	}
	KeyDown(n)
	{
		return this.keys.filter( x => x.code==Input.CtoK(n) &&  x.down ).length > 0;
	}
	MouseUp(n)
	{
		return this.mouse.keys.filter( x => x.code==n && !x.down ).length > 0;
	}
	MouseDown(n)
	{
		return this.mouse.keys.filter( x => x.code==n &&  x.down ).length > 0;
	}


	static CtoK(str)
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
}
export {Input};
