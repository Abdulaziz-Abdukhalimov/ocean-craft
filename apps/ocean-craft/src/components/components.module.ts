import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { EventModule } from './event/event.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { ReservationModule } from './reservation/reservation.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { NotificationModule } from './notification/notification.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		ProductModule,
		CommentModule,
		EventModule,
		FollowModule,
		LikeModule,
		ViewModule,
		ReservationModule,
		InquiryModule,
		NotificationModule,
	],
})
export class ComponentsModule {}
