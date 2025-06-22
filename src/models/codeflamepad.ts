import mongoose, { Schema, Document } from "mongoose";

interface FileType {
  name: string;
  data: string;
}

export interface UserType extends Document {
  username: string;
  password: string;
  files: FileType[];
}

const FileSchema = new Schema<FileType>({
  name: { type: String, default: "Untitled" },
  data: { type: String, required: true }
});

const UserSchema = new Schema<UserType>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  files: [FileSchema]
});

const UserModel = mongoose.models.codeflamepads || mongoose.model<UserType>("codeflamepads", UserSchema);
export default UserModel;
