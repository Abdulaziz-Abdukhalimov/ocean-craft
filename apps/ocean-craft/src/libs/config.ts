import { ObjectId } from 'bson';

export const availableAgentsSort = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];
export const availableOptions = ['productBarter', 'productRent'];

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

export const availableProductSorts = [
	'createdAt',
	'updatedAt',
	'productLikes',
	'productViews',
	'productRank',
	'productPrice',
];

export const availableEventSorts = ['createdAt', 'updatedAt', 'eventLikes', 'eventViews'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];
