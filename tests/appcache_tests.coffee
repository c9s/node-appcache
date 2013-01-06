assert   = require "assert"

AppCache = require "../appcache.js"
assert.ok AppCache

appcache = new AppCache(".appcache")
assert.ok appcache

manifest = appcache.write()
assert.ok manifest

assert.ok manifest.match(/CACHE MANIFEST/)
assert.ok manifest.match(/Version/)

console.warn manifest

