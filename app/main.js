"use strict";
const container = require('kontainer-di');
const facebook_config_1 = require('./config/facebook.config');
const server_config_1 = require('./config/server.config');
const server_module_1 = require('./modules/server.module');
const facebook_module_1 = require('./modules/facebook.module');
const bot_module_1 = require('./modules/bot.module');
container.register('fbConfig', [], facebook_config_1.default);
container.register('serverConfig', [], server_config_1.default);
container.register('server', ['serverConfig'], server_module_1.default);
container.register('facebook', ['fbConfig', 'server', 'bot'], facebook_module_1.default);
container.register('bot', [], bot_module_1.default);
module.exports = container;
//# sourceMappingURL=main.js.map