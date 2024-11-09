import mongoose, { Schema, Document } from 'mongoose';
// import { Event } from 'react-big-calendar';
import { CustomEvent } from '@/interface';

const EventSchema: Schema<CustomEvent> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  }
});

export interface User extends Document {
  username: string;
  events: CustomEvent[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  events: [EventSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;