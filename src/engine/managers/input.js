import {Base} from '../base'

const KEYCODE_MAX = 223;
const MOUSECODE_MAX = 223;



class Input extends Base
{
	constructor()
	{
		super();
		this.oldkeys = Array(KEYCODE_MAX).fill(false);
		this.keys = Array(KEYCODE_MAX).fill(false);
		this.mouse = new Object();
		this.mouse.oldkeys = Array(MOUSECODE_MAX).fill(false);
		this.mouse.keys = Array(MOUSECODE_MAX).fill(false);
		this.mouse.Location = [0, 0];
		this.mouse.Velocity = [0, 0];

		this.phone = new Object();
		this.phone.alpha = null;
		this.phone.beta = null;
		this.phone.gamma = null;
		this.phone.touch = new Object();
		this.phone.touch.state = false;
		this.phone.touch.point = null;
		this.phone.touch.Location = [0, 0];
	}

	BeginPlay()
	{
		document.addEventListener("keyup", (event) => {
			this.OnKeyUp(event.which);
		});
		document.addEventListener("keydown", (event) => {
			this.OnKeyDown(event.which);
		});
		document.addEventListener("mousedown", (event) => {
			this.OnMouseDown(event.which);
		});
		document.addEventListener("mouseup", (event) => {
			this.OnMouseUp(event.which);
		});
		document.addEventListener("contextmenu", (event) => {
    		event.preventDefault();
		});
		window.addEventListener("deviceorientation", (event) => {
			this.phone.alpha = event.alpha;
			this.phone.beta = event.beta;
			this.phone.gamma = event.gamma;
		}, true);
		window.addEventListener("touchstart", (event) => {
			this.phone.touch.point = event.touches.item(0);
		});
		window.addEventListener("touchend", (event) => {
			if(event.touches.length == 0)
				this.phone.touch.point = null;
		});
		window.addEventListener("touchcancel", (event) => {
			if(event.touches.length == 0)
				this.phone.touch.point = null;
		});
		window.addEventListener("touchmove", (event) => {
			this.phone.touch.point = event.touches.item(0);
		});
	}

	Tick(dt)
	{
		this.oldkeys = this.keys.slice();
		this.mouse.oldkeys = this.mouse.keys.slice();
	}

	OnKeyUp(keycode)
	{
		this.keys[keycode] = false;
	}
	OnKeyDown(keycode)
	{
		this.keys[keycode] = true;
	}

	OnMouseUp(keycode)
	{
		this.mouse.keys[keycode] = false;
	}
	OnMouseDown(keycode)
	{
		this.mouse.keys[keycode] = true;
	}


	KeyUp(n)
	{
		let k = Input.CtoK(n);
		return this.oldkeys[k] && !this.keys[k];
	}
	KeyDown(n)
	{
		return this.keys[Input.CtoK(n)];
	}
	MouseUp(n)
	{
	}
	MouseDown(n)
	{

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
