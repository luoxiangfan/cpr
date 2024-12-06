import { copyFileSync, readdirSync } from 'fs';
import { sep, basename, join } from 'path';
import { errorMsg, isDirectory, isFile, isPathExist } from './util.js';
import mkdirSyncRecursive from 'mkdir-sync-recursive';

function copyFile(src: string, dest: string) {
  let destPath = dest;
  if (isDirectory(dest)) {
    destPath = dest + sep + src;
    if (isFile(src)) {
      destPath = dest + sep + basename(src);
    }
  }
  copyFileSync(src, destPath);
}

function copyDir(src: string, dest: string) {
  mkdirSyncRecursive(dest);
  try {
    const files = readdirSync(src, { encoding: 'utf-8' });
    for (const file of files) {
      let srcPath = join(src, file);
      let destPath = join(dest, file);
      if (isDirectory(srcPath)) {
        copyDir(srcPath, destPath);
      }
      if (isFile(srcPath)) {
        copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export function cpr(source: string | string[], dest: string, mkdirp?: boolean) {
  if (errorMsg(source, dest, mkdirp)) {
    return;
  }
  if (mkdirp && !isPathExist(dest)) {
    mkdirSyncRecursive(dest);
  }
  const sources = typeof source === 'string' ? [source] : source;
  sources.forEach((s) => {
    if (isFile(s)) {
      copyFile(s, dest);
    }
    if (isDirectory(s)) {
      let _dest = dest;
      if (isPathExist(dest)) {
        _dest = dest + sep + s;
      }
      copyDir(s, _dest);
    }
  });
}
