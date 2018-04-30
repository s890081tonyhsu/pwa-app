let cacheName = 'cache-v1';

let filesToCache = [
	'./index.html',
	'./index.html?utm_source=homescreen',
	'./style.css',
	'./bundle.js',
	'./manifest.json',
	'./assets/icons/favicon-16x16.png',
	'./assets/icons/favicon-32x32.png'
];

//Adding 'install' event listener
self.addEventListener('install', (event) => {
	console.log('Event: Install');

	event.waitUntil(
		//Open the cache
		caches.open(cacheName)
			.then((cache) => {
				//Adding the files to cache
				return cache.addAll(filesToCache)
					.then(() => {
						console.log("All files are cached.");
						return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
					});
			})
			.catch((err) => {
				console.log(err);
			})
	);
});

//Adding 'activate' event listener
self.addEventListener('activate', (event) => {
	console.log('Event: Activate');

	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== cacheName) {     //cacheName = 'cache-v1'
						return caches.delete(cache); //Deleting the cache
					}
				})
			);
		})
	);

	return self.clients.claim(); //To activate this SW immediately without waiting.
});

//Adding 'fetch' event listener
self.addEventListener('fetch', (event) => {
	let request = event.request;
	
	//Tell the browser to wait for network request and respond with below
	event.respondWith(
		//If request is already in cache, return it
		caches.match(request).then((response) => {
			if (response) {
				return response;
			}

			//else add the request to cache and return the response
			return fetch(request).then((response) => {
				return fetchResponse(request, response);
			});
		})
	);
});

function fetchResponse(request, response) {
	let responseToCache = response.clone(); //Cloning the response stream in order to add it to cache
	caches.open(cacheName).then((cache) => {
		cache.put(request, responseToCache); //Adding to cache
	});

	return response;
}
