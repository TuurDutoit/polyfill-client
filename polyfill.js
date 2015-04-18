(function(root, factory) {
    "use strict";
    
    if(typeof define === "function" && define.amd) {
        define(factory);
    }
    else if(typeof exports === "object") {
        module.exports = factory();
    }
    else {
        root.Polyfill = factory();
    }
    
}(this, function() {
    "use strict";
    
    
    
    /*****************
     * OWN POLYFILLS *
     *****************/
    
    var indexOf = function(arr, item) {
        if("indexOf" in arr) {
            return arr.indexOf(item);
        }
        else {
            for(var i = 0, len = arr.length; i < len; i++) {
                if(arr[i] === item) {
                    return i;
                }
            }
            
            return -1;
        }
    }
    
    var contains = function(arr, item) {
        return indexOf(arr, item) > -1;
    }
    
    var add = function(arr, item) {
        if(!contains(arr, item)) {
            arr.push(item);
        }
    }
    
    var remove = function(arr, item) {
        var index = indexOf(arr, item);
        if(index > -1) {
            arr.splice(index, 1);
        }
    }
    
    var map = function(arr, func) {
        var res = [];
        
        for(var i = 0, len = arr.length; i < len; i++) {
            res[i] = func(arr[i]);
        }
        
        return res;
    }
    
    var sort = function(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }
    
    
    
    
    
    
    /*************
     * VARIABLES *
     *************/
    
    
    var polyfills = [];
    var listeners = {};
    
    
    
    var Polyfill = function(name, test) {
        switch(arguments.length) {
            case 0:
                Polyfill.start();
                break;
            case 1:
                Polyfill.add(name);
                break;
            case 2:
                Polyfill.load(name, test);
                break;
        }
        
        return this;
    }
    
    
    Polyfill.autoStart = true;
    Polyfill.__polyfills = polyfills;
    Polyfill.__listeners = listeners;


    Polyfill.add = function(polyfill) {
        add(polyfills, polyfill);
        
        this.emit("add", [polyfill]);
        
        return this;
    }

    
    Polyfill.remove = function(polyfill) {
        remove(polyfills, polyfill);
        
        this.emit("remove", [polyfill]);
        
        return this;
    }

    
    Polyfill.load = function(polyfill, test) {
        if(test) {
            this.add(polyfill);
        }
        
        return this;
    }
    
    
    Polyfill.loaded = function(polyfill) {
        return contains(polyfills, polyfill);
    }
    
    
    Polyfill.start = function() {
        if(polyfills.length) {
            var url = "polyfills.js?" + map(polyfills.sort(sort), encodeURIComponent).join("&");
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
            document.getElementsByTagName("head")[0].appendChild(script);

            this.emit("load", [script]);
        }
        
        return this;
    }
    
    
    Polyfill.on = function(event, listener) {
        if(!listeners[event]) {
            listeners[event] = [];
        }
        
        add(listeners[event], listener);
        
        return this;
    }
    
    Polyfill.off = function(event, listener) {
        if(listeners[event]) {
            remove(listeners[event], listener);
        }
        
        return this;
    }
    
    Polyfill.emit = function(event, args) {
        var args = args || [];
        var l = listeners[event];
        
        if(l) {
            for(var i = 0, len = l.length; i < len; i++) {
                l[i].apply(this, args);
            }
        }
        
        return this;
    }
    
    
    
    
    
    if(typeof window.onload === "function") {
        var oldOnload = window.onload;
    }
    
    window.onload = function(e) {
        if(Polyfill.autoStart) {
            Polyfill.start();
        }
        
        if(oldOnload) {
            oldOnload(e);
        }
    }
    
    
    
    
    
    
    
    return Polyfill;
    
    
}));
