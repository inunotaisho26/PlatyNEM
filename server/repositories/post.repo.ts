import Base from './crud.repo';
import procedures from '../procedures/post.proc';

class Repository extends Base<server.models.IPost> {
    procedures: typeof procedures;
    all(published?: boolean, from?: number, count?: number): Thenable<Array<server.models.IPost>> {
        return this.procedures.all(published, from, count);
    }
}

var repository = new Repository(procedures);
export default repository;
