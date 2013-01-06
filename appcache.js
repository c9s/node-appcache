// Generated by CoffeeScript 1.4.0
(function() {
  var AppCache, fs;

  fs = require("fs");

  AppCache = (function() {

    AppCache.prototype.meta = {};

    AppCache.prototype.cacheList = [];

    AppCache.prototype.networkList = [];

    AppCache.prototype.fallbackList = [];

    AppCache.prototype.configures = {};

    function AppCache(cacheFile, options) {
      this.cacheFile = cacheFile;
      this.options = options;
      if (fs.existsSync(this.cacheFile)) {
        this.meta = JSON.parse(fs.readFileSync(this.cacheFile, "utf8")); 
      } else {
        this.meta = {
          version: 0.01
        };
      }
      this.bump();
      console.log("AppCache Manifest Version: v" + this.meta.version);
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.meta), "utf8");
    }

    AppCache.prototype.bump = function() {
      return this.meta.version = (Math.ceil(parseFloat(this.meta.version) * 100) / 100) + 0.01;
    };

    AppCache.prototype.configure = function(mode, cb) {
      this.configures[mode] = cb;
      return this;
    };

    AppCache.prototype.version = function(version) {
      if (version) {
        this.meta.version = version;
        return this; 
      }
      return this.meta.version;
    };

    AppCache.prototype.network = function(line) {
      this.networkList.push(line);
      return this;
    };

    AppCache.prototype.cache = function(line) {
      var a, _i, _len;
      if (line instanceof Array) {
        for (_i = 0, _len = line.length; _i < _len; _i++) {
          a = line[_i];
          this.cacheList.push(a);
        } 
      } else {
        this.cacheList.push(line);
      }
      return this;
    };

    AppCache.prototype.fallback = function(line) {
      this.fallbackList.push(line);
      return this;
    };

    AppCache.prototype.clear = function() {
      this.fallbackList = this.networkList = this.cacheList = [];
      return this;
    };

    AppCache.prototype.write = function() {
      var mode, output, _ref, _ref1;
      mode = ((_ref = this.options) != null ? _ref.mode : void 0) || "development";
      if ((_ref1 = this.configures[mode]) != null)  
        _ref1.call(this);
      if (mode === "development" && !this.configures[mode] && !this.cacheList.length && !this.networkList.length) {
        output = "CACHE MANIFEST\n";
        output += "# Version " + this.meta.version + "\n";
        output += "NETWORK:\n";
        output += "*";
        return output; 
      } else {
        output = "CACHE MANIFEST\n";
        output += "# v" + this.meta.version + "\n";
        if (this.cacheList.length)  
          output += "CACHE:\n" + this.cacheList.join("\n");
        if (this.networkList.length)  
          output += "NETWORK:\n" + this.networkList.join("\n");
        if (this.fallbackList.length)  
          output += "FALLBACK:\n" + this.fallbackList.join("\n");
      }
      return output;
    };

    AppCache.prototype.route = function() {
      var self;
      self = this;
      return function(req, res) {
        res.writeHead(200, {
          "Content-Type": "text/plain; chartset=UTF-8"
        });
        res.write(self.write());
        return res.end();
      };
    };

    return AppCache;

  })();

  module.exports = AppCache;

}).call(this);
