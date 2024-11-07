import fs from 'fs';
import path from 'path';
import { isArray, isDirectory, isFile, isPathExist, mkdir } from './util.js';

function copyFile(src: string, dest: string) {
  let destPath = dest;
  if (isDirectory(dest)) {
    if (isFile(src)) {
      destPath = dest + '/' + path.basename(src);
    } else {
      destPath = dest + '/' + src;
    }
  }
  fs.copyFileSync(src, destPath);
}

function copyDir(src: string, dest: string) {
  mkdir(dest);
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

export function cpr(source: string | string[], dest: string) {
  if (isArray(source)) {
    source.forEach((s) => {
      if (isFile(s)) {
        copyFile(s, dest);
      }
      if (isDirectory(s)) {
        if (isPathExist(dest)) {
          copyDir(s, dest + '/' + s);
        } else {
          copyDir(s, dest);
        }
      }
    });
  } else {
    if (isDirectory(source)) {
      if (isPathExist(dest)) {
        copyDir(source, dest + '/' + source);
      } else {
        copyDir(source, dest);
      }
    } else {
      copyFile(source, dest);
    }
  }
}
