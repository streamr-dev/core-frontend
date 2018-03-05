var escape = require('escape-string-regexp');
var get    = require('./lib/get');

function findLinks(site, html, ext) {
    ext = escape(ext);
    var regexp = new RegExp('[^"]+' + ext + '"|[^\']+' + ext + '\'', 'g');
    var files  = html.match(regexp);
    if ( !files ) {
        throw new Error('Can\'t find CSS links at ' + site);
    }

    return files.map(function (path) {
        path = path.slice(0, -1);
        if ( /^https?:/.test(path) ) {
            return path;
        } else if ( /^\/\//.test(path) ) {
            return 'http:' + path;
        } else {
            return path.replace(/^\.?\.?\/?/, site);
        }
    });
}

function processLoaded(data, callback) {
    var processed = false;
    for ( var i = 0; i < data.length; i++ ) {
        var site = data[i];
        if ( typeof site === 'undefined' ) return;
        if ( typeof site[0] === 'undefined' ) return;

        for ( var j = 0; j < site.length; j++ ) {
            if ( site[j] ) {
                processed = true;

                var last = i === data.length - 1 && j === site.length - 1;
                callback(site[j][0], site[j][1], last);

                site[j] = false;
            } else if ( typeof site[j] !== 'undefined' ) {
                processed = true;
            } else if ( processed ) {
                return;
            }
        }
    }
}

module.exports = function (sites, ext, callback) {
    if ( !Array.isArray(sites) ) sites = [sites];

    var data = Array(sites.length);

    sites.forEach(function (site, i) {
        if ( site.slice(-ext.length) === ext ) {
            data[i] = Array(1);
            get(site, function (file, url) {
                data[i][0] = [file, url];
                processLoaded(data, callback);
            });
            return;
        }

        get(site, function (html) {
            var files = findLinks(site, html, ext);
            data[i] = Array(files.length);

            var last = 0;

            files.forEach(function (url) {
                get(url, function (file) {
                    data[i][last] = [file, url];
                    last += 1;
                    processLoaded(data, callback);
                });
            });
        });
    });
};
