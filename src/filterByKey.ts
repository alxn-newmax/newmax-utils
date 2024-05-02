export function filterByKey(items: Array<any> = [], selectList: string[] = [], ignoreList: string[] = [], key: string = 'id') {
  if (selectList.length) items = items.filter((item) => selectList.includes(item[key]));
  if (ignoreList.length) items = items.filter((item) => !ignoreList.includes(item[key]));
  return items;
}
