import {register} from 'platypus';
import UserRepository from '../../../../../repositories/user.repository';
import CMSBaseViewControl from '../../base.viewcontrol';

export default class LogOutViewControl extends CMSBaseViewControl {
    title = 'Platypi | Logout';

    constructor(private userRepository: UserRepository) {
        super();
    }

    context = {};

    navigatedTo() {
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
