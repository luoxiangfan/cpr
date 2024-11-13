import fs from 'fs';
import path from 'path';
import mkdirSyncRecursive from 'mkdir-sync-recursive';

export function exit(name: string) {
  console.error(`Try \`${name} --help\` for more information`);
  return 1;
}

export function fileType(filePath: string) {
  let type: 'dir' | 'file' | undefined = undefined;
  const stat = fs.statSync(path.resolve(filePath));
  if (stat.isDirectory()) {
    type = 'dir';
  }
  if (stat.isFile()) {
    type = 'file';
  }
  return type;
}

export function isFile(filePath: string) {
  try {
    const stat = fs.statSync(path.resolve(filePath));
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

export function isDirectory(filePath: string) {
  try {
    const stat = fs.statSync(path.resolve(filePath));
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}

export function isPathExist(filePath: string) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

export function mkdir(filePath: string) {
  if (!fs.existsSync(filePath)) {
    mkdirSyncRecursive(filePath);
  }
}

export const isArray = Array.isArray;
