import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { User } from "firebase/auth";

interface UserState {
  user: User | null;
  authChecked: boolean; // для отслеживания инициализации
}

const initialState: UserState = {
  user: null,
  authChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.authChecked = true;
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.user.authChecked;

export default userSlice.reducer;
