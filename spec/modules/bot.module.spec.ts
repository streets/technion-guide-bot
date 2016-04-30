import sessions from '../../src/modules/sessions.module';
import BotModule from '../../src/modules/bot.module';

describe('Bot module', () => {
  var bot: BotModule;
  var config = {
    WIT_TOKEN: `IamWitToken`
  };

  beforeEach(() => {
    bot = new BotModule(sessions, config);
  });

  it('should call runActions of wit', () => {
    spyOn(bot.wit, 'runActions');
    bot.run('testSessionId', 'hello', jasmine.any(Object), () => []);
    expect(bot.wit.runActions).toHaveBeenCalledWith('testSessionId', 'hello', jasmine.any(Object), jasmine.any(Function));
  });

});