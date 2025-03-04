import { clearTimeout, setTimeout } from "node:timers";

export default function debounce<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	delay: number
) {
	let timer: NodeJS.Timeout | null = null;
	return (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return new Promise((resolve) => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(async () => {
				const result = await fn(...args);
				resolve(result);
			}, delay);
		});
	};
}
