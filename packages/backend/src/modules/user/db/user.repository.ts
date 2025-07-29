import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: any): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).populate('organizationIds').populate('currentOrganizationId').exec();
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.userModel.findOne({ clerkId }).populate('organizationIds').populate('currentOrganizationId').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('organizationIds').populate('currentOrganizationId').exec();
  }

  async update(id: string, updateData: any): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).populate('organizationIds').populate('currentOrganizationId').exec();
  }

  async updateByClerkId(clerkId: string, updateData: any): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ clerkId }, updateData, { new: true }).populate('organizationIds').populate('currentOrganizationId').exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async addToOrganization(userId: string, organizationId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { organizationIds: new Types.ObjectId(organizationId) },
        $setOnInsert: { currentOrganizationId: new Types.ObjectId(organizationId) }
      },
      { new: true, upsert: false }
    ).populate('organizationIds').populate('currentOrganizationId').exec();
  }

  async removeFromOrganization(userId: string, organizationId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    const updateQuery: any = {
      $pull: { organizationIds: new Types.ObjectId(organizationId) }
    };

    // If the removed organization was the current one, clear it
    if (user.currentOrganizationId?.toString() === organizationId) {
      updateQuery.$unset = { currentOrganizationId: 1 };
    }

    return this.userModel.findByIdAndUpdate(userId, updateQuery, { new: true }).populate('organizationIds').populate('currentOrganizationId').exec();
  }

  async setCurrentOrganization(userId: string, organizationId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { currentOrganizationId: new Types.ObjectId(organizationId) },
      { new: true }
    ).populate('organizationIds').populate('currentOrganizationId').exec();
  }
} 