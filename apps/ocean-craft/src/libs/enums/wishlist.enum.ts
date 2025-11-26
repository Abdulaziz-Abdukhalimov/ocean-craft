import { registerEnumType } from '@nestjs/graphql';

export enum ItemType {
	PRODUCT = 'Product',
	EVENT = 'Event',
}
registerEnumType(ItemType, {
	name: 'ItemType',
});
