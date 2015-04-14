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
Making your own polyfills isn't very difficult. You just have to code an alternative function and register it with Polyfill.

```javascript
var polyfill = function(argument) {
    doSomething(arguments);
    this.doAnotherThing();
}
var attach = function() {
    SomeClass.prototype.someMethod = polyfill;
}
var detach = function() {
    SomeClass.prototype.someMethod = undefined;
}

Polyfill.register("my-polyfill", polyfill, attach, detach);
```

Here, `my-polyfill` is the name of the polyfill, `polyfill` is the alternative function, `attach` is a function that attaches the polyfill to the right location and `detach` detaches the polyfill.  
Once more, you could use the short version:

```javascript
Polyfill("my-polyfill", polyfill, attach, detach);
```




## Setting up the server
When `Polyfill.start()` is called, a request to the server will be initiated, with a URL that looks like `polyfills.js?polyfill-1&polyfill-2`, where `polyfill-1` and `polyfill-2` are the names of the added polyfills. The server should then generate a file that includes these polyfills and send that back to the client.  
We have a node.js module that does this for you [here][polyfill-node].



## Concepts
When [Polyfill.start()] is called, Polyfill generates a `<script>` tag with the `src` attribute set to `polyfill.js?` followed by the names of the added polyfills (URL escaped), seperated by a `&` (for example: `polyfill.js?polyfill1&second-polyfill&myThirdPolyfill`). This script is then appended to the `<head>`.

So, when `Polyfill.start()` is called, a request to the server will be initiated, with a URL that equals the `src` of the script. The server can then extract the required polyfills, read them from disk (or cache) concatenate them and send the resulting filr to the client. This code, including some [Polyfill.register()] calls, will then be executed and the polyfills will thus be loaded.



## Contributing
All contributions (pull requests, bug reports, feature requests...) are very welcome!  
Would you just be so kind to use the right tags.


## API






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