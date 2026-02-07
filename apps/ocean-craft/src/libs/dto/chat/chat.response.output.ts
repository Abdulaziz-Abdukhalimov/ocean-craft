import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChatResponse {
	@Field()
	response: string;

	@Field(() => [String], { nullable: true })
	quickReplies?: string[];

	@Field({ nullable: true })
	confidence?: number;
}
