# ynab-cli
Personal YNAB Toolkit

## Installation

To install, follow these steps:

1. Clone this repository

`git clone git@github.com:alexstandiford/ynab-cli.git`

2. Enter the directory, and install NPM packages

`cd ynab-cli && npm i`

3. Link the NPM package so you can run the commands in bash

`npm link`

4. Create a [YNAB access token](https://app.youneedabudget.com/settings/developer), and copy it to your clipboard.
4. Create a `.env` file in the root of the directory, and add your YNAB key to the file.
4. add two paramaters to your `.env` file, `YNAB_ACCESS_KEY` and `REPORT_DIR`. like this:
```
YNAB_ACCESS_KEY=add your key here
REPORT_DIR=add a directory to save your reports here
CATEGORIES_TO_SKIP=comma,separated,list,of,categories,to,exclude,from,your,reports
```

example:

```
YNAB_ACCESS_KEY=48391432fhds893243243214321894fu84fq39f43fjids09032
REPORT_DIR=/Users/alexstandiford/Documents/financial-reports
CATEGORIES_TO_SKIP=Someday Maybe,Hidden Categories,Internal Master Category,Credit Card Payments,Monthly Bills,Online Subscriptions,Income,Other
```

## Usage

### Generate a report

`ynab generate-report <budget name> --name --dir --skip`

Generates a plain text snapshot of the specified budget. I personally use this to send my wife a weekly snapshot
of the status of our finances. This allows her to see what's going on without needing to learn how to navigate the app.
It also serves as a nice way to review what the finances were before I made changes later.

1. *Budget Name*: The name of the budget to generate a report with.
1. *name*: Overwrites file name
1. *dir*: Overwrites file name and location to save this file
1. *skip*: Comma separated list of categories to skip. You can also use "Hidden Categories" to auto-hide hidden categories.

### Determine Suggested Short-Term and Long Term Savings Balances

`ynab savings-balance <budget name>`

Calculates the suggested amount of money to help maximize potential earnings for money that is being saved for later use.
This works based on the goal date of each item in your budget. I run this at the beginning of each month after balancing
my budget to move money around as-needed.

* If the budget's goal won't be completed in **more** than 2 months, it will add it to the _long-term savings_ total.
* If the budget's goal will be completed sooner than that, it will add it to the _short-term savings_ goal.

The idea here is that if you don't need the money for more than 2 months, you can probably that cash into something that
takes a little longer to get back out, but has a higher interest rate than your savings account.
Such as Betterment's Smart Saver account are great for this.

The rest of the money should go into your savings account so you can get it quickly.