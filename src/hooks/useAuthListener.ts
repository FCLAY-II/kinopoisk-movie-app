import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/features/user/userSlice';
import { subscribeToAuthState } from '@/lib/firebase/auth';
import { User } from 'firebase/auth';

export const useAuthListener = (): void => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = subscribeToAuthState((firebaseUser: User | null) => {
            if (firebaseUser) {
                dispatch(setUser(firebaseUser));
            } else {
                dispatch(setUser(null));
            }
        });

        return () => unsubscribe();
    }, []);
};