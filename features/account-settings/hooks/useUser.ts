import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
    const { data, error, mutate, isLoading } = useSWR('/api/user/me', fetcher);

    return {
        user: data?.data,
        isLoading,
        isError: error,
        mutate
    };
}
