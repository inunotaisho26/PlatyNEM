import Base from './crud.proc';

class Procedures extends Base<server.models.IPost> {
	create(post: server.models.IPost): Thenable<number> {
		return super.create(this.formatPostDates(post)).then(() => {
			return post.id;
		});
	}

	update(post: server.models.IPost): Thenable<void> {
		return super.update(this.formatPostDates(post));
	}

	read(slug: string): Thenable<server.models.IPost> {
		return super.read(undefined, {
            slug: slug
        }).then((results) => {

			var post = results[0][0];
			post.user = <server.models.IUser>results[1][0];

			return post;
		});
	}

	all(published?: boolean, from?: number, count?: number): Thenable<Array<server.models.IPost>> {
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

		return super.all({
            published: published,
            startingrow: from,
            rowcount: count
        }).then((results) => {
            var posts: Array<server.models.IPost> = results[0];
			var users = results[1];

			this.merge(posts, users);

			return posts;
		});
	}

	protected getArgs(post: server.models.IPost): server.models.IPost {
		if (!this.utils.isObject(post)) {
			return {};
		}

		return {
            userid: post.userid,
            title: post.title,
            content: post.content,
            slug: post.slug,
            created: post.created,
            published: post.published
        };
	}

	private merge(posts: Array<server.models.IPost>, users: Array<server.models.IUser>): void {
		if (!this.utils.isArray(posts)) {
			return;
		}

		posts = posts.slice(0);

		this.utils.forEach(users, (user) => {
			var userPosts: Array<server.models.IPost> = [];
			var length = posts.length;
			var post: server.models.IPost;

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

	private formatPostDates(post: server.models.IPost): server.models.IPost {
		if (this.utils.isString(post.created)) {
			post.created = new Date(<string><any>post.created);
		}
		return post;
	}
}

var procedures = new Procedures('Post');
export default procedures;
