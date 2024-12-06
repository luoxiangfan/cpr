import { statSync, existsSync } from 'fs';
import { resolve } from 'path';
import { name } from '../package.json';

export function exit(name: string) {
  console.error(`Try \`${name} --help\` for more information.`);
  return 1;
}

export function isFile(path: string) {
  try {
    const stat = statSync(resolve(path));
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

export function isDirectory(path: string) {
  try {
    const stat = statSync(resolve(path));
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}

export function isPathExist(path: string) {
  try {
    return existsSync(path);
  } catch (error) {
    return false;
  }
}

export function errorMsg(
  source: string | string[],
  dest: string,
  mkdirp?: boolean
) {
  if (!dest) {
    console.error(
      `${name}: missing destination file operand after '${source}'`
    );
    return exit(name);
  } else if (typeof source === 'string') {
    const exist = isPathExist(source);
    if (exist && isDirectory(source) && isFile(dest)) {
      console.error(
        `${name}: cannot overwrite non-directory '${dest}' with directory ${source}'`
      );
      return exit(name);
    }
    if (!exist) {
      console.error(
        `${name}: cannot stat '${source}': No such file or directory`
      );
      return exit(name);
    }
  } else {
    const paths = source.filter((f) => !isFile(f) && !isDirectory(f));
    const index = paths.length - 1;
    if (!mkdirp && !isDirectory(dest)) {
      console.error(`${name}: target '${dest}' is not a directory`);
      return exit(name);
    } else {
      paths.forEach((p, idx) => {
        if (!isFile(p) && !isDirectory(p)) {
          console.error(
            `${name}: cannot stat '${p}': No such file or directory`
          );
          if (idx === index) {
            return 1;
          }
        }
      });
    }
  }
}
