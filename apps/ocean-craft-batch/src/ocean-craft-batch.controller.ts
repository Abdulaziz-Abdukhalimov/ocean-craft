import { Controller, Get, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_EVENTS, BATCH_TOP_PRODUCTS } from './lib/config';
import { OceanCraftBatchService } from './ocean-craft-batch.service';

@Controller()
export class OceanCraftBatchController {
	private logger: Logger = new Logger('BatchController');
	constructor(private readonly batchService: OceanCraftBatchService) {}

	// @Interval(1000)
	// handleInterval() {
	// 	this.logger.debug('INTERNA: TEST');
	// }

	@Cron('00 00 01 * * *', { name: BATCH_ROLLBACK })
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('EXECUTED');
			await this.batchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 00 01 * * *', { name: BATCH_TOP_PRODUCTS })
	public async batchTopProducts() {
		try {
			this.logger['context'] = BATCH_TOP_PRODUCTS;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTopProducts();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 00 01 * * *', { name: BATCH_TOP_EVENTS })
	public async batchTopEvents() {
		try {
			this.logger['context'] = BATCH_TOP_EVENTS;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTopEvents();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('40 00 01 * * *', { name: BATCH_TOP_AGENTS })
	public async topAgents() {
		try {
			this.logger['context'] = BATCH_TOP_AGENTS;
			this.logger.debug('EXECUTED');
			await this.batchService.topAgents();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER: READY');
	}

	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}
