import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { Notification, NotificationsResponse } from '../../libs/dto/notification/notification';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(AuthGuard)
	@Query(() => NotificationsResponse)
	public async getMyNotifications(
		@Args('input') input: NotificationInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<NotificationsResponse> {
		console.log('Query: getMyNotifications');
		return await this.notificationService.getMyNotifications(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Int)
	public async getUnreadNotificationCount(@AuthMember('_id') memberId: ObjectId): Promise<number> {
		console.log('Query: getUnreadNotificationCount');
		return await this.notificationService.getUnreadCount(memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async markNotificationAsRead(
		@Args('notificationId') notificationId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<boolean> {
		console.log('Mutation: markNotificationAsRead');
		const notificationObjectId = shapeIntoMongoObjectId(notificationId);
		return await this.notificationService.markAsRead(notificationObjectId, memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Int)
	public async markAllNotificationsAsRead(@AuthMember('_id') memberId: ObjectId): Promise<number> {
		console.log('Mutation: markAllNotificationsAsRead');
		return await this.notificationService.markAllAsRead(memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async deleteNotification(
		@Args('notificationId') notificationId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<boolean> {
		console.log('Mutation: deleteNotification');
		const notificationObjectId = shapeIntoMongoObjectId(notificationId);
		return await this.notificationService.deleteNotification(notificationObjectId, memberId);
	}
}
