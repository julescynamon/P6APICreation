# HOT TAKES #

## Installation ##

Here are the dependancies you need to install:
- NodeJS 16.13.1
- Angular CLI 13.2.2.
- node-sass : make sure to use the corresponding version to NodeJS. For Node 16.0 for instance, you need node-sass in version 6.0.

On Windows, these installations require to use PowerShell in administrator mode.

Then, clone this repo, `run npm install`, and `run npm install --save-dev run-script-os`.


## Usage ##

Run `npm start`. This should both run the local server and launch your browser.

If your browser fails to launch, or shows a 404 error, navigate your browser to http://localhost:5500.

The app should reload automatically when you make a change to a file.

Use `Ctrl+C` in the terminal to stop the local server.

Pour utiliser l'application créer un dossier images dans le backend.

## ENVIRONMENTAL VARIABLES ##

The file .env provides these environmental variables :

- KEY_EMAIL_SECRET: "a random number and letter"
- SECRET_MONGOOSE: "yours secret keys of mongoose"
- SECRET_TOKEN: "a random number and letter"
