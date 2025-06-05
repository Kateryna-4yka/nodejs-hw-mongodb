import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name:
    {
      type: String,
      required: true
    },
    email:
    {
      type: String,
      required: true,
      unique: true
    },
    password:
    {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);

// видаляємо поле пасворд у моделі , щоб воно не приходило у відповідь при регестрації
usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
