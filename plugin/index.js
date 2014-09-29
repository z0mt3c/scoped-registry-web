var path = require('path');

exports.register = function (plugin, options, next) {
    var paths = [];

    var mainPath = path.join(__dirname, options.development ? '../app' : '../dist');
    paths.push(mainPath);

    if (options.development) {
        paths.push(path.join(__dirname, '../.tmp'));
    }

    plugin.route({
        method: 'GET',
        path: '/{path*}',
        config: {
            tags: ['web'],
            handler: {
                directory: {
                    path: paths,
                    index: true
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
