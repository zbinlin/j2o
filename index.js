var path = require("path");
var glob = require("glob");

function j2o(dir, cb) {
    var pattern = path.resolve(path.join(dir, "**/*.json"));
    glob(pattern, function (err, files) {
        if (err) return cb(err);
        var contexts = {};
        files.forEach(_(dir), contexts);
        "function" === typeof cb && cb(null, contexts);
    });
}

j2o.sync = function (dir) {
    var pattern = path.resolve(path.join(dir, "**/*.json"));
    var contexts = {};
    glob.sync(pattern).forEach(_(dir), contexts);
    return contexts;
};

function _(cwd) {
    return function (file) {
        var dir = path.dirname(file);
        var extname = path.extname(file);
        var basename = path.basename(file, extname);
        var key = path.join(
            path.relative(cwd, dir),
            basename
        );
        delete require.cache[require.resolve(file)];
        var res = require(file);
        if ("__name__" in res) {
            this[res["__name__"]] = res;
            delete res["__name__"];
        } else {
            this[key] = res;
        }
    }
}

module.exports = j2o;
