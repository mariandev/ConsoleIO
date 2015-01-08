var Dashboard;
window.addEventListener('load', function() {
	Dashboard = new ConsoleIO({
	    enable_rewrites: true,
	    enable_warnings: false,
	    console_name: "Uplink Console:"
	});
	Dashboard.registerCommand(Command_test);
	Dashboard.registerCommand(Command_clear);
	Dashboard.registerCommand(Command_hallo);
	Dashboard.registerCommand(Command_margs);
	Dashboard.registerCommand(Command_help);
});

var Command_test = new Object({
	name: 'test',
	version: '0.0.1',
	init: false,
	exec: function(args, cb) {
		if(!args) args = [];
		var i = args.indexOf('-c');
		if(i != -1 && args[i+1]){
			this.write("Custom: "+args[i+1]);
		}else{
			this.write("test2");
		}
		if(typeof cb === 'function') cb.call(this);
	}
});

var Command_margs = new Object({
	name: 'margs',
	version: '0.0.1',
	init: false,
	exec: function(args, cb) {
		if(!args) args = [];
		this.write("ARGS:");
		for(var i=0;i<args.length;i+=2)
			this.write(args[i]+"   ::   "+args[i+1]);
		if(typeof cb === 'function') cb.call(this);
	}
});

var Command_clear = new Object({
	name: 'clear',
	version: '0.0.1',
	init: false,
	exec: function(args, cb) {
		this.__display.innerHTML = "";
		if(typeof cb === 'function') cb.call(this);
	}
});

var Command_hallo = new Object({
	name: 'hallo',
	version: '0.0.1',
	exec: function(args, cb) {
		this.write('Hallo 1');
		window.setTimeout(function(_this, cb) {
			_this.write("Hallo 2");
			if(typeof cb === 'function') cb.call(_this);
		}, 1000, this, cb);
	}
});

var Command_help = new Object({
	name: ['help','?'],
	version: '1.0',
	exec: function(args, cb) {
		this.write("");
		this.write('~~~~~~~{HELP}~~~~~~~');
		this.write("");
		for(var command in this.__commands)
			this.write("&nbsp;&nbsp;&nbsp;" + command + " (v"+ this.__commands[command].version +")");
		this.write("");
		if(typeof cb === 'function') cb.call(this);
	}
});