export default function(url, options) {
	options = options || {};
	return new Promise( (resolve, reject) => {
		const request = new XMLHttpRequest();
		const keys = [];
		const all = [];
		const headers = {};

		const response = () => ({
			ok: (request.status/100|0) == 2,		// 200-299
			statusText: request.statusText,
			status: request.status,
			url: request.responseURL,
			text: () => Promise.resolve(request.responseText),
			json: () => Promise.resolve(JSON.parse(request.responseText)),
			blob: () => Promise.resolve(new Blob([request.response])),
			clone: response,
			headers: {
				keys: () => keys,
				entries: () => all,
				get: n => headers[n.toLowerCase()],
				has: n => n.toLowerCase() in headers
			}
		});

		request.open(options.method || 'get', url, true);

		request.onload = () => {
			request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, (m, key, value) => {
				keys.push(key = key.toLowerCase());
				all.push([key, value]);
				headers[key] = headers[key] ? `${headers[key]},${value}` : value;
			});
			resolve(response());
		};

		request.onerror = reject;

		request.withCredentials = options.credentials=='include';

		if (options.headers && typeof options.headers.entries==='function') {
			// Iterate through options.headers as a Headers instance
			// Normally would use for...of here, but babel transpiles it down to a for-loop that
			// relies on length. This does NOT work with Headers.entries(), because it returns an
			// iterator that has no `length` property.
			// Read:
			// https://developer.mozilla.org/en-US/docs/Web/API/Headers/entries
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol
			const headerEntries = options.headers.entries();
			let headerItem = headerEntries.next();

			while (!headerItem.done) {
				const pair = headerItem.value;
				request.setRequestHeader(pair[0], pair[1]);
				headerItem = headerEntries.next();
			}
		}
		else {
			// Iterate through options.headers as a POJO
			for (const i in options.headers) {
				request.setRequestHeader(i, options.headers[i]);
			}
		}

		request.send(options.body || null);
	});
}
