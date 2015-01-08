var Console;
window.addEventListener('load', function() {
	Console = new ConsoleIO({
	    enable_rewrites: true,
	    //enable_warnings: true
	    //console_name: "Custom name:"
	});
	Console.registerCommand(Command_showargs);
	Console.registerCommand(Command_pretty);
	Console.registerCommand(Command_showimage);
	Console.registerCommand(Command_help);
});

var Command_showargs = new Object({
	name: 'showargs',
	version: '1.0',
	exec: function(args, next) {
		
		var k = 0;
		for(var i=0;i<args.length;i++)
		    this.write((i+1) + ". " + args[i], {color: ((k=!k)?"cyan":"magenta") });
		
		next();
	}
});

var Command_pretty = new Object({
	name: 'pretty',
	version: '1.0',
	exec: function(args, next) {
		
		var msg = "";
		for(var i=0;i<args.length;i++) {
		    msg += args[i] + " ";
		}
		
		this.write(msg, {color: "magenta"});
		
		next();
	}
});

var Command_showimage = new Object({
	name: 'showimage',
	version: '1.0',
	exec: function(args, next) {
		
		if(args.length !== 0)
	    	this.write("<img src="+args[0]+">");
	    else
	        this.warn("You have to pass an image url a a parameter");
		
		next();
	}
}); // Example: showimage //http://lorempixel.com/output/abstract-q-g-640-480-3.jpg

var Command_help = new Object({
	name: ['help','?'],
	version: '1.0',
	exec: function(args, next) {
		this.write("");
		this.write('<<<<<<<<<< HELP >>>>>>>>>>');
		this.write("");
		for(var command in this.__commands)
			this.write("&nbsp;&nbsp;&nbsp;" + command + " (v"+ this.__commands[command].version +")");
		this.write("");
		next();
	}
});