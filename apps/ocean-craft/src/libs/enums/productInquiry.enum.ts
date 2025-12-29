import { registerEnumType } from '@nestjs/graphql';

export enum InquiryStatus {
	PENDING = 'PENDING',
	VIEWED = 'VIEWED',
	RESPONDED = 'RESPONDED',
	CLOSED = 'CLOSED',
}
registerEnumType(InquiryStatus, {
	name: 'InquiryStatus',
});

export enum InquiryGroup {
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
}
registerEnumType(InquiryGroup, {
	name: 'InquiryGroup',
});

export enum PreferredContactMethod {
	EMAIL = 'EMAIL',
	PHONE = 'PHONE',
	WHATSAPP = 'WHATSAPP',
	ANY = 'ANY',
}
registerEnumType(PreferredContactMethod, {
	name: 'PreferredContactMethod',
});
