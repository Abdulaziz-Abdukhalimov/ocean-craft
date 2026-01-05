import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { NotificationInquiry, CreateNotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationType, NotificationGroup, NotificationStatus } from '../../libs/enums/notification.enum';
import { NotificationsResponse } from '../../libs/dto/notification/notification';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	public async createNotification(input: CreateNotificationInput): Promise<Notification> {
		try {
			if (input.receiverId.toString() === input.authorId.toString()) {
				return null;
			}

			const notification = await this.notificationModel.create(input);
			return notification;
		} catch (err) {
			console.log('Error creating notification:', err);
			return null;
		}
	}

	public async getMyNotifications(receiverId: ObjectId, input: NotificationInquiry): Promise<NotificationsResponse> {
		const { page, limit, notificationStatus } = input;
		const match: any = { receiverId };

		if (notificationStatus) {
			match.notificationStatus = notificationStatus;
		}

		const notifications = await this.notificationModel
			.find(match)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('authorId', 'memberNick memberImage memberPhone')
			.populate('productId', 'productTitle productImages')
			.populate('eventId', 'eventTitle eventImages')
			.lean();

		const total = await this.notificationModel.countDocuments(match);

		return {
			list: notifications as any,
			metaCounter: [{ total }],
		};
	}

	public async markAsRead(notificationId: ObjectId, receiverId: ObjectId): Promise<boolean> {
		const result = await this.notificationModel.updateOne(
			{ _id: notificationId, receiverId },
			{
				$set: {
					notificationStatus: NotificationStatus.READ,
					readAt: new Date(),
				},
			},
		);

		return result.modifiedCount > 0;
	}

	public async markAllAsRead(receiverId: ObjectId): Promise<number> {
		const result = await this.notificationModel.updateMany(
			{ receiverId, notificationStatus: NotificationStatus.WAIT },
			{
				$set: {
					notificationStatus: NotificationStatus.READ,
					readAt: new Date(),
				},
			},
		);

		return result.modifiedCount;
	}

	public async getUnreadCount(receiverId: ObjectId): Promise<number> {
		return await this.notificationModel.countDocuments({
			receiverId,
			notificationStatus: NotificationStatus.WAIT,
		});
	}

	public async deleteNotification(notificationId: ObjectId, receiverId: ObjectId): Promise<boolean> {
		const result = await this.notificationModel.deleteOne({
			_id: notificationId,
			receiverId,
		});

		return result.deletedCount > 0;
	}
}
