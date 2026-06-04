type QueueTask<T> = () => Promise<T>;

export class ApiQueue {
	private queue: Promise<any> = Promise.resolve();

	private delay(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}

	async add<T>(task: QueueTask<T>): Promise<T> {
		const result = this.queue.then(async () => {
			const res = await task();

			// kleine Pause nach jedem Request (wichtig gegen 429)
			await this.delay(300);

			return res;
		});

		// queue weiterketten
		this.queue = result.then(() => undefined, () => undefined);

		return result;
	}
}

export const apiQueue = new ApiQueue();