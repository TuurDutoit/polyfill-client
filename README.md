Polyfill
========

Load your polyfills (or code) conditionally.

## Contents
* [Getting Started]
* [Setting up the server]
* [Concepts]
* [Contributing]
* [API]
* [License]


## Getting Started
### Downloading

First, you need to download Polyfill. You can find two versions in the root of this repo:

1. `polyfill.js`: the original source code, with comments (6.1 kB).
2. `polyfill.min.js`: the minified code, ready for production (2.3 kB, or 969 Bytes gzipped).

Then, include it in your HTML like this:

```html
<script type="text/javascript" src="polyfill.js"></script>
```

### Adding polyfills
Including a polyfill requires just one function call:

```javascript
Polyfill.add("my-polyfill");
```

Alternatively, you could use the short version:

```javascript
Polyfill("my-polyfill");
```


### Adding them conditionally
To include a polyfill conditionally (i.e. only when a condition is met), you can use the `load()` method, passing in a boolean as second argument:

```javascript
Polyfill.load("my-polyfill", ("someMethod" in someObject));
```

Again, you could use the short version:

```javascript
Polyfill("my-polyfill", ("someMethod" in someObject));
```


### Loading the polyfills
When you have added all your polyfills, you can download them. To prevent the browser making a lot of requests, all the polyfills are bundled in one file. The bundling is done on the server, so make sure you set up your server as explained in [Setting up the server]. Read the [Concepts] section for more detailed info.  
To download the polyfills, just do:

```javascript
Polyfill.start();
```


### Making your own
Making your own polyfills isn't very difficult. In fact, you can just write your polyfills exactly like you did before and make sure they are recognised by the server (this usually involves putting the files in a specific folder). Don't forget to give the file the right name!

But that's all there is to it. Just write it like before, give it a name and put it in the right place. Done.




## Setting up the server
When `Polyfill.start()` is called, a request to the server will be initiated, with a URL that looks like `polyfills.js?polyfill-1&polyfill-2`, where `polyfill-1` and `polyfill-2` are the names of the added polyfills. The server should then generate a file that includes these polyfills and send that back to the client. Normally, you should just concatenate the files in a specific directory named (in this case) `polyfill-1.js` and `polyfill-2.js`.  
We have a node.js module that does this for you [here][polyfill-node].



## Concepts
When [Polyfill.start()] is called, Polyfill generates a `<script>` tag with the `src` attribute set to `polyfill.js?` followed by the names of the added polyfills (URL escaped), seperated by a `&` (for example: `polyfill.js?polyfill1&second-polyfill&myThirdPolyfill`). This script is then appended to the `<head>`.

So, when `Polyfill.start()` is called, a request to the server will be initiated, with a URL that equals the `src` of the script. The server can then extract the required polyfills, read them from disk (or cache) concatenate them and send the resulting file to the client. This code will then be executed and the polyfills will thus be loaded.



## Contributing
All contributions (pull requests, bug reports, feature requests...) are very welcome!  
Would you just be so kind to use the right tags.


## API
### Polyfill
Polyfill is a function that acts as an alias for a few of its own properties (like [Polyfill.load()], [Polyfill.remove()]...). These different aliases and their usages are outlined below.

### Polyfill () - .
*Alias: [Polyfill.start()].*  
__*return:*__ *Polyfill*. For chaining.

Alias for [Polyfill.start()].


### Polyfill (string name) - .
*Alias: [Polyfill.add()].*  
__name:__ *string*. The name of the polyfill to add.  
__*return:*__ *Polyfill*. For chaining.

Alias for [Polyfill.add()].


### Polyfill (string name, bool test) - .
*Alias: [Polyfill.load()].*  
__name:__ *string*. The name of the polyfill to add.  
__test:__ *boolean*. A bool indicating whether to add the polyfill.  
__*return:*__ *Polyfill*. For chaining.

Alias for [Polyfill.load()].


### Polyfill.autoStart : *bool (true)*
A boolean indicating whether [Polyfill.start()] should be called automatically when the `load` event is fired on `window`, i.e. when `window.onload` is called.  
`true` by default.


### Polyfill.\_\_polyfills : *Array.\<string\>*
*Private*  
An array of names of the polyfills that should be downloaded. These are the names that end up in the `src` or the generated script tag (see [concepts]).


### Polyfill.\_\_listeners : *Object*
*Private*  
An object mapping event names to arrays of listeners. Because it's intended for private use, I won't elaborate.


### Polyfill.add (string name) - .
*Emits: [Polyfill@add]*  
__name:__ *string*. The name of the polyfill to add.  
__*return:*__ *Polyfill*. For chaining.

Adds a polyfill to [Polyfill.__polyfills] as to make sure it is included in the download when [Polyfill.start()] is called.

```javascript
Polyfill.add("my-polyfill");
// my-polyfill will now be downloaded when Polyfill.start is called
```


### Polyfill.remove (string name) - .
*Emits: [Polyfill@remove]*  
__name:__ *string*. The name of the polyfill to remove.  
__*return:*__ *Polyfill*. For chaining.

Opposite of [Polyfill.add()], i.e. removes a polyfill from [Polyfill.__polyfills], as to not download it anymore.


### Polyfill.load (string name, bool test) - .
__name:__ *string*. The name of the polyfill to load.  
__test:__ *boolean*. A bool indicating whether or not to add the polyfill.  
__*return:*__ *Polyfill*. For chaining.

Calls [Polyfill.add()] for the specified polyfill if `test` is truthy (you can actually pass anything for `test`, but it will be checked for thruthiness).


### Polyfill.added (string name) - *bool*
*Alias: `Polyfill.loaded()`*  
__name:__ *string*. The name of the polyfill to check.  
__*return:*__ *boolean*. A bool indicating whether or not the polyfill has been added.

Checks if the polyfill has already been added, i.e. if `name` exists in [Polyfill.__polyfills].


### Polyfill.start () - .
*Emits: [Polyfill@load]*  
__*return:*__ *Polyfill*. For chaining.

This is where the actual magic is happening: in this method, the script tag is created, with the right `src` and appended to the head of the document, as explained in [Concepts].  
Emits [Polyfill@load] when finished, and thus when the script and its polyfills have loaded.


### Polyfill.on (string event, Listener listener) - .
__event:__ *string*. The name of the event to attach the listener to.  
__listener:__ *Listener*. The listener to attach to the specified event.  
__*return:*__ *Polyfill*. For chaining.

Attaches `listener` to the `event` event, i.e. when `event` is emitted, `listener` is called.  
Polyfill emits a few events (`add`, `remove` and `load`), which can help you react to certain actions.  
`listener` is a normal function, but check [Listener] for more info about its context.


### Polyfill.off (string event, Listener listener) - .
__event:__ *string*. The name of the event from which to detach `listener`.  
__listener:__ *Listener*. The listener to detach from the specified event.  
__*return:*__ *Polyfill*. For chaining.

Does the opposite of [Polyfill.on()], i.e. detaches a listener from the specified event, so it doesn't get called anymore when `event` is emitted.


### Polyfill.emit (string event, any[] arguments) - .
__event:__ *string*. The event that should be fired.  
__arguments:__ *Array.\<any\>*. Arguments to pass to the listeners.  
__*return:*__ *Polyfill*. For chaining.

Emits the `event` event, i.e. executes the listeners attached to the event (in the order they were added).


### Polyfill@add (string polyfill)
__polyfill:__ *string*. The name of the polyfill that has been added.

Emitted when a polyfill has been added to [Polyfill.__polyfills] using [Polyfill.add()].


### Polyfill@remove (string polyfill)
__polyfill:__ *string*. The name of the polyfill that has been removed.

Emitted when a polyfill has been removed from [Polyfill.__polyfills] using [Polyfill.remove()].


### Polyfill@load (Element script)
__script:__ *Element*. The script element that was generated.

Emitted when the the script has been generated and added, and the polyfills are thus loaded.


### Listener : function
A Listener is a function that can be attached to an event.

They are regular functions, but when called, their context (i.e. `this`) is set to `Polyfill` and they are passed the array arguments passed to [Polyfill.emit()].










## License
The MIT License (MIT)

Copyright (c) 2015 Tuur Dutoit <me@tuurdutoit.be>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.











[Getting Started]: #getting-started
[Setting up the server]: #setting-up-the-server
[Concepts]: #concepts
[Contributing]: #contributing
[API]: #api
[License]: #license