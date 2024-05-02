import { join } from 'path';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';

type FileDataType = {
  path: string;
  fileName: string;
  filePath: string;
}

async function save(path: string, fileName: string, data: any): Promise<FileDataType> {
  if (!existsSync(path)) await mkdir(path, { recursive: true });
  const filePath = join(path, fileName);
  await writeFile(filePath, JSON.stringify(data));
  return { path, fileName, filePath };
}

async function copy(path: string, fileName: string, moveFolder: string):Promise<FileDataType> {
  if (!existsSync(moveFolder)) await mkdir(moveFolder, { recursive: true });
  const source = createReadStream(join(path, fileName));
  const dest = createWriteStream(join(moveFolder, fileName));
  source.pipe(dest);
  return { path, fileName, filePath: String(source.path) };
}

export default { save, copy };
