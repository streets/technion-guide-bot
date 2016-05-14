const container = require('kontainer-di');
import * as nock from 'nock';
import BotModule from '../../src/modules/bot.module';
import FirebaseModule from '../../src/modules/firebase.module';

describe('Bot module', () => {
  var bot: BotModule;
  var db: FirebaseModule;
  var config = {
    WIT_TOKEN: `IamWitToken`
  };
  var FacebookMockModule = {
    sendText: jasmine.createSpy('fb-send-text-message').and.returnValue(Promise.resolve(true)),
    sendNavigation: jasmine.createSpy('fb-send-nav-message').and.returnValue(Promise.resolve(true))
  };

  beforeEach(() => {
    container.register('facebook', [], FacebookMockModule);
    db = new FirebaseModule();
    bot = new BotModule(config, db);
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

  it('should get a coordinates from the firebase', (done) => {
    let context: any = {
      query: 'amado'
    };
    nock('https://technion-map-db.firebaseio.com')
      .get('/.json')
      .reply(200, {
        amado: {
          name: 'Amado',
          coordinates: [1234, 9876]
        }
      });
    bot.search(1, context, () => {
      expect(context.url).toEqual('http: //www.google.com/maps?saddr=My+Location&daddr=1234,9876');
      done();
    });

  });

  it('should send a link with navigation', () => {
    bot.search(1, {}, () => { });
    expect(FacebookMockModule.sendText).toHaveBeenCalledWith(1, jasmine.any(String));
  });

});
