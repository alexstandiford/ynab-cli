#!/usr/bin/env node

require( 'dotenv' ).config( {
	path: `${__dirname}/.env`
} );
const program = require( 'commander' );

let commands = [];

//Push Commands into the array here
commands.push( require( './commands/generatereport' ) );
commands.push( require( './commands/savingsbalance' ) );

/**
 * Fire up Commander
 **/
program
	.version( '0.1.0' )
	.description( 'Suite of automatons for YNAB' );

/**
 * Register all commands in the commands array, and add default values to commands
 */
commands.forEach( command => {
	let currentCommand = command( program );

	//Hook in default global command flags
	currentCommand.option( '-v, --volume <integer>', 'Specify how many messages you want to see. 0 for silent, 3 for loud', 3 );
} );

program.parse( process.argv );