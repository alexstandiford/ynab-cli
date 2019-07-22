const Message = require( '../lib/Message' );

class Command{

	constructor( flags ){
		this.message = new Message( flags.volume );
	}

}

module.exports = Command;