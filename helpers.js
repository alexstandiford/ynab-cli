const fs = require( "fs" );
const shell = require( 'shelljs' );

/**
 * Checks to see if the destination dir exists, and creates it if it doesn't exist
 */
function makeDirectory( directory, destination ){
	if( !fs.existsSync( destination ) ){
		shell.mkdir( '-p', directory )
	}
}

function formatCurrency( item, format = 'string' ){
	let money = item / 1000;
	if( format === 'string' ){
		money = `$${money}`;
	}
	return money;
}

module.exports = { makeDirectory, formatCurrency };