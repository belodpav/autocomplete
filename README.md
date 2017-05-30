# Autocomplete

A lightweight and easy to use JavaScript completion suggester

![](screenshot.gif)

## How to install

Add **autocomplete.js** and **autocomplete.css** files to your page(or **autocomplete.min.js** and **autocomplete.min.css**). You can change some of the styling in **autocomplete.css** to suit your needs.

## Usage

Create an **input** element with an **id** attribute:

```html
	<input id='input-country' type="text">
```

Initialize the autocomplete functionality on the input element using **Javascript**:

```javascript
	autoComplete({
		inputSelector : '#input-country',
		data: [
			'China',
			'Moroco',
			'USA',
			'Canada',
			'Thailand',
			'Russia',
			'Italy',
			'Germany',
			'Ukraine',
			'Turkey'
		]
	});
```
## Settings

| Property | Default | Description |
| :--- | :--- | :--- |
| inputSelector | blank string "" | Required a selector for text input field. |
| data | [] | An array with suggestions. |
| maxItemsBox | 5 | Max number of suggestions in visible part of suggestions box. |
| findSuggestions | function | A function what get on input current input value and give on output an array with suggestions.|
| itemRender | function | A function which returns html code for an item in suggestions box. The function that gives you control over how suggestions are displayed. |

## Change log

 - ### Version 1.0 beta – 2017/05/31
	
	* First release
		