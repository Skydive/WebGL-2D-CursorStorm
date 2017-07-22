import $ from 'jquery'

class Base
{
	constructor()
	{
		this.core = null;
		this.owner = null;
	}

	CreateObject()
	{
		var args = Array.prototype.slice.call(arguments);
		var object = args.shift();
		var instance = new object(...args);
		instance.owner = this;
		instance.core = this.core;
		return instance;
	}

	isChildOfClass(cls)
	{
		return this instanceof cls;
	}

	Log(s)
	{
		console.log(s);
		if(Base.log.elementid != null)
		{
			let e = $(`#${Base.log.elementid}`);
			e.append(`[${this.constructor.name}] -> ${s}<br/>`);
			e.scrollTop(e[0].scrollHeight);
		}
	}
}
Base.log = {};
Base.log.elementid = null;
export {Base};
