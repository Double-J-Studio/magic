type NestedObject = { [key: string]: { [key: string]: any }[] };

export function flattenAndMapObject(
  obj: NestedObject = {},
  keyField: string,
  valueField: string
) {
  const flattedObjValues = Object.values(obj).flat();
  const result = flattedObjValues.reduce(
    (acc, cur) => {
      acc[cur[keyField]] = cur[valueField];
      return acc;
    },
    {} as { [key: string]: any }
  );

  return result;
}
