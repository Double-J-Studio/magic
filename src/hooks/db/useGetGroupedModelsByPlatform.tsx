import { UseQueryResult, useQuery } from "@tanstack/react-query";

export interface GroupedModelsByPlatform {
  [key: string]: { [key: string]: string }[];
}

export const useGetGroupedModelsByPlatform = () => {
  const {
    data: groupedModelsByPlatform,
    isLoading,
    error,
  }: UseQueryResult<GroupedModelsByPlatform, Error> = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      try {
        const res = await fetch("/data.json");
        const groupedModelsByPlatform = await res.json();

        return groupedModelsByPlatform;
      } catch (err) {
        console.error(err);
      }
    },
  });

  return { groupedModelsByPlatform, isLoading, error };
};
