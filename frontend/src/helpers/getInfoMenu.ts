import { MenuIdentifiers } from '../constants/menu';

export const getInfoMenu = (identificador: MenuIdentifiers) => {
    if (process.env.NODE_ENV === 'development' && !window.SESSION_OBJ) {
        console.warn('SESSION_OBJ is not available. Make sure it is set in your HTML template or during app initialization.');
    }
    
    const menuEmpresa = window.SESSION_OBJ?.menu_empresa;
    
    if (!menuEmpresa) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('menu_empresa is not available in SESSION_OBJ');
        }
        return null;
    }
    
    return menuEmpresa.find((el) => el.identificador === identificador);
};