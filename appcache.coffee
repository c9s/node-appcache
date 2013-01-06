
fs = require("fs")

class AppCache
  meta: { }
  cacheList: []
  networkList: []
  fallbackList: []

  configures: {}

  constructor: (@cacheFile, @options) ->
    # @cacheFile = ".appcache"
    if fs.existsSync(@cacheFile)
      @meta = JSON.parse(fs.readFileSync(@cacheFile,"utf8"))
    else
      @meta = { version: 0.01 }
    @bump()

    console.log "AppCache Manifest Version: v#{ @meta.version }"

    fs.writeFileSync(@cacheFile, JSON.stringify(@meta),"utf8")

  bump: () -> @meta.version = (Math.ceil(parseFloat(@meta.version) * 100) / 100) + 0.01

  configure: (mode,cb) ->
    @configures[ mode ] = cb
    this

  # when restarting version, we should bump the version
  version: (version) ->
    if version
      @meta.version = version
      return this
    return @meta.version

  network: (line) ->
    @networkList.push line
    this

  cache: (line) ->
    if line instanceof Array
      for a in line
        @cacheList.push a
    else
      @cacheList.push line
    this

  fallback: (line) ->
    @fallbackList.push line
    this

  clear: () ->
    @fallbackList = @networkList = @cacheList = []
    this

  write: ->
    mode = @options?.mode or "development"
    @configures[ mode ]?.call(this)

    if mode is "development" and not @configures[ mode ] \
      and not @cacheList.length \
      and not @networkList.length
        output = "CACHE MANIFEST\n"
        output += "# Version #{ @meta.version }\n"
        output += "NETWORK:\n"
        output += "*"
        return output
    else
      output = "CACHE MANIFEST\n"
      output += "# v#{ @meta.version }\n"
      output += "CACHE:\n" + @cacheList.join("\n") if @cacheList.length
      output += "NETWORK:\n" + @networkList.join("\n") if @networkList.length
      output += "FALLBACK:\n" + @fallbackList.join("\n") if @fallbackList.length
    return output

  route: ->
    self = this
    return (req,res) ->
      res.writeHead(200, {
        "Content-Type": "text/plain; chartset=UTF-8"
      })
      res.write(self.write())
      res.end()


module.exports = AppCache
