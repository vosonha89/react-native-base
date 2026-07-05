import 'reflect-metadata';
import { ComponentState } from '../../common/types/componentState';

/**
 * Model for view
 */
export class HomeModel {
    public isValid(): boolean {
        return true;
    };
}

/**
 * State for view
 */
export class HomeState extends ComponentState {
    public model = new HomeModel();
    public modelPropName = 'model';

    public async init(): Promise<void> {
        const me = this;
        me.model = new HomeModel();
        me.isReady = true;
    }
}