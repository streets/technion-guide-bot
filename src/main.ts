const container = require('kontainer-di');
import fbConfig from './config/facebook.config';
import witConfig from './config/wit.config';
import serverConfig from './config/server.config';

import sessions from './modules/sessions.module';

import serverModuleFactory from './modules/server.module';
import facebookModuleFactory from './modules/facebook.module';
import botModuleFactory from './modules/bot.module';

container.register('fbConfig', [], fbConfig);
container.register('witConfig', [], witConfig);
container.register('serverConfig', [], serverConfig);

container.register('sessions', [], sessions);

container.register('server', ['serverConfig'], serverModuleFactory);
container.register('facebook', ['sessions', 'fbConfig', 'server', 'bot'], facebookModuleFactory);
container.register('bot', ['sessions', 'witConfig'], botModuleFactory);

module.exports = container;
