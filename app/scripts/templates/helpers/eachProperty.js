var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('eachProperty', function (context, options) {
	var ret = '';
	var i = 0;
	for (var prop in context) {
		ret = ret + options.fn({property: prop, value: context[prop], first: i === 0, index: i++});
	}
	return ret;
});


Handlebars.registerHelper('packageLink', function (packageName) {
	var external = packageName.indexOf('/') === -1;
	var href = external ? 'http://npm.im/' + packageName : '/-/static/web/#packages/' + encodeURIComponent(packageName);
	return new Handlebars.SafeString(
		'<a href="' + href + '" ' + (external ? 'target="_blank"' : '') + '>' + packageName + '</a>'
	);
});
