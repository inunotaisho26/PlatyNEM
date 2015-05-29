/// <reference path="../references.d.ts" />

import Base = require('./base.repository');
import procedures = require('../config/db/procedures/post');

class Repository extends Base<number, models.IPost, models.IPost, void> {
	protected _cachePrefix = 'posts-';
	protected _procedures = procedures;
	
	all(published?: boolean, from?: number, count?: number) {
		var cacheKey = this._cachePrefix + 'all?published=' + published + '&from=' + from + '&count=' + count;
		var posts = this.cache.get(cacheKey);
		
		if (this.utils.isArray(posts)) {
			return this.Promise.resolve(posts);
		}
		
		this._caches.push(cacheKey);
		
		return this._procedures.all(published, from, count).then((posts) => {
			this.store(posts);
			this.cache.put(cacheKey, posts);
			return posts;
		});
	}
	
	create(post: models.IPost) {
		return this._procedures.create(post).then((id) => {
			this.store(post);
			this._clearCaches();
			return id;
		})
	}
	
	read(id: number) {
		var post = this.cache.get(this._cachePrefix + id);
		
		if (this.utils.isObject(post)) {
			return this.Promise.resolve(post);
		}
		
		return this._procedures.read(id).then((post) => {
			this.store(post);
			return post;
		});
	}
	
	update(post: models.IPost) {
		return this._procedures.update(post).then((value) => {
			this.store(post);
			this._clearCaches();
			return value;
		});
	}
}


var repository = new Repository();
export = repository;
