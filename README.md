# ConsoleIO
###A fully programmable console written in javascript.

----

###How to implement ConsoleIO:

####1. Initialize the console:
 > ```javascript
 > var Console = new ConsoleIO({...});
 > ```
 > ####ConsoleIO options:

 >  - container [String] = This is the container's id in which you want the console to show up
 >  - enable_warnings [Boolean] = This option enables warnings to be displayed
 >  - enable_rewrites [Boolean] = This option enables the rewrite of the functions , like the default ones (help and clear)
 >  - enable_reverse_display [Boolean] = This makes the command box to be shown at the bottom of the container

####2. Write a function:
#####Right now the console it's up and running but it doesn't know to do anything.
 > ```javascript
 > var Command_hello = new Object({
 > 	name: 'hello',
 > 	version: '1.0',
 > 	exec: function(args, next) {
 > 		this.write("Hello stranger, nice to meet you.");
 >		next();
 >	}
 >});
 >```

 > This is a basic function that writes a block of text on the display. It has a name , a version and an exec parameter.
 
 > The *exec* parameter is the code that is going to be runned when we execute the command in the console. It has 2 parameters (args and next).
 
 > > The *args* parameter is an array that contains the argumets thar are passed along with the command.
 > > For example if you write the following command:
 > > >```
 > > >test arg1 arg2
 > > >```
 
 > > the args parameter will contain 2 values , 'arg1' and 'arg2'. 
 
 > > The *next* argument is a function that has to be executed at the end of the command's execution.
 
####3. Register the command:

 > In order for the console to now about your newly command you have to register it.
 > You can do this by adding the following line of code:
 > > ```javascript
 > > Console.registerCommand(Command_hello);
 > > ```
 
 > After adding this last line of code the command is ready to be executed.
 
###Tips:
 1. If you want to make a function that can be executed in the console by multiple commands (like *help* and *?* ; they do the same thing but code is only written once) you can make the name of the command to be and an array like so: ["help", "?"]
  
  > ```javascript
  > var Default_command_help = new Object({
  >    	name: ['help','?'],
  >    	version: '1.0',
  >    	exec: function(args, next) {
  >    		...
  >  		next();
  >  	}
  >  });
  > ```

 2. You can register multiple commands by passing an array to the .registerCommand() function.
  
  > ```javascript
  > Console.registerCommand([Command_function_1,Command_function_2,Command_function_3]);
  > ```

