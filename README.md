ColdBox Dependency Management Presentation Files
================================================
Coldbox Connection - April 23, 2015
-----------------------------------

Previously Installed Dependencies:

NodeJS: https://nodejs.org/download/
CommandBox:  https://www.ortussolutions.com/products/commandbox


Step 1:
------

From the root of this project, create a new Coldbox Application:

```
box coldbox create app cbDepPrezi
```

Step 2:
------
Install NPM dependencies and Bower Dependencies

```
npm install
bower install
```

Step 3:
-------
Start Grunt and let it do its thing:

```
grunt
```

Step 4:
-------
Due to the relative paths in the Font Awesome SCSS, we'll have to copy our font files to the includes/fonts directory

```
cp bower_components/font-awesome-sass/assets/fonts/* includes/fonts/
```
