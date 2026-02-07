import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import NotificationSchema from '../../schemas/Notification.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import ProductSchema from '../../schemas/Product.model';
import EventSchema from '../../schemas/Event.model';
import { NotificationGateway } from '../../socket/notification.gateway';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Notification', schema: NotificationSchema },
			{ name: 'Product', schema: ProductSchema },
			{ name: 'Event', schema: EventSchema },
		]),
		AuthModule,
		MemberModule,
	],
	providers: [NotificationResolver, NotificationService, NotificationGateway],
	exports: [NotificationService],
})
export class NotificationModule {}
