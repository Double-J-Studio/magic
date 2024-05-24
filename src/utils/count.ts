import { GroupedModelsByPlatform } from "@/constant";

export function getTotalObjectCount(data: GroupedModelsByPlatform) {
  return Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
}
