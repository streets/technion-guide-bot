export function createIncomingMessages(data: Array<{ fbid: number, text: string }>): FbMessengerPlatform.InTextMessage {
  let messaging = data.map((item, idx) => {
    return {
      sender: {
        id: item.fbid
      },
      recipient: {
        id: 999
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
      id: 999,
      time: Date.now(),
      messaging: messaging
    }]
  };
}
