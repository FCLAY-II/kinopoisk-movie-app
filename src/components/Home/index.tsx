import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/hooks';

export default function Home() {
    const router = useRouter();
    const user = useAppSelector((state) => state.user.user);

    useEffect(() => {
        if (user) {
            router.push('/search-movies');
        } else {
            router.push('/auth');
        }
    }, [user, router]);

    return null; // Эта страница только для редиректа
}