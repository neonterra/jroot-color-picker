# Jroot Color Picker

## Introduction

Its a jquery base plugin to pick colors list, you can pick more the 100+ color pallets from the list on the go.


## Installation

Download or clone the project and integrate the following files
```sh
<link href="assets/plugins/jroot-color-picker/color.css" rel="stylesheet">
<script src="assets/plugins/jroot-color-picker/color.js"></script>
```
Note: Jquery core and Jquery UI is required please use include them before this plugin.

[Download Jquery from here](https://code.jquery.com/)


## Code Samples


    $(selector).colorpicker({
		zIndex: false ,
		position: 'middle-right',
		change: function (e, color){
			console.log(color);
		},
		over: function (e, color){
			console.log(color);
		},
		pick: function (e, color){
			console.log(color);
		}
	});

