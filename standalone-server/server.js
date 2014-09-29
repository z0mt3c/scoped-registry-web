var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true });

var Hapi = require('hapi');
var _ = require('lodash');

var server = new Hapi.Server('localhost', process.env.PORT || 8000, {
    labels: ['web']
});

var masterDetailData = [
    {id: 1, title: 'Apple', devices: ['iPhone 5c', 'iPhone 5s']},
    {id: 2, title: 'Samsung', devices: ['Galaxy S3', 'Galaxy S4']},
    {id: 3, title: 'HTC', devices: ['One', 'One Mini', 'One Max']}
];

server.route({
    method: 'GET',
    path: '/api/packages',
    handler: function (request, reply) {
        reply(_.map(masterDetailData, function (e) {
            return {id: e.id, title: e.title, count: e.devices.length};
        }));
    }
});

server.route({
    method: 'GET',
    path: '/api/packages/{id}',
    handler: function (request, reply) {
        reply(masterDetailData[request.params.id - 1]);
    }
});

server.route({
    method: 'GET',
    path: '/api/hello/{name}',
    handler: function (request, reply) {
        reply({'hello': request.params.name});
    }
});

// require web plugin
server.pack.register({ plugin: require('../'), options: {
    development: process.env.NODE_ENV === 'development'
}}, function (err) {
    if (err) {
        logger.error('Error during web-plugin load', err);
    }
});

server.start(function () {
    logger.info('Server started at: ' + server.info.uri);
});
