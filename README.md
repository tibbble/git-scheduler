# Git Scheduler

A CLI interface for altering Git commit datetimes.
All implemented functionality exists natively in Git, but this package greatly simplifies the process.

## Features

- Execute git commits at a specified time
- Create sessions for stretching commits over a given time period (2 hours of code -> 1 day of work)

## Installation

To install, follow these steps:

1. Clone the repository
2. `npm install`
3. Run `npm run build` to build the project
4. Run `npm install -g .` to install the CLI globally. The CLI will then be available using the command `gsched`

If you would like to change the command name, you can do so by changing or adding an alias in the `bin` section of `package.json`.

Make sure to run `npm install -g .` again after making changes.

To remove the old command name, you can run `npm uninstall -g old-command-name`. You may also want to remove the alias in your /usr/local/bin directory.

## Usage

This section has not been written yet. Please check back later.

## FAQ

The CLI has help menus for each command. Run `gsched --help` for more information.