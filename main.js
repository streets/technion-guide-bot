"use strict";
const container = require('kontainer-di');
const facebook_config_1 = require('./config/facebook.config');
const wit_config_1 = require('./config/wit.config');
const server_config_1 = require('./config/server.config');
const sessions_module_1 = require('./modules/sessions.module');
const server_module_1 = require('./modules/server.module');
const facebook_module_1 = require('./modules/facebook.module');
const bot_module_1 = require('./modules/bot.module');
container.register('fbConfig', [], facebook_config_1.default);
container.register('witConfig', [], wit_config_1.default);
container.register('serverConfig', [], server_config_1.default);
container.register('sessions', [], sessions_module_1.default);
container.register('server', ['serverConfig'], server_module_1.default);
container.register('facebook', ['sessions', 'fbConfig', 'server', 'bot'], facebook_module_1.default);
container.register('bot', ['witConfig'], bot_module_1.default);
module.exports = container;
//# sourceMappingURL=main.js.map