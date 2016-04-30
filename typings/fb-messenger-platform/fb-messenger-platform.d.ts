declare namespace FbMessengerPlatform {

  type UserId = number;
  type PageId = number;

  type Sender = {
    id: UserId | PageId
  };

  type Recipient = {
    id: UserId | PageId
    phone_number?: number
  };
  
  type AttachmentType = "template" | "image";
  
  type TemplateType = "generic" | "button" | "receipt"; 
  
  type ButtonType = "web_url" | "postback";
  
  type NotificationType = "REGULAR" | "SILENT_PUSH" | "NO_PUSH";
  
  type InTextMessageBody = {
    sender: Sender
    recipient: Recipient
    timestamp: number
    message: {
      mid: string
      seq: number
      text: string
    }
  };

  type InTextMessageEntry = {
    id: number
    time: number
    messaging: Array<InTextMessageBody>
  };
  
  type OutGenericElementBody = {
    title: string
    subtitle?: string
    image_url?: string
    item_url?: string
    buttons?: Array<OutButtonBody>
  };
  
  type OutReceiptElementBody = {
    title: string
    subtitle?: string
    image_url?: string
    quantity?: number
    price?: number
    currency?: string
  };

  type OutButtonBody = {
    type: ButtonType
    title: string
    url?: string
    payload?: string
  };

  export type InTextMessage = {
    object: string
    entry: Array<InTextMessageEntry>
  };

  export type OutTextMessage = {
    recipient: Recipient
    message: {
      text: string
    }
    notification_type?: NotificationType
  };

  export type OutButtonsMessage = {
    recipient: Recipient
    text?: string
    message: {
      attachment: {
        type: AttachmentType
        payload: {
          template_type: "button"
          text: string
          buttons: Array<OutButtonBody>
        }
      }
    }
    notification_type?: NotificationType
  };
  
  export type OutGenericMessage = {
    recipient: Recipient
    text?: string
    message: {
      attachment: {
        type: AttachmentType
        payload: {
          template_type: "generic"
          elements: Array<OutGenericElementBody>
        }
      }
    }
    notification_type?: NotificationType
  };
  
  export type OutReceiptMessage = {
    recipient: Recipient
    text?: string
    message: {
      attachment: {
        type: AttachmentType
        payload: {
          template_type: "receipt"
          recipient_name: string
          order_number: string
          currency: string
          payment_method: string
          timestamp?: string
          order_url?: string
          elements: Array<OutReceiptElementBody>,
          address?: {
            street_1: string
            street_2?: string
            city: string
            postal_code: string
            state: string
            country: string
          },
          summary: {
            subtotal?: number
            shipping_cost?: number
            total_tax?: number
            total_cost: number
          },
          adjustments: Array<{
            name?: string
            amount?: number
          }>
        }
      }
    }
    notification_type?: NotificationType
  };
}