import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserService } from 'src/user/user.service'; // Import UserService
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [RolesGuard], // Include UserService in the providers array
  exports: [RolesGuard],
  imports: [UserModule]
})
export class RolesModule {}
