import {createAsyncThunk} from "@reduxjs/toolkit";
import * as favoritesApi from "@/services/api/favorites";

export const removeFromFavoritesThunk = createAsyncThunk<
    number,
    { userId: string; filmId: number },
    { rejectValue: string }
>(
    'favorites/thunks/removeFromFavoritesThunk',
    async ({ userId, filmId }, { rejectWithValue }) => {
        const result = await favoritesApi.removeFromFavorites(userId, filmId);

        if (!result.success) {
            return rejectWithValue(result.error || 'Ошибка удаления из избранного');
        }

        return filmId;
    }
);