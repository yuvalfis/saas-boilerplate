import { Module } from '@nestjs/common';
import { ClerkController } from './clerk.controller';
import { ClerkService } from './clerk.service';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [UserModule, OrganizationModule],
  controllers: [ClerkController],
  providers: [ClerkService],
})
export class ClerkModule {} 