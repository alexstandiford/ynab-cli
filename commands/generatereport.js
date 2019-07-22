const Report = require( '../controllers/Report' );

module.exports = ( program ) => {
	return program
		.command( 'generate-report <budget>' )
		.version( '1.0.0' )
		.option( '--name <string>', 'Overwrites file name', false )
		.option( '--dir <string>', 'Overwrites file name and location to save this file', false )
		.option( '--skip <string>', 'Comma separated list of categories to skip.', "Someday Maybe,Hidden Categories,Internal Master Category,Credit Card Payments,Monthly Bills,Online Subscriptions,Income,Other" )
		.description( 'generates a plain text report to send' )
		.action( ( budget, cmd ) => {
			const report = new Report( budget, cmd );
			report.createReport()
				.then( ( success ) => {
					if( success === true ){
						report.message.success( `Created a new report file at: ` );
						report.message.send( 'green', `"${report.directory}/${report.fileName}"` )
					}
				} );
		} )
};