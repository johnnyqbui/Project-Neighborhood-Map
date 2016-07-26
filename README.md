# Project Neighborhood Map

This project's goal is to utilize the organizational JS library [Knockout](http://knockoutjs.com/) incorporating the MVVM pattern  to update the web page dynamically without refreshing the browser, in combination with Google Maps API, and a third party API, in this case Foursquare.

I've also utilized the following:
*   Package Manager: [Bower](https://bower.io/)
*   Build tool: [Gulp](http://gulpjs.com/)
## How to Run Project:
*   Click on link at the top or click this [link](https://johnnyqbui.github.io/Project-Neighborhood-Map/).

    or

* Clone files or download and unzip files:
    ```sh
    git clone https://github.com/johnnyqbui/Project-Neighborhood-Map.git
    ```

    After cloning or downloading:
    * Navigate to '/dist' folder
    * Open index.html in a browser

    **And that's it!**

#### Development
The development code can be found in the '/app' directory along with the raw/uncompressed files. Bower.JSON lists the dependencies and versions used in this project:
* Jquery: "3.1.0"
* Knockout: "3.4.0"

#### Production
The production code can be found in the '/dist' folder along with the minified/compressed files.

### Setting up Dev Environment:
* Install Gulp Dependencies:
    * Make sure [Node.JS](https://nodejs.org/en/) is installed
    * Make sure package.json is at root level, then run:

    ```sh
    npm install
    ```

#### Gulp plugins used:
* [gulp-rename](https://www.npmjs.com/package/gulp-rename)
* [gulp-html-replace](https://www.npmjs.com/package/gulp-html-replace)
* [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)
* [gulp-uglifycss](https://www.npmjs.com/package/gulp-uglifycss)
* [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

## Run project with most up-to-date version of JQuery and Knockout.JS:

1. Install Bower:

    Bower depends on [Node.JS](https://nodejs.org/en/), so make sure that's installed first. Then run the code below.
	```sh
	npm install -g bower
	```
2. Update Dependencies:

    Navigate to the 'app' directory where the bower.json file resides and run in your git command window:
	```sh
	bower install --force
	```
	This command forces updates into bower_components directory. Otherwise, you can keep the original version dependencies the project was created with.
