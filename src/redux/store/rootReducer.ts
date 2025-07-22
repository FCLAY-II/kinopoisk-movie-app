import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import moviesReducer from "../features/movies/moviesSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import watchedReducer from "../features/watched/watchedSlice";

const appReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  favorites: favoritesReducer,
  watched: watchedReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any,
) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
