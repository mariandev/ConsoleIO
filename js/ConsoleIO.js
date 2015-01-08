window.ConsoleIO = function(opts){
    
    if(!opts) var opts = {};

    this.__displayId = opts.display_id || 'display';
    this.__enableWarnings = opts.enable_warnings || false;
    this.__enableRewrites = opts.enable_rewrites || false;
    this.__consoleName = opts.console_name || "ConsoleIO:";
	this.__commandBox = null;
	this.__display = false;
	this.__commands = {};
	this.__waitingForCommand = false;
	this.__colors = {
		error: "red",
		warn: "yellow",
		default: "#bada55"
	};
	this.__history = {
		pos: 0,
		commands: [""]
	};
	
	this.registerCommand([Default_command_clear,Default_command_help], function() {
	    this.init(function() {
	        this.waitForCommand();
	    });
	}.bind(this));
	
};
ConsoleIO.prototype.init = function (cb) {
	this.__display = document.getElementById(this.__displayId);

	this.__display.setAttribute('class', 'ConsoleIO');
	
	if(typeof cb === 'function') cb.call(this);
	
};
ConsoleIO.prototype.handleinput = function(e) {
    if(!this.__waitingForCommand) return;
	this.__commandBox = document.getElementById("ConsoleIO-command-box");
	if(e.which == 13) {
	    this.__history.commands[(this.__history.commands.length - 1)] = this.__commandBox.value;
		this.execute(this.__commandBox.value);
	}else if(e.which == 8){
		this.__history.commands[(this.__history.commands.length - 1)] = this.__commandBox.value;
	}else if(e.which == 38){
		e.preventDefault();
		if(this.__history.pos > 0) this.__history.pos--;
		this.__commandBox.value = this.__history.commands[this.__history.pos];
	}else if(e.which == 40){
		e.preventDefault();
		if(this.__history.pos < this.__history.commands.length-1) this.__history.pos++;
		this.__commandBox.value = this.__history.commands[this.__history.pos];
	}else{
	    this.__history.commands[(this.__history.commands.length - 1)] = this.__commandBox.value;
	}
};
ConsoleIO.prototype.execute = function(cmd) {
	
	this.__commandBox = document.getElementById("ConsoleIO-command-box");
	if(this.__commandBox){
		var parent = this.__commandBox.parentNode;
		parent.innerHTML = this.__commandBox.value;
		parent.setAttribute('style', 'color: ' + this.__colors.default);
		delete this.__commandBox;
		/*this.__commandBox.removeAttribute("id");
		this.__commandBox.addAttribute("disabled", "true");*/
	}
	
	this.__waitingForCommand = false;
	if(this.__history.commands[(this.__history.commands.length - 1)] === ""){
		this.__history.commands[(this.__history.commands.length - 1)] = this.__history.commands[this.__history.pos];
	}
	this.__history.pos = this.__history.commands.length;
	this.__history.commands[this.__history.pos] = "";
	var command = cmd.split(" ");
	var command_name = command.splice(0, 1);
	var args = command;
	if(!this.__commands[command_name]) {
		this.__error("This command `"+command_name+"` does not exist.");
		this.waitForCommand();
		return;
	}
	this.__commands[command_name].exec.call(this, args, (function() {
		//console.log(this);
		this.waitForCommand();
	}).bind(this));
};
ConsoleIO.prototype.waitForCommand = function() {
	this.__commandBox = document.createElement("input");
	this.__commandBox.id = "ConsoleIO-command-box";
	this.__commandBox.setAttribute('class', "ConsoleIO-command-box");
	//this.write("mariandev@console_dashboard: ", {nobreak: true, color: this.__colors.default});

	var wrap = document.createElement("span");
		wrap.setAttribute('class', "ConsoleIO-cell");
		wrap.appendChild(this.__commandBox);

    this.write("<span class='ConsoleIO-cell ConsoleIO-cell-shrink'>" + this.__consoleName + "&nbsp;</span><span class='ConsoleIO-cell ConsoleIO-cell-stretch .ConsoleIO-command'><input id='ConsoleIO-command-box' class='ConsoleIO-command-box'></span>");

	//this.write(wrap);
	this.__commandBox = document.getElementById("ConsoleIO-command-box");
	this.__commandBox.onkeydown = (this.handleinput).bind(this);
	//this.__commandBox.focus();
	this.__waitingForCommand = true;
	console.log(this.__commandBox);
};
ConsoleIO.prototype.registerCommand = function(command, cb) {
    
    if(command.constructor !== Array) {
        command = [command];
    }
    
    for(var j=0;j<command.length;j++) {
        if(typeof command[j].name != "object") {
    		command[j].name = [command[j].name];
    	}
    	for(var i=0;i<command[j].name.length;i++){
    		if(this.__commands[command[j].name[i]]) {
    		    if(this.__enableRewrites){
    		        this.__warn("Command `"+command[j].name[i]+"` has been rewritten.");
    		    }else{
    		        this.__error("Command `"+command[j].name[i]+"` already registered.");
    			    continue;
    		    }
    		}
    		this.__commands[command[j].name[i]] = command[j];
    	}
    }
	   
	if(typeof cb === 'function') cb.call(this);
	
};
ConsoleIO.prototype.write = function(msg, args) {
	if(typeof msg === 'object') {
		this.__display.appendChild(msg);
		this.__display.innerHTML += "<br>";
		return document.getElementById(msg.id);
	}else{
		if(!args) args = {};
		msg='<span class="ConsoleIO-row" style="color:'+ (args.color?args.color:this.__colors.default) +';"><span class="ConsoleIO-cell">'+msg+'</span></span>';
		this.__display.innerHTML += msg;
	}
};
ConsoleIO.prototype.__error = function(msg) {
	this.write('Error: ' + msg, {color: this.__colors.error});
};
ConsoleIO.prototype.__warn = function(msg) {
    if(this.__enableWarnings)
	    this.write('Warn: ' + msg, {color: this.__colors.warn});
};


/* DEFAULT COMMANDS */

var Default_command_clear = new Object({
	name: 'clear',
	version: '1.0',
	exec: function(args, cb) {
		this.__display.innerHTML = "";
		if(typeof cb === 'function') cb();
	}
});

var Default_command_help = new Object({
	name: ['help','?'],
	version: '1.0',
	exec: function(args, cb) {
		this.write("");
		this.write('~~~~~~~{HELP}~~~~~~~');
		this.write("");
		for(var command in this.__commands)
			this.write("&nbsp;&nbsp;&nbsp;" + command + " (v"+ this.__commands[command].version +")");
		this.write("");
		if(typeof cb === 'function') cb();
	}
});