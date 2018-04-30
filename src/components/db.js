import idb from 'idb';

export default class DB {
	constructor(store) {
		this.state = {
			name: 'Favorite',
			data: []
		};

		this.dbPromise = idb.open('pwaDB', 1, updateDB => {
			const co = updateDB.createObjectStore('favorite', {
				keyPath: 'id',
				autoIncrement: true
			});
			co.createIndex('keyword', 'keyword', { unique: false });
			co.createIndex('imgurId', 'imgurId', { unique: true });

			store.map((item, index) => co.add(item));
			return co;
		});

		this.get = this.get.bind(this);
		this.getAll = this.getAll.bind(this);
		this.set = this.set.bind(this);
		this.delete = this.delete.bind(this);
	}

	get(key) {
		return this.dbPromise.then(db => db
			.transaction('favorite')
			.objectStore('favorite')
			.index('imgurId')
			.getAll(key)
			).then(val => console.log(val));
	}

	getAll() {
		return this.dbPromise.then(db => {
			return db
				.transaction('favorite')
				.objectStore('favorite');
		});
	}

	delete(key) {
		return this.dbPromise.then(db => {
			const tx = db.transaction('favorite', 'readwrite');
			tx.objectStore('favorite').delete(key);
			tx.objectStore('favorite').getAll();

			return tx.complete;
		});
	}

	set(val) {
		return this.dbPromise.then(db => {
			const tx = db.transaction('favorite', 'readwrite');
			tx.objectStore('favorite').put(val);
			tx.objectStore('favorite').getAll();

			return tx.complete;
		})
	}
}