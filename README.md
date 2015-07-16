#HTML String Parser

#Documentation

#Introduction

This simple library allows you to use stings to create new DOM elements. It is no designed to create an entire site like this one but instead to simplify the creation of dynamic elements

#How to use

To use it add the library to the page, and initiate a html object
```javascript
var html = new html();
```
You can then use the add method to create the element:

```javascript
html.add(html string, [child]) 
```
returns an Element

html string is a string which must start with a tagname, properties of the element are then added in the following way:

* &#35; identifies an id to apply
* . identifies an class to apply
* {string} the content within the brakets are set as the value or innerHTML of the object
* (string) the value within the brakets are set as the value or innerHTML of the object
* [attribute=value] Square brackets indicate an attribute and value.
* [child] is an optional which can be an Element or Array of elements to append or a function

#Example HTML string

```javascript
div#id.class-name[style=display:block]
```

returns Element:

```html
<div id="id" class="class-name" style="display:block"></div>
```


Check the demo for more.
