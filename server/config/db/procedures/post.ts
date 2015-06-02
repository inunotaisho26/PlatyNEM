/// <reference path="../../../references.d.ts" />

import Base = require('./base');

class Procedures extends Base<number, models.IPost, models.IPost, void> {
	constructor() {
		super('Post');
	}
	
	getArgs(post: models.IPost): Array<any> {
		if (!this.utils.isObject(post)) {
			return [];
		}
		
		return [
			post.userid,
			encodeURI(post.title),
			encodeURI(post.content),
			post.created,
			post.published
		];
	}
	
	create(post: models.IPost) {
		return super.create(this._formatPostDates(post)).then(() => {
			return post.id;
		})
	}
	
	update(post: models.IPost) {
		return super.update(this._formatPostDates(post));
	}
	
	read(id: number) {
		return this._read(id).then((results) => {
			var post = results[0][0];
			post.user = <models.IUser>results[1][0];
			
			return post;
		});
	}
	
	all(published?: boolean, from?: number, count?: number) {
		if (!this.utils.isNumber(from)) {
			from = Number(from);
		}
		
		count = Number(count);
		
		if (isNaN(from)) {
			from = 0;
		}
		
		if (isNaN(count)) {
			count = 0;
		}
		
		return this.callProcedure('Get' + this.procedure + 's', [published, from, count]).then((results) => {
			var posts: Array<models.IPost> = results[0];
			var users = results[1];
			
			this.merge(posts, users);
			
			return posts;
		});
	}
	
	merge(posts: Array<models.IPost>, users: Array<models.IUser>) {
		if (!this.utils.isArray(posts)) {
			return;
		}
		
		posts = posts.slice(0);
		
		this.utils.forEach(users, (user) => {
			var userPosts: Array<models.IPost> = [];
			var length = posts.length;
			var post: models.IPost;
			
			for (var i = length - 1; i >= 0; --i) {
				post = posts[i];
				
				if (post.userid === user.id) {
					posts.splice(i, 1);
					userPosts.push(post);
				}
			}
			
			this.utils.forEach(userPosts, (post) => {
				post.user = user;
			});
		});
	}
	
	private _formatPostDates(post: models.IPost): models.IPost {
		if (this.utils.isString(post.created)) {
			post.created = new Date(<string><any>post.created);
		}
		return post;
	}
}

var procedures = new Procedures();
export = procedures;
