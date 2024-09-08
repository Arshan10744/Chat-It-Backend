import { model, Schema, Types } from 'mongoose'

const message = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: 'User',
    },
    chat: {
      type: Types.ObjectId,
      ref: 'Chat',
    },

    content: {
      type: String,
    },

    attachments:[{
      publicid: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    }],
  },
  {
    timestamps: true,
  },
)

export const Message = model('message', message)
