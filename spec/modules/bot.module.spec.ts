const container = require('kontainer-di');
import BotModule from '../../src/modules/bot.module';

describe('Bot module', () => {
  var bot: BotModule;
  var config = {
    WIT_TOKEN: `IamWitToken`
  };
  var FacebookMockModule = {
    sendText: jasmine.createSpy('fb-send-text-message').and.returnValue(new Promise(() => { })),
    sendNavigation: jasmine.createSpy('fb-send-nav-message').and.returnValue(new Promise(() => { }))
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

  it('should extract building name and its number', () => {
    let context: any = {};
    let entities = {
      guide_building: [{ value: 'cooper' }],
      number: [{ value: '123' }]
    };

    bot.merge('session', context, entities, '', () => { });
    expect(context.query).toEqual('cooper');
    expect(context.room).toEqual('123');
  });

  it('should set url to the context', () => {
    let context: any = {};
    bot.search('session', context, () => { });
    expect(context.url).toContain('http: //www.google.com/maps?saddr=My+Location');
  });

  it('should send a link with navigation', () => {
    bot.search('session', {}, () => { });
    expect(FacebookMockModule.sendNavigation).toHaveBeenCalledWith('session', jasmine.any(String));
  });

});
