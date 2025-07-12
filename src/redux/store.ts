import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import moviesReducer from "./features/movies/moviesSlice";
import favoritesReducer from "./features/favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем Firebase User объекты
        ignoredActions: [
          "user/setUser",
          "favorites/thunks/loadFavorites/pending",
          "favorites/thunks/loadFavorites/fulfilled",
          "favorites/thunks/loadFavorites/rejected",
          "favorites/thunks/addToFavorites/pending",
          "favorites/thunks/addToFavorites/fulfilled",
          "favorites/thunks/addToFavorites/rejected",
          "favorites/thunks/removeFromFavorites/pending",
          "favorites/thunks/removeFromFavorites/fulfilled",
          "favorites/thunks/removeFromFavorites/rejected",
        ],
        ignoredActionsPaths: ["payload"],
        ignoredPaths: ["user.user"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
