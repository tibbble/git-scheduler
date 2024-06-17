# Git Scheduler

## Features

- Schedule Git commits for future dates and times with an easy-to-use CLI
- Create sessions for stretching commits over a given time period (30 minutes of code -> 1 day of work)

## Installation

To install, follow these steps:

1. Clone the repository
2. `npm install`
3. Run `npm run build` to build the project
4. Run `npm install -g .` to install the CLI globally. The CLI will then be available using the command `gsched`

## Usage

### `commit`

Example usage:

```bash
gsched commit -m "New commit message" -ff +2H
```

Create a commit with message "New commit message" with a datetime 2 hours in the future.
Please keep in mind that this command creates the commit. Take care as to not push commits that are still in the future.

### `config`

Example usage:

```bash
gsched config
```

See the current configuration settings.

```bash
gsched config -u workHourEnd 17
```

Set the work hour end configuration setting to 5 PM.

## FAQ

The CLI has help menus for each command. Run `gsched --help` for more information.