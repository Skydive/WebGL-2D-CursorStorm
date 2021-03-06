import {NULL_PTR} from 'engine/entity'
import {Controller} from 'framework/controller'
import {CameraEntity} from 'game/cameraentity'

import $ from 'jquery'
import * as glm from 'gl-matrix'

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
		    "border": "1px solid #ccc",
			"padding": "5px",
			"text-align": "center",
			"bottom": "10%",
			"left": "10%",
			"transform": "translateX(-50%)",
		});
		$("#ship_hud").append("<p id='ship_hud_fps'></p>");
		$("#ship_hud").append("<p id='ship_hud_health'></p>");
		$("#ship_hud").append("<p id='ship_hud_drag'></p>");
		$("#ship_hud").append("<p id='ship_hud_location'></p>");
		$("#ship_hud").append("<p id='ship_hud_cameralocation'></p>");

		$("body").append("<div id='ship_hud_top'></div>");
		$("#ship_hud_top").css({
		    "position": "absolute",
		    "width": "auto",
			"height": "auto",
			"color": "#FFFFFF",
		    "border": "1px solid #ccc",
			"padding": "5px",
			"text-align": "center",
			"top": "0%",
			"right": "0%"
		});
		$("#ship_hud_top").append("<img id='money_img' src='res/tex/icons/money.png'></img>");
		$('#money_img').css({
			"vertical-align": "middle"
		});
		$("#ship_hud_top").append("<span id='ship_hud_money'></span>");
		$('#ship_hud_money').css({
			"font-weight": "bold",
			"font-size": "x-large"
		});

		this.Money = 0;

		this.LastDragTime = 0;
		this.DragInterval = 0.25;
	}

	BeginPlay()
	{
		super.BeginPlay();
		this.core.Render.pipeline.CameraMag = [3, 3];
		this.CameraPtr = this.Spawn(CameraEntity).Ref;
	}

	Tick(dt)
	{
		let Pawn = this.PawnPtr.Deref;
		let Camera = this.CameraPtr.Deref;
		if(Pawn == null || Camera == null)
			return;

		Camera.TargetPtr = this.PawnPtr;

		this.KeyboardControls(dt);
		this.PhoneControls(dt);

		$("#ship_hud_fps").html(`FPS: ${(1/dt).toFixed(0)}`);
		$("#ship_hud_cameralocation").html(`Cam Location: [${Camera.Location[0].toFixed(0)}, ${Camera.Location[1].toFixed(0)}]`);
		$("#ship_hud_money").html(`€${this.Money}`);
		if(Pawn != null)
		{
			$("#ship_hud_health").html(`HP ${Pawn.Health}`);
			$("#ship_hud_location").html(`Location: [${Pawn.Location[0].toFixed(0)}, ${Pawn.Location[1].toFixed(0)}]`);
			$("#ship_hud_drag").html(`Stabilisation (P): ${Pawn.bDrag}`);
		}
		else
		{
			$("#ship_hud_health").html("");
			$("#ship_hud_location").html("");
		}
	}

	KeyboardControls(dt)
	{
		let Pawn = this.PawnPtr.Deref;
		let r = 0;
		let th = 0;
		if     (this.core.Input.KeyDown("W"))	{r = 1;}
		else if(this.core.Input.KeyDown("S"))	{r = -1;}
		if     (this.core.Input.KeyDown("A"))	{th = 1;}
		else if(this.core.Input.KeyDown("D"))	{th = -1;}
		if(r != 0)
			Pawn.ApplyThrust(r, dt);
		if(th != 0)
			Pawn.ApplyRotation(th, dt);

		if(this.core.Input.KeyDown("SPACE"))
			Pawn.FireCannon(dt);

		if(this.core.Input.KeyDown("P") && this.core.GetTime() - this.LastDragTime > this.DragInterval)
		{
			Pawn.bDrag = !Pawn.bDrag;
			this.LastDragTime = this.core.GetTime();
		}
	}

	PhoneControls(dt)
	{
		let Pawn = this.PawnPtr.Deref;
		let beta = this.core.Input.phone.beta;
		if(beta != null)
		{
			beta = Math.max(Math.min(this.core.Input.phone.beta, 90), 0);
			let r = -(beta-45)/90;
			Pawn.ApplyThrust(r, dt);
		}
		let gamma = this.core.Input.phone.gamma;
		if(gamma != null)
		{
			gamma = Math.max(Math.min(gamma, 45), -45);
			let th = -gamma/90;
			Pawn.ApplyRotation(th, dt);
		}
		let touch = this.core.Input.phone.touch;
		if(touch.point != null)
		{
			Pawn.FireCannon(dt);
		}
	}

}
export {ShipController}
