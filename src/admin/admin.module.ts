import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import forFeatureDb from 'src/db/for-feature.db';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    MongooseModule.forFeature(forFeatureDb),
    forwardRef(() => AuthModule),
  ],
  exports: [AdminService],
})
export class AdminModule {}
