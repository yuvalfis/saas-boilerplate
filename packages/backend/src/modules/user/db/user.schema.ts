import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  clerkId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  profileImageUrl?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Organization' }], default: [] })
  organizationIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  currentOrganizationId?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User); 