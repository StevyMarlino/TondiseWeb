import { Menu } from "@/stores/topBarMenuSlice";
import { NavigateFunction } from "react-router-dom";

interface Location {
    pathname: string;
    forceActiveMenu?: string;
}

export interface FormattedMenu extends Menu {
    active?: boolean;
}

function findActiveMenu(menu: Menu, location: Location) {

    if (((location.forceActiveMenu !== undefined && menu.pathname === location.forceActiveMenu) || (location.forceActiveMenu === undefined && menu.pathname === location.pathname))) return true;

    return false;

}

function nestedMenu(menu: Menu[], location: Location) {

    const formattedMenu: Menu[] = [];

    menu.forEach((item)=> {

        if (typeof item !== "string"){

            const menuItem: FormattedMenu = {
                label: item.label,
                pathname: item.pathname
            };

            menuItem.active = findActiveMenu(item, location)

            formattedMenu.push(menuItem)

        } else {

            formattedMenu.push(item)
        }

    });

    return formattedMenu;

}

function linkTo(menu: FormattedMenu, navigate: NavigateFunction){

    if (menu.pathname !== undefined) 
        navigate(menu.pathname)

}

export { nestedMenu, linkTo }