
class Base
{
	constructor()
	{
		this.core = null;
	}

	CreateObject()
	{
		var args = Array.prototype.slice.call(arguments);
		var object = args.shift();
		var instance = new object(args);
		instance.core = this.core;
		return instance;
	}

	isChildOfClass(cls)
	{
		return this instanceof cls;
	}
}
export {Base};
