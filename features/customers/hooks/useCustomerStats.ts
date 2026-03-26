import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCustomerStats(id?: string) {
    const { data, error, isLoading } = useSWR(
        id ? `/api/tenant/customers/stats/${id}` : null,
        fetcher
    );

    return {
        data: data?.data || null,
        isLoading,
        isError: error
    };
}
