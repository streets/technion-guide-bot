const container = require('kontainer-di');
import BotModule from '../../src/modules/bot.module';

describe('Bot module', () => {
  var bot: BotModule;
  var config = {
    WIT_TOKEN: `IamWitToken`
  };
  var FacebookMockModule = {
    sendText: jasmine.createSpy('fb-send-text-message').and.returnValue(new Promise(() => { }))
  };

  beforeEach(() => {
    container.register('facebook', [], FacebookMockModule);
    bot = new BotModule(config);
  });

  afterEach(() => {
    container.reset();
  });

  it('should call runActions of wit', () => {
    spyOn(bot.wit, 'runActions');
    bot.run('testSessionId', 'hello', jasmine.any(Object), () => []);
    expect(bot.wit.runActions).toHaveBeenCalledWith('testSessionId', 'hello', jasmine.any(Object), jasmine.any(Function));
  });

  it('should send a message to facebook user', () => {
    bot.say('session', {}, 'hello world', jasmine.any(Function));
    expect(FacebookMockModule.sendText).toHaveBeenCalledWith('session', 'hello world');
  });

});
