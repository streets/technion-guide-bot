export function createIncomingMessages(data: Array<{ fbid: string, text: string }>): FbMessengerPlatform.InTextMessage {
  let messaging = data.map((item, idx) => {
    return {
      sender: {
        id: item.fbid
      },
      recipient: {
        id: 'pageId'
      },
      timestamp: Date.now(),
      message: {
        mid: String(idx),
        seq: idx,
        text: item.text
      }
    };
  });
  return {
    object: 'page',
    entry: [{
      id: 'pageId',
      time: Date.now(),
      messaging: messaging
    }]
  };
}
