import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import {User} from "firebase/auth";


interface UserState {
    user: User | null;
    authChecked: boolean; //для отслеживания инициализации
    loading: boolean;
}

const initialState: UserState = {
    user: null,  // Здесь будем хранить информацию о текущем пользователе
    authChecked: false, // Новый флаг для отслеживания инициализации
    loading: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;  // Устанавливаем данные пользователя
            state.authChecked = true;
            state.loading = false;
        },
        clearUser: (state) => {
            state.user = null;  // Очищаем данные пользователя
            state.authChecked = true;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAuthChecked: (state, action: PayloadAction<boolean>) => {
            state.authChecked = action.payload;
        },
    },
});

export const { setUser, clearUser, setAuthChecked } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.user.authChecked;
export const selectUserLoading = (state: RootState) => state.user.loading;

export default userSlice.reducer;
