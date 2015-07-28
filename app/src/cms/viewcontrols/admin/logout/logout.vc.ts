import {register} from 'platypus';
import UserRepository from '../../../../repositories/user.repo';
import CMSBaseViewControl from '../../base.vc';

export default class LogOutViewControl extends CMSBaseViewControl {
    title: string = 'Platypi | Logout';

    constructor(private userRepository: UserRepository) {
        super();
    }

    context: {} = {};

    navigatedTo(): void {
        this.userRepository.logout()
            .catch(this.utils.noop)
            .then(() => {
                this.navigator.navigate('', {
                    replace: true
                });
            });
    }
}

register.viewControl('logout-vc', LogOutViewControl, [
    UserRepository
]);
