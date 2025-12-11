import { createSlice } from "@reduxjs/toolkit"

const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark").matches
    ? "dark" : "light";
}

const initialState = {
    theme : localStorage.getItem("theme") || getSystemTheme(),
}

const themeSlice = createSlice({
    name : "theme",
    initialState,
    reducers: {
        toggleTheme: (state) =>{
            state.theme = state.theme === "light" ? "dark" : "light";
            localStorage.setItem("theme",state.theme);
        },
    },
});

export const {toggleTheme , setTheme} = themeSlice.actions;
export default themeSlice.reducer;