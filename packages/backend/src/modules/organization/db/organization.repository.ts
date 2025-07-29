import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization, OrganizationDocument } from './organization.schema';

@Injectable()
export class OrganizationRepository {
  constructor(@InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>) {}

  async create(organizationData: any): Promise<Organization> {
    const createdOrganization = new this.organizationModel(organizationData);
    return createdOrganization.save();
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizationModel.findById(id).populate('memberIds').populate('adminIds').exec();
  }

  async findByClerkId(clerkId: string): Promise<Organization | null> {
    return this.organizationModel.findOne({ clerkId }).populate('memberIds').populate('adminIds').exec();
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.organizationModel.findOne({ slug }).populate('memberIds').populate('adminIds').exec();
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    const userObjectId = new Types.ObjectId(userId);
    return this.organizationModel.find({
      $or: [
        { memberIds: userObjectId },
        { adminIds: userObjectId }
      ]
    }).populate('memberIds').populate('adminIds').exec();
  }

  async update(id: string, updateData: any): Promise<Organization | null> {
    return this.organizationModel.findByIdAndUpdate(id, updateData, { new: true }).populate('memberIds').populate('adminIds').exec();
  }

  async updateByClerkId(clerkId: string, updateData: any): Promise<Organization | null> {
    return this.organizationModel.findOneAndUpdate({ clerkId }, updateData, { new: true }).populate('memberIds').populate('adminIds').exec();
  }

  async delete(id: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndDelete(id).exec();
  }

  async addMember(organizationId: string, userId: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndUpdate(
      organizationId,
      { $addToSet: { memberIds: new Types.ObjectId(userId) } },
      { new: true }
    ).populate('memberIds').populate('adminIds').exec();
  }

  async removeMember(organizationId: string, userId: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndUpdate(
      organizationId,
      { 
        $pull: { 
          memberIds: new Types.ObjectId(userId),
          adminIds: new Types.ObjectId(userId)
        }
      },
      { new: true }
    ).populate('memberIds').populate('adminIds').exec();
  }

  async addAdmin(organizationId: string, userId: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndUpdate(
      organizationId,
      { 
        $addToSet: { 
          adminIds: new Types.ObjectId(userId),
          memberIds: new Types.ObjectId(userId)
        }
      },
      { new: true }
    ).populate('memberIds').populate('adminIds').exec();
  }

  async removeAdmin(organizationId: string, userId: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndUpdate(
      organizationId,
      { $pull: { adminIds: new Types.ObjectId(userId) } },
      { new: true }
    ).populate('memberIds').populate('adminIds').exec();
  }
} 