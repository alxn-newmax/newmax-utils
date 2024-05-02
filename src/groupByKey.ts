type ItemType = {
  [key: string]: any;
}

export function groupByKey(items: ItemType[], callback: (item: ItemType) => string): Array<ItemType[]> {
  const obj: {
    [key: string]: ItemType[]
  } = {};
  items.forEach((item) => {
    const key = callback(item);
    obj[key] ? (obj[key] = [...obj[key], item]) : (obj[key] = [item]);
  });
  return Object.values(obj);
}