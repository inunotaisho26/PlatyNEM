import Base from './crud.repo';
import procedures from '../procedures/user.proc';

class Repository extends Base<server.models.IUser> {
    procedures: typeof procedures;

    createUserPasswordResetToken(email: string, token: string): Thenable<number> {
        return this.procedures.createUserPasswordResetToken(email, token);
    }

    findByPasswordResetToken(token: string): Thenable<server.models.IUser> {
        return this.procedures.findByPasswordResetToken(token);
    }
}

var repository = new Repository(procedures);
export default repository;
