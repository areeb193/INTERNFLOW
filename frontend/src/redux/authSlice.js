import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
        },
        // Clear all user data (used on logout)
        clearUserData: (state) => {
            return { loading: false, user: null };
        }
    }
});
export const { setLoading, setUser, logout, clearUserData } = authSlice.actions;
export default authSlice.reducer;