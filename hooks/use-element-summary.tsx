'use client'
import { useQuery } from "@tanstack/react-query";
import { getElementSummaryFromStorage } from "../services";

const useElementSummary = ({ id }: { id: string | number }) => {
    const { data: elementSummary, isLoading: isLoadingElementSummary, error: errorElementSummary } = useQuery({
        queryKey: ["elementSummary", id],
        queryFn: async () => await getElementSummaryFromStorage(id),
        enabled: !!id
    });

    return { elementSummary, isLoadingElementSummary, errorElementSummary }
}

export default useElementSummary;
