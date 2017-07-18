import {Controller} from '../framework/controller'
import {CameraEntity} from './cameraentity';

import $ from 'jquery'

class ShipController extends Controller
{
	constructor()
	{
		super();

		$("body").append("<div id='ship_hud'></div>");
		$("#ship_hud").css({
		    "position": "absolute",
		    "width": "auto",
			"height": "auto",
			"color": "#FFFFFF",
		    "border": "2px solid #ccc",
			"padding": "5px",
			"text-align": "center",
			"bottom": "10%",
			"left": "10%",
			"transform": "translateX(-50%)",
		});
		$("#ship_hud").append("<p id='ship_hud_fps'></p>");
		$("#ship_hud").append("<br/><p id='ship_hud_health'></p>");
		$("#ship_hud").append("<br/><p id='ship_hud_location'></p>");
		$("#ship_hud").append("<br/><p id='ship_hud_cameralocation'></p>");
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.Camera = this.Spawn(CameraEntity);
	}

	Tick(dt)
	{

		if(this.Pawn == null || this.Camera == null)
			return;

		this.Camera.Target = this.Pawn;

		this.KeyboardControls(dt);
		this.PhoneControls(dt);

		$("#ship_hud_fps").html(`FPS: ${(1/dt).toFixed(0)}`);
		$("#ship_hud_cameralocation").html(`Camera Location: [${this.Camera.Location[0].toFixed(0)}, ${this.Camera.Location[1].toFixed(0)}]`);
		if(this.Pawn != null)
		{
			$("#ship_hud_health").html(`HP ${this.Pawn.Health}`);
			$("#ship_hud_location").html(`Location: [${this.Pawn.Location[0].toFixed(0)}, ${this.Pawn.Location[1].toFixed(0)}]`);
		}
		else
		{
			$("#ship_hud_location").html("");
		}
	}

	KeyboardControls(dt)
	{
		let r = 0;
		let th = 0;
		if     (this.core.Input.KeyDown("W"))	{r = 1;}
		else if(this.core.Input.KeyDown("S"))	{r = -1;}
		if     (this.core.Input.KeyDown("A"))	{th = 1;}
		else if(this.core.Input.KeyDown("D"))	{th = -1;}
		if(r != 0)
			this.Pawn.ApplyThrust(r, dt);
		if(th != 0)
			this.Pawn.ApplyRotation(th, dt);

		if(this.core.Input.KeyDown("SPACE"))
			this.Pawn.FireCannon(dt);
	}

	PhoneControls(dt)
	{
		let beta = this.core.Input.phone.beta;
		if(beta != null)
		{
			beta = Math.max(Math.min(this.core.Input.phone.beta, 90), 0);
			let r = -(beta-45)/90;
			this.Pawn.ApplyThrust(r, dt);
		}
		let gamma = this.core.Input.phone.gamma;
		if(gamma != null)
		{
			gamma = Math.max(Math.min(gamma, 45), -45);
			let th = -gamma/90;
			this.Pawn.ApplyRotation(th, dt);
		}
		let touch = this.core.Input.phone.touch;
		if(touch.point != null)
		{
			this.Pawn.FireCannon(dt);
		}
	}

}
export {ShipController}
