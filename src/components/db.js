import PouchDB from 'pouchdb';

const localDB = new PouchDB('favorite');

export default class DB {
	constructor() {
		this.getPouchDocs.bind(this);
		this.addPouchDoc.bind(this);
		this.delPouchDoc.bind(this);
	}
	getPouchDocs() {
		return localDB.allDocs({
			include_docs: true
		}).then(response => {
			console.log('getting updated items from PouchDB.');
			return response.rows.map(item =>
				({
					_id: item.doc._id,
					imgurId: item.doc.imgurId,
					keyword: item.doc.keyword,
				})
			);
		});
	}
	addPouchDoc(imgurId, keyword) {
		if (imgurId.length === 0) return;
		return localDB.post({
			imgurId: imgurId,
			keyword: keyword
		}).then(response => {
			console.log(imgurId + " added to PouchDB.");
			return this.getPouchDocs();
		}).catch(err => {
			console.log(err);
		});
	}
	delPouchDoc(idx) {
		return localDB.get(idx).then(doc => {
			doc._deleted = true;
			return localDB.put(doc);
		}).then(result => {
			console.log(idx + " gets deleted");
			return this.getPouchDocs();
		}).catch(err => {
			console.log(err);
		});
	}
}