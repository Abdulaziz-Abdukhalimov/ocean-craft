import { Schema } from 'mongoose';
import { registerEnumType } from '@nestjs/graphql';

export enum FaqCategory {
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
	PAYMENT = 'PAYMENT',
	SHIPPING = 'SHIPPING',
	RETURN = 'RETURN',
	ACCOUNT = 'ACCOUNT',
	TECHNICAL = 'TECHNICAL',
	GENERAL = 'GENERAL',
}
registerEnumType(FaqCategory, {
	name: 'FaqCategory',
});

export enum FaqStatus {
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
}
registerEnumType(FaqStatus, {
	name: 'FaqStatus',
});

export enum NoticeType {
	GENERAL = 'GENERAL',
	MAINTENANCE = 'MAINTENANCE',
	UPDATE = 'UPDATE',
	EVENT = 'EVENT',
	POLICY = 'POLICY',
	EMERGENCY = 'EMERGENCY',
}
registerEnumType(NoticeType, {
	name: 'NoticeType',
});

export enum NoticeStatus {
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
	EXPIRED = 'EXPIRED',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
});
