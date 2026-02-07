import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { ChatResponse } from '../../libs/dto/chat/chat.response.output';
import { ChatMessageInput } from '../../libs/dto/chat/chat.message.input';

@Resolver()
export class ChatResolver {
	private readonly logger = new Logger(ChatResolver.name);

	constructor(private readonly chatService: ChatService) {}

	@Query(() => ChatResponse)
	public async greeting(): Promise<ChatResponse> {
		this.logger.log('Greeting query called');
		return this.chatService.getGreeting();
	}

	@Mutation(() => ChatResponse)
	public async sendMessage(@Args('input') input: ChatMessageInput): Promise<ChatResponse> {
		this.logger.log(`Received message: "${input.message}"`);

		const { response, quickReplies } = await this.chatService.generateResponse(input.message, input.context);

		return {
			response,
			quickReplies,
			confidence: 0.85,
		};
	}
}
