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
    
    var set = function(parent, path, value) {
        var steps = path.split(".");
        var endPath = steps.pop();
        var basePath = steps.join(".");
        
        var parent = get(basePath);
        
        return typeof parent === "object" ? (parent[endPath] = value, true) : false;
    }
    
    var get = function(parent, path) {
        if(path === "") {
            return parent;
        }
        
        var steps = path.split(".");
        var len = steps.length;
        
        while(typeof parent === "object" && i < len) {
            parent = parent[steps[i]];
            i++;
        }
        
        return parent;
    }
    
    var copyArray = function(arr, start, end) {
        return Array.prototype.slice.call(arr, start, end);
    }
    
    
    
    var Attach = function() {
        this.__attach();
        Polyfill.emit("attach", [this]);
        
        return this;
    }
    
    var Detach = function() {
        this.__detach();
        Polyfill.emit("detach", [this]);
    }
    
    
    
    
    /*************
     * VARIABLES *
     *************/
    
    
    var features = [];
    var listeners = {};
    
    
    
    var Polyfill = function(name, func, attach, detach) {
        switch(arguments.length) {
            case 0:
                Polyfill.start();
                break;
            case 2:
                Polyfill.load(name, func);
                break;
            case 4:
                Polyfill.register(name, func, attach, detach);
                break;
        }
        
        return this;
    }
    
    
    Polyfill.autoStart = true;
    Polyfill.autoAttach = true;
    Polyfill.__features = features;
    Polyfill.__listeners = listeners;
    
    
    Polyfill.load = function(feature, test) {
        if(test) {
            this.add(feature);
        }
        
        return this;
    }
    
    
    Polyfill.remove = function(feature) {
        remove(features, feature);
        
        this.emit("remove", [feature]);
        
        return this;
    }
    
    
    Polyfill.add = function(feature) {
        add(features, feature);
        
        this.emit("add", [feature]);
        
        return this;
    }
    
    
    Polyfill.loaded = function(feature) {
        return contains(features, feature);
    }
    
    Polyfill.register = function(name, func, attach, detach) {
        set(this, name, func);
        func.__attach = attach;
        func.__detach = detach;
        func.attach = Attach;
        func.detach = Detach;
        
        this.emit("register", [name, func, attach, detach]);
        
        if(this.autoAttach) {
            func.attach();
        }
        
        return this;
    }
    
    Polyfill.attach = function(name) {
        var func = get(this, name);
        func.attach();
        
        return this;
    }
    
    Polyfill.detach = function(name) {
        var func = get(this, name);
        func.detach();
    }
    
    Polyfill.run = Polyfill.call = function(name, object) {
        var func = get(this, name);
        func.apply(object, copyArray(arguments, 2));
        
        return this;
    }
    
    
    
    Polyfill.start = function() {
        var url = "polyfill.js?" + map(features, encodeURIComponent).join("&");
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        document.getElementsByTagName("head")[0].appendChild(script);
        
        this.emit("load", [script]);
        
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