import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    UserModule,
    OrganizationModule,
  ],
  providers: [AuthService, ClerkAuthGuard],
  exports: [ClerkAuthGuard, AuthService],
})
export class AuthModule {}