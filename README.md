ColdBox Dependency Management Presentation Files
================================================
Coldbox Connection - April 23, 2015
-----------------------------------

Previously Installed Dependencies:

- NodeJS: https://nodejs.org/download/
- CommandBox:  https://www.ortussolutions.com/products/commandbox

Step 1:
-------
Install Bower Globally

```
npm install -g bower
```

Recommended: Install Grunt Globally

```
npm install -g grunt
```

Step 2:
------

From the root of this project, create a new Coldbox Application:

```
box coldbox create app cbDepsPrezi && box install coldbox
```

Step 3:
------
Install NPM dependencies and Bower Dependencies

```
npm install
bower install
```

Step 4:
-------
Start Grunt and let it do its thing.  From this point on, every file changed in includes/sass/compile, includes/sass/include, and includes/javascript

```
grunt
```

Step 5:
-------
Due to the relative paths in the Font Awesome SCSS, we'll have to copy our font files to the includes/fonts directory

```
cp bower_components/font-awesome-sass/assets/fonts/* includes/fonts/
```

If you want to do it all in one command:
----------------------------------------

```
box coldbox create app cbDepsPrezi && box install coldbox && npm install && bower install && grunt
```

then open a new console window and enter:

```
box server start
```
