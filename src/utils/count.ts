import { GroupedModelsByPlatform } from "@/hooks/db/useGetGroupedModelsByPlatform";

export function getTotalObjectCount(data: GroupedModelsByPlatform) {
  return Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
}
