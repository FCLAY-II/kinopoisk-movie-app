import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
    setUser, 
    setAuthChecked,
    selectUser, 
    selectAuthChecked
} from '@/redux/features/user/userSlice';
import { User } from 'firebase/auth';
import {subscribeToAuthState} from "@/lib/firebase/auth";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const authChecked = useAppSelector(selectAuthChecked);

    useEffect(() => {
        const unsubscribe = subscribeToAuthState((firebaseUser: User | null) => {
            if (firebaseUser) {
                dispatch(setUser(firebaseUser));
            } else {
                dispatch(setUser(null));
            }
            // Важно: устанавливаем authChecked в true после первого срабатывания onAuthStateChanged
            dispatch(setAuthChecked(true));
        });

        return () => unsubscribe();
    }, [dispatch]);

    return {
        user,
        authChecked
    };
};