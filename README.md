AppCache
=========

AppCache manifest generator for Node.js.

## Synopsis

```coffee
AppCache = require("appcache")
appcache = new AppCache(".appcache")
appcache.configure "production", () ->
    @cache([
    "/js/coffee-script.js"
    "/js/sha1.js"
    "/js/jquery.md5.js"
    "/js/console.js"
    "/js/jquery.cookie.js"
    "/js/wireroom.coffee"
    "/socket.io/socket.io.js"
    ])
    @cache("/css/wireroom.css")
    @cache("/umobi/compiled/umobi.min.css")
    @cache("/socket.io/socket.io.js")
    @network("*")
    @fallback("... ...")
```

Then in your routes (routes/index.coffee):

```coffee
exports.appcache = appcache.route()
```

