import fs from 'fs';
import path from 'path';
import packageConfig from '../package.json' with { type: 'json' };

const { name } = packageConfig;

export function exit(name: string) {
  console.error(`Try \`${name} --help\` for more information.`);
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

export const isArray = Array.isArray;

export function errorMsg(source: string | string[], dest: string, mkdirp?: boolean) {
  if (!dest) {
    console.error(
      `${name}: missing destination file operand after '${source}'`
    );
    return exit(name);
  } else if (typeof source === 'string') {
    const sourceExist = isPathExist(source);
    if (sourceExist && isDirectory(source) && isFile(dest)) {
      console.error(
        `${name}: cannot overwrite non-directory '${dest}' with directory ${source}'`
      );
      return exit(name);
    }
    if (!sourceExist) {
      console.error(
        `${name}: cannot stat '${source}': No such file or directory`
      );
      return exit(name);
    }
  } else {
    const invalidPaths = source.filter((f) => !isFile(f) && !isDirectory(f));
    const lastInvalidIndex = invalidPaths.length - 1;
    if (!mkdirp && !isDirectory(dest)) {
      console.error(`${name}: target '${dest}' is not a directory`);
      return exit(name);
    } else {
      invalidPaths.forEach((f, idx) => {
        if (!isFile(f) && !isDirectory(f)) {
          console.error(
            `${name}: cannot stat '${f}': No such file or directory`
          );
          if (idx === lastInvalidIndex) {
            return 1;
          }
        }
      });
    }
  }
}