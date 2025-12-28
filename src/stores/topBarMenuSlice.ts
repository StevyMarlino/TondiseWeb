import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./stores";

export interface Menu {
    label?: string;
    pathname?: string;
};

export interface TopMenuState {
    menu: Menu[]
};

const initialState: TopMenuState = {
    menu: [
        {
            label: 'Home',
            pathname: '/'
        },
        {
            label: 'Shop',
            pathname: '/shop'
        },
        {
            label: 'About',
            pathname: '/about'
        },
        {
            label: 'Blog',
            pathname: '/blog'
        },
        {
            label: 'Contact',
            pathname: '/contact'
        }
    ]
};

export const topMenuSlice = createSlice({
    name: "topMenu",
    initialState,
    reducers: {}
});

export const selectTopMenu = (state: RootState) => state.topMenu.menu;

export default topMenuSlice.reducer;