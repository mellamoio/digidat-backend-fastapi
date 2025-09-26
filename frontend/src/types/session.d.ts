import { IMenuObject } from '../helpers/getInfoMenu';

declare global {
    interface Window {
        SESSION_OBJ?: {
            menu_empresa?: IMenuObject[];
            url?: string;
        };
    }
}
