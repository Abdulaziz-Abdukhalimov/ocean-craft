import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
