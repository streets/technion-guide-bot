const container = require('./main');

container.get('facebook');
container.startModule('server', { async: true });
