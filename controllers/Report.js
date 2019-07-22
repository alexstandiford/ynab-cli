const Command = require( './Command' );
const YNAB = require( 'ynab' );
const helpers = require( '../helpers' );
const fs = require( 'fs' );

class Report extends Command{
	constructor( budgetName, flags ){
		super( flags );
		this.fetchCategories = this.fetchCategories.bind( this );
		this.fetchMonths = this.fetchMonths.bind( this );
		this.getCategoryTemplate = this.getCategoryTemplate.bind( this );
		this.getBudgetCategoryTemplate = this.getBudgetCategoryTemplate.bind( this );
		this.api = new YNAB.api( process.env.YNAB_ACCESS_KEY );
		this.categoryGroupsToSkip = flags.skip && flags.skip.length ? flags.skip.split( ',' ) : [];
		this.budgetName = budgetName;
		this.budget = false;
		this.month = false;
		this.headingDivider = "======================\n";
		this.subHeadingDivider = "-------------------------------\n";
		this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		this.categoryGroups = false;
		this.directory = flags.dir !== false ? flags.dir : process.env.REPORT_DIR;
		this.fileName = flags.name !== false ? flags.name : 'Report - ' + new Date().toDateString();
	}

	/**
	 * Fetches the budget from the constructor's budget name
	 * @returns {*}
	 */
	fetchBudget(){
		if( this.budget ) return this.budget;

		return this.api.budgets.getBudgets()
			.then( ( res ) => {
				const budget = res.data.budgets.filter( ( budget ) => budget.name === this.budgetName );
				this.budget = budget[0];
				return budget[0];
			} )
	}

	/**
	 * Fetches the categories of the specified budget
	 * @param budget - the budget object to get the categories from
	 * @returns {*}
	 */
	fetchCategories( budget ){
		if( this.categories ) return this.categories;

		return this.api.categories.getCategories( budget.id )
			.then( ( res ) => {
				const categoryGroups = res.data.category_groups.filter( ( categoryGroup ) => !this.categoryGroupsToSkip.includes( categoryGroup.name ) );
				this.categoryGroups = categoryGroups;
				return categoryGroups;
			} )
			.catch( ( err ) => this.message.error( 'Error in ERROR_NAME' + 'Error in ERROR_NAME' + err ) );
	}

	/**
	 * Gets all of the months from the API
	 * @param budget
	 * @returns {*}
	 */
	fetchMonths( budget ){
		if( this.month ) return this.month;

		return this.api.months.getBudgetMonth( budget.id, 'current' )
			.then( ( res ) => {
				this.month = res.data.month;

				return res.data.month;
			} )
			.catch( ( err ) => this.message.error( 'Error in fetchMonths' + err ) );
	}

	/**
	 * Generates the gategory template
	 * @param acc - accumulator to prepend
	 * @param category - Category item from the API
	 * @returns {string}
	 */
	getCategoryTemplate( acc, category ){
		let result = `${acc}${this.headingDivider}${category.name}\n`;
		result += `${this.headingDivider}\n`;
		result += `${category.categories.reduce( this.getBudgetCategoryTemplate, '' )}`;

		return result;
	}

	/**
	 * Generates the budget category template
	 * @param acc - accumulator to prepend
	 * @param budgetCategoryItem - category item from the API
	 * @returns {string}
	 */
	getBudgetCategoryTemplate( acc, budgetCategoryItem ){
		const goalMonth = new Date( budgetCategoryItem.goal_target_month ).getUTCMonth();
		let result = `${acc}${budgetCategoryItem.name}\n`;
		result += `${helpers.formatCurrency( budgetCategoryItem.balance )} of ${helpers.formatCurrency( budgetCategoryItem.goal_target )}\n`;
		if( budgetCategoryItem.goal_type === 'TBD' ) result += `Goal Month: ${this.months[goalMonth]}\n`;
		result += `${budgetCategoryItem.note ? budgetCategoryItem.note + '\n' : ''}`;
		result += `${this.subHeadingDivider}\n\n`;
		return result;
	}

	/**
	 * Generates the report text
	 * @returns {PromiseLike<string | never>}
	 */
	getReport(){
		return this.fetchBudget()
			.then( this.fetchCategories )
			.then( () => this.fetchMonths( this.budget ) )
			.then( () => {
				let report = `${this.headingDivider}Financial Figures for ${new Date().toDateString()}\n`;
				report += `Current Age of Money: ${this.month.age_of_money} days\n`;
				report += `${this.headingDivider}\n`;
				report += `${this.categoryGroups.reduce( this.getCategoryTemplate, '' )}`;
				return report;
			} )
			.catch( ( res ) => this.message.error( 'Error in getReport: ' + res.error.id + ', ' + res.error.detail ) );
	}

	async getSavingsBalance(){
		await this.fetchBudget();
		const months = await this.fetchMonths( this.budget );
		const currentMonth = new Date();
		return months.categories.reduce( ( acc, category ) => {
			if( category.goal_target_month && !category.hidden ){
				const goalDate = new Date( category.goal_target_month );
				const shouldGoToSavings = ( goalDate - currentMonth ) > 2592000000;
				const shouldGoToLongTerm = ( goalDate - currentMonth ) > 2592000000 * 2;
				if( typeof category.balance === "number" ){
					if( shouldGoToLongTerm ){
						acc.longTermBudget += category.balance / 1000;
					}else if( shouldGoToSavings ){
						acc.savingsBudget += category.balance / 1000;
					}
				}
			}
			return acc;
		}, { savingsBudget: 0, longTermBudget: 0 } );
	}

	/**
	 * Saves the report to the specified file
	 * @returns {PromiseLike<T | never> | Promise<T | never>}
	 */
	createReport(){
		const fileWithPath = `${this.directory}/${this.fileName}.txt`;
		helpers.makeDirectory( this.directory );

		return this.getReport()
			.then( ( report ) => {
				try{
					fs.writeFileSync( `${fileWithPath}`, report );
					return true;
				}catch( err ){
					this.message.error( 'Error in createReport' + err );
				}
			} );
	}
}

module.exports = Report;