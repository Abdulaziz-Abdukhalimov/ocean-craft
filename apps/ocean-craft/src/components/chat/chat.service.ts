import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface ConversationFlow {
	step: string;
	nextQuestions: string[];
}

@Injectable()
export class ChatService {
	private readonly logger = new Logger(ChatService.name);
	private readonly apiKey: string;
	private readonly model: string;
	private readonly apiUrl: string;

	private readonly conversationFlows: Map<string, ConversationFlow> = new Map([
		[
			'greeting',
			{
				step: 'greeting',
				nextQuestions: ['Browse Equipment', 'Book Activities', 'I need advice'],
			},
		],
		[
			'equipment',
			{
				step: 'equipment',
				nextQuestions: ['Yachts', 'Jet-ski', 'Diving equipment', 'Kayaking', 'View all'],
			},
		],
		[
			'activities',
			{
				step: 'activities',
				nextQuestions: ['Surfing lessons', 'Diving trips', 'Kayaking tours', 'See schedule'],
			},
		],
		[
			'beginner',
			{
				step: 'beginner',
				nextQuestions: ['Recommend equipment', 'Book beginner lesson', 'Safety tips'],
			},
		],
		[
			'intermediate',
			{
				step: 'intermediate',
				nextQuestions: ['Upgrade gear', 'Advanced activities', 'Join group tours'],
			},
		],
		[
			'expert',
			{
				step: 'expert',
				nextQuestions: ['Pro equipment', 'Custom activities', 'Rental options'],
			},
		],
		[
			'surfing',
			{
				step: 'surfing',
				nextQuestions: ['Surfboards', 'Book surf lesson', 'Surf conditions today'],
			},
		],
		[
			'diving',
			{
				step: 'diving',
				nextQuestions: ['Diving gear', 'Book dive trip', 'Certification courses'],
			},
		],
		[
			'kayaking',
			{
				step: 'kayaking',
				nextQuestions: ['Kayaks & paddles', 'Kayak tours', 'Rent equipment'],
			},
		],
	]);

	constructor(private configService: ConfigService) {
		this.apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY');
		this.model = this.configService.get<string>('HUGGINGFACE_MODEL') || 'mistralai/Mistral-7B-Instruct-v0.1';
		this.apiUrl = `https://router.huggingface.co/models/${this.model}`;
	}

	public async generateResponse(
		userMessage: string,
		context?: string[],
	): Promise<{ response: string; quickReplies: string[] }> {
		try {
			const step = this.detectConversationStep(userMessage, context);
			const prompt = this.buildPrompt(userMessage, context);

			this.logger.log(`Generating response for: "${userMessage}"`);

			const response = await axios.post(
				this.apiUrl,
				{
					inputs: prompt,
					parameters: {
						max_new_tokens: 150,
						temperature: 0.7,
						top_p: 0.95,
						return_full_text: false,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
						'Content-Type': 'application/json',
					},
					timeout: 30000, // Increased to 30 seconds
				},
			);

			// Handle model loading state
			if (response.data.error) {
				this.logger.warn(`Model loading: ${response.data.error}`);
				throw new Error('Model loading');
			}

			let generatedText = '';

			if (Array.isArray(response.data)) {
				generatedText = response.data[0]?.generated_text || '';
			} else if (response.data.generated_text) {
				generatedText = response.data.generated_text;
			}

			const cleanResponse = this.cleanResponse(generatedText);
			const quickReplies = this.getQuickReplies(step);

			return {
				response: cleanResponse,
				quickReplies,
			};
		} catch (error) {
			// Log the actual error
			this.logger.error('Error generating AI response:', error.response?.data || error.message);

			// Use fallback for specific conversation context
			const step = this.detectConversationStep(userMessage, context);
			return this.getFallbackResponse(userMessage, step);
		}
	}

	private buildPrompt(userMessage: string, context?: string[]): string {
		const systemPrompt = `You are OceanBot, a friendly and enthusiastic assistant for OceanCraft - your one-stop platform for water sport equipment and adventure activities.

Your job is to:
- Help users find the perfect water sport equipment or activity
- Understand their experience level (beginner, intermediate, expert)
- Recommend suitable products or activities based on their interests
- Keep responses SHORT (1-2 sentences maximum)
- Be enthusiastic but helpful
- Guide users toward booking activities or viewing products

Key platform info:
- OceanCraft offers water sport equipment sales (yachts, boats, jetskis, surfboards, kayaks, diving gear, paddleboards, wetsuits, etc.)
- Book exciting water activities (surfing lessons, diving trips, kayaking tours, boat rentals)
- Equipment for all skill levels - beginners to professionals
- Rent or buy equipment
- Expert guidance and certified instructors for activities
- Locations across coastal areas

Product categories:
- Surfing & Paddleboarding
- Diving & Snorkeling
- Kayaking & Canoeing
- Sailing & Windsurfing
- Safety & Accessories

Remember: Keep it brief, exciting, and help them dive into their water sport adventure!`;

		// Add conversation context if available
		let conversationHistory = '';
		if (context && context.length > 0) {
			conversationHistory = '\n\nPrevious conversation:\n' + context.slice(-4).join('\n');
		}

		return `${systemPrompt}${conversationHistory}

User: ${userMessage}
Assistant:`;
	}

	private cleanResponse(text: string): string {
		if (!text) return "I apologize, I didn't quite understand that. Could you rephrase?";

		// Remove common AI artifacts
		let cleaned = text
			.replace(/^(Assistant:|Bot:|LeadBot:)/i, '')
			.replace(/^[\s\n]+/, '')
			.trim();

		// Limit to 1-2 sentences for brevity
		const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
		cleaned = sentences.slice(0, 3).join(' ');

		return cleaned || 'Thanks for your message! How can I help you today?';
	}

	/**
	 * Detect which step of the conversation we're in
	 */
	private detectConversationStep(message: string, context?: string[]): string {
		const lowerMessage = message.toLowerCase();

		// Check for activity keywords
		if (lowerMessage.includes('surf')) return 'surfing';
		if (lowerMessage.includes('div')) return 'diving';
		if (lowerMessage.includes('kayak') || lowerMessage.includes('canoe')) return 'kayaking';
		if (lowerMessage.includes('paddleboard') || lowerMessage.includes('sup')) return 'surfing';
		if (lowerMessage.includes('sail') || lowerMessage.includes('windsurf')) return 'surfing';

		// Check for intent
		if (
			lowerMessage.includes('equipment') ||
			lowerMessage.includes('gear') ||
			lowerMessage.includes('buy') ||
			lowerMessage.includes('shop')
		) {
			return 'equipment';
		}
		if (
			lowerMessage.includes('activity') ||
			lowerMessage.includes('lesson') ||
			lowerMessage.includes('tour') ||
			lowerMessage.includes('book')
		) {
			return 'activities';
		}

		// Check for experience level
		if (
			lowerMessage.includes('beginner') ||
			lowerMessage.includes('new') ||
			lowerMessage.includes('first time') ||
			lowerMessage.includes('never')
		) {
			return 'beginner';
		}
		if (lowerMessage.includes('intermediate') || lowerMessage.includes('some experience')) {
			return 'intermediate';
		}
		if (lowerMessage.includes('expert') || lowerMessage.includes('pro') || lowerMessage.includes('advanced')) {
			return 'expert';
		}

		// Default to greeting if no context
		if (!context || context.length === 0) return 'greeting';

		return 'general';
	}

	/**
	 * Get relevant quick reply buttons based on conversation step
	 */
	private getQuickReplies(step: string): string[] {
		const flow = this.conversationFlows.get(step);
		if (flow) return flow.nextQuestions;

		// Default quick replies
		return ['Tell me more', 'Schedule a demo', 'See pricing'];
	}

	/**
	 * Fallback response when AI fails
	 */
	private getFallbackResponse(userMessage: string, step?: string): { response: string; quickReplies: string[] } {
		const lowerMessage = userMessage.toLowerCase();

		// Use step-based responses first
		if (step && this.conversationFlows.has(step)) {
			const flow = this.conversationFlows.get(step);
			return {
				response: this.getStepResponse(step, lowerMessage),
				quickReplies: flow.nextQuestions,
			};
		}

		// Existing fallback logic...
		let response = 'Welcome to OceanCraft! 🌊 ';
		let quickReplies: string[] = [];

		if (lowerMessage.includes('surf')) {
			response += 'We have amazing surfing gear and lessons! Ready to catch some waves?';
			quickReplies = ['Surfboards', 'Surf lessons', 'What do I need?'];
		} else if (lowerMessage.includes('div')) {
			response += 'Explore the underwater world! We offer diving gear and guided trips.';
			quickReplies = ['Diving equipment', 'Book dive trip', 'Beginner courses'];
		} else if (lowerMessage.includes('kayak')) {
			response += 'Kayaking is perfect for exploring! Check out our equipment and tours.';
			quickReplies = ['Kayaks for sale', 'Guided tours', 'Rent equipment'];
		} else if (lowerMessage.includes('advice') || lowerMessage.includes('help')) {
			response += 'I can help you find the perfect equipment or activity for your skill level!';
			quickReplies = ["I'm a beginner", 'I have experience', 'Show me options'];
		} else {
			response += 'What water sport adventure are you interested in today?';
			quickReplies = ['Browse Equipment', 'Book Activities', 'I need advice'];
		}

		return { response, quickReplies };
	}

	private getStepResponse(step: string, message: string): string {
		const responses = {
			greeting: 'Welcome to OceanCraft! 🌊 What water sport adventure are you interested in today?',
			equipment: 'Great choice! What type of equipment are you looking for?',
			activities: 'Awesome! What activity would you like to book?',
			beginner: 'Perfect for beginners! What would you like to try?',
			intermediate: 'Ready to level up! What are you interested in?',
			expert: "Expert level! Let's find you the best gear and activities.",
			surfing: 'Surfing is amazing! How can I help you get started?',
			diving: 'Diving adventures await! What are you looking for?',
			kayaking: 'Kayaking is so peaceful! What do you need?',
		};

		return responses[step] || 'How can I help you today?';
	}

	/**
	 * Get initial greeting message
	 */
	getGreeting(): { response: string; quickReplies: string[] } {
		return {
			response:
				"Hi there! 🏄‍♂️ Welcome to OceanCraft. Whether you are looking for equipment or planning your next water adventure , I'm here to help!",
			quickReplies: ['Browse Equipment', 'Book Activities', 'I need advice'],
		};
	}
}
