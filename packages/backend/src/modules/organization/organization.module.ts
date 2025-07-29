import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationRepository } from './db/organization.repository';
import { Organization, OrganizationSchema } from './db/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }])
  ],
  providers: [OrganizationRepository],
  exports: [OrganizationRepository],
})
export class OrganizationModule {} 