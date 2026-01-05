import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	PRODUCT_INQUIRY = 'PRODUCT_INQUIRY',
	PRODUCT_INQUIRY_RECEIVED = 'PRODUCT_INQUIRY_RECEIVED',
	PRODUCT_INQUIRY_RESPONDED = 'PRODUCT_INQUIRY_RESPONDED',
	EVENT_BOOKING_RECEIVED = 'EVENT_BOOKING_RECEIVED',
	EVENT_BOOKING_CONFIRMED = 'EVENT_BOOKING_CONFIRMED',
	EVENT_BOOKING_CANCELLED = 'EVENT_BOOKING_CANCELLED',
}
registerEnumType(NotificationType, {
	name: 'NotificationType',
});

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}
registerEnumType(NotificationStatus, {
	name: 'NotificationStatus',
});

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	EVENT = 'EVENT',
	PRODUCT = 'PRODUCT',
	INQUIRY = 'INQUIRY',
	BOOKING = 'BOOKING',
}
registerEnumType(NotificationGroup, {
	name: 'NotificationGroup',
});
