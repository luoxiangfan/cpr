import fs from 'fs';
import path from 'path';
import { errorMsg, isArray, isDirectory, isFile, isPathExist } from './util.js';
import mkdirSyncRecursive from 'mkdir-sync-recursive';

function copyFile(src: string, dest: string) {
  let destPath = dest;
  const sep = path.sep
  if (isDirectory(dest)) {
    if (isFile(src)) {
      destPath = dest + sep + path.basename(src);
    } else {
      destPath = dest + sep + src;
    }
  }
  fs.copyFileSync(src, destPath);
}

function copyDir(src: string, dest: string) {
  mkdirSyncRecursive(dest);
  try {
    const files = fs.readdirSync(src, { encoding: 'utf-8' });
    for (const file of files) {
      let srcPath = path.join(src, file);
      let destPath = path.join(dest, file);
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
  const sep = path.sep
  if (mkdirp && !isPathExist(dest)) {
    mkdirSyncRecursive(dest);
  }
  if (isArray(source)) {
    source.forEach((s) => {
      if (isFile(s)) {
        copyFile(s, dest);
      }
      if (isDirectory(s)) {
        if (isPathExist(dest)) {
          copyDir(s, dest + sep + s);
        } else {
          copyDir(s, dest);
        }
      }
    });
  } else {
    if (isDirectory(source)) {
      if (isPathExist(dest)) {
        copyDir(source, dest + sep + source);
      } else {
        copyDir(source, dest);
      }
    } else {
      copyFile(source, dest);
    }
  }
}
