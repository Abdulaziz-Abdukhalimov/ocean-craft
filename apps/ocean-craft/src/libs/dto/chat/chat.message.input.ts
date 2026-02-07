import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

@InputType()
export class ChatMessageInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	message: string;

	@Field(() => [String], { nullable: true })
	@IsArray()
	@IsOptional()
	context?: string[];
}
