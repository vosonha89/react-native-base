import { ComponentState as  FWComponentState, ObjectHelper} from 'one-frontend-framework';

export abstract class ComponentState extends FWComponentState{
    /**
     * Custom deep copy for react native state
     * @returns 
     */
    public override copy<TObject>(): TObject {
        return ObjectHelper.deepCopyHemers(this) as unknown as TObject;
    }
}