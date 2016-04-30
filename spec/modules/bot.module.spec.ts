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
    bot.run(1, 'hello', jasmine.any(Object), () => []);
    expect(bot.wit.runActions).toHaveBeenCalledWith(1, 'hello', jasmine.any(Object), jasmine.any(Function));
  });

  it('should send a message to facebook user', () => {
    bot.say(1, {}, 'hello world', jasmine.any(Function));
    expect(FacebookMockModule.sendText).toHaveBeenCalledWith(1, 'hello world');
  });

  it('should extract building name and its number', () => {
    let context: any = {};
    let entities = {
      guide_building: [{ value: 'cooper' }],
      number: [{ value: '123' }]
    };

    bot.merge(1, context, entities, '', () => { });
    expect(context.query).toEqual('cooper');
    expect(context.room).toEqual('123');
  });

  it('should set url to the context', () => {
    let context: any = {};
    bot.search(1, context, () => { });
    expect(context.url).toContain('http: //www.google.com/maps?saddr=My+Location');
  });

  it('should send a link with navigation', () => {
    bot.search(1, {}, () => { });
    expect(FacebookMockModule.sendText).toHaveBeenCalledWith(1, jasmine.any(String));
  });

});
