import fs from 'fs';
import path from 'path';
import { isArray, isDirectory, isFile, isPathExist, mkdir } from './util.js';

function copyFile(src: string, dest: string) {
  if (isDirectory(dest)) {
    fs.copyFileSync(src, dest + '/' + src);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(src: string, dest: string) {
  mkdir(dest);
  let entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
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
