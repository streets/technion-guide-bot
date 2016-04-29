const container = require('kontainer-di');
import fbConfig from './config/facebook.config';
import serverConfig from './config/server.config';

import serverModuleFactory from './modules/server.module';
import facebookModuleFactory from './modules/facebook.module';
import botModuleFactory from './modules/bot.module';

container.register('fbConfig', [], fbConfig);
container.register('serverConfig', [], serverConfig);

container.register('server', ['serverConfig'], serverModuleFactory);

container.register('facebook', ['fbConfig', 'server', 'bot'], facebookModuleFactory);

container.register('bot', [], botModuleFactory);

module.exports = container;
