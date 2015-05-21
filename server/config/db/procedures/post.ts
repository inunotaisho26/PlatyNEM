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
			post.created
		];
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
}

var procedures = new Procedures();
export = procedures;