import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
    setUser, 
    clearUser, 
    setAuthChecked,
    selectUser, 
    selectUserLoading,
    selectAuthChecked 
} from '@/redux/features/user/userSlice';
import { subscribeToAuthState } from '@/lib/firebase/auth';
import { User } from 'firebase/auth';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectUserLoading);
    const authChecked = useAppSelector(selectAuthChecked);

    useEffect(() => {
        const unsubscribe = subscribeToAuthState((firebaseUser: User | null) => {
            if (firebaseUser) {
                dispatch(setUser(firebaseUser));
            } else {
                dispatch(clearUser());
            }
            // Важно: устанавливаем authChecked в true после первого срабатывания onAuthStateChanged
            dispatch(setAuthChecked(true));
        });

        return () => unsubscribe();
    }, [dispatch]);

    return {
        user,
        loading,
        authChecked
    };
};