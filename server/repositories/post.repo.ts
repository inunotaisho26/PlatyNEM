import Base from './crud.repo';
import procedures from '../procedures/post.proc';

class Repository extends Base<server.models.IPost> {
    procedures: typeof procedures;
    all(from?: number, count?: number, published?: boolean): Thenable<Array<server.models.IPost>> {
        return this.procedures.all(from, count, published);
    }
}

var repository = new Repository(procedures);
export default repository;
