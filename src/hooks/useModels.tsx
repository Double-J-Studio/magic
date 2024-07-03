import {
  GroupedModelsByPlatform,
  useGetGroupedModelsByPlatform,
} from "@/hooks/db/useGetGroupedModelsByPlatform";
import { flattenAndMapObject } from "@/utils/mapper";

const useModels = () => {
  const { groupedModelsByPlatform } = useGetGroupedModelsByPlatform();

  const models = flattenAndMapObject(
    groupedModelsByPlatform as GroupedModelsByPlatform,
    "id",
    "model"
  );

  return { models };
};

export default useModels;
