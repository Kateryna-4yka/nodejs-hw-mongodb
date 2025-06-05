import { model, Schema } from 'mongoose';

const sessionsSchema = new Schema(
  {
    userId:
    {
// беремо з монгус схеми тим обджект айді, і таким чином зможемо достукатися до _id на сервері
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    accessToken:
    {
      type: String,
      required: true
    },
    refreshToken:
    {
      type: String,
      required: true
    },
    accessTokenValidUntil:
    {
      type: Date,
      required: true
    },
    refreshTokenValidUntil:
    {
      type: Date,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);

export const SessionsCollection = model('sessions', sessionsSchema);
