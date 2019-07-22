const Report = require( '../controllers/Report' );

module.exports = ( program ) => {
	return program
		.command( 'savings-balance <budget>' )
		.version( '1.0.0' )
		.description( 'Calculates a recommended savings balance based on goals' )
		.action( async( budget, cmd ) => {
			const report = new Report( budget, cmd );
			const balance = await report.getSavingsBalance();
			const savingsAccountBalance = balance.savingsBudget;
			const longTermBalance = balance.longTermBudget;
			const total = savingsAccountBalance + longTermBalance;
			console.log( `Your savings account balance should be: $${savingsAccountBalance.toFixed( 2 )}` );
			console.log( `Your long term account balance should be: $${longTermBalance.toFixed( 2 )}` );
			console.log( `Your total balance is: $${total.toFixed( 2 )}` );
		} )
};