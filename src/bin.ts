#!/usr/bin/env node
import { createInterface } from 'readline';
import { cpr } from './index.js';
import { validArgs } from './constants.js';
import { exit, isDirectory, isFile, isPathExist } from './util.js';
import { name, version } from '../package.json';

export const help = `${name}
Usage: ${name} [OPTION]... SOURCE... DIRECTORY
Copy Single File to DEST File.
Copy SOURCE(s) FILE or DIRECTORY to DEST DIRECTORY.
Overwrite if the DEST FILE or DIRECTORY exist.

  -h --help            Usage information
  -v --version         output version information and exit
`;

let srcPaths: string[] = [];
let destPath: string = '';

const main = async (...args: string[]) => {
  const _args = args.filter((i) => i.trim());
  const splitChar = '--';
  const idx = _args.findIndex((arg) => arg === splitChar);
  let options: string[] = [];
  let files: string[] = [];
  if (!_args.length || (_args.length === 1 && idx > -1)) {
    console.error(`${name}: missing file operand`);
    exit(name);
  }
  if (idx > -1 && _args.length > 1) {
    options = _args.slice(0, idx);
    files = _args.slice(idx).filter((a) => a !== splitChar);
  }
  if (idx < 0 && _args.length) {
    options = _args.filter((a) => /^-/.test(a));
    files = _args.filter((a) => !/^-/.test(a));
  }
  destPath = files.slice(-1)[0];
  const sources = files.slice(0, -1);
  const invalidPaths = sources.filter((f) => !isFile(f) && !isDirectory(f));
  const lastInvalidIndex = invalidPaths.length - 1;
  if (options.length) {
    const arg = options[0];
    if (validArgs.includes(arg)) {
      if (arg === '-h' || arg === '--help') {
        console.log(help);
        return 0;
      } else if (arg === '-v' || arg === '--version') {
        console.log(version);
        return 0;
      }
    } else {
      console.error(`${name}: unknown option: ${options[0]}`);
      exit(name);
    }
  } else if (files.length === 1) {
    console.error(
      `${name}: missing destination file operand after '${files[0]}'`
    );
    exit(name);
  } else if (files.length === 2) {
    if (sources.length === 1) {
      const source = sources[0];
      const sourceExist = isPathExist(source);
      if (sourceExist && isDirectory(source) && isFile(destPath)) {
        console.error(
          `${name}: cannot overwrite non-directory '${destPath}' with directory ${source}'`
        );
        return 1;
      }
      if (!sourceExist) {
        console.error(
          `${name}: cannot stat '${source}': No such file or directory`
        );
        return 1;
      }
    }
  } else if (files.length > 2) {
    if (!isDirectory(destPath)) {
      console.error(`${name}: target '${destPath}' is not a directory`);
      return 1;
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

  if (sources.every((s) => isFile(s) || isDirectory(s))) {
    srcPaths = sources;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  if (srcPaths.length === 1) {
    cpr(srcPaths[0], destPath);
  } else {
    cpr(srcPaths, destPath);
  }

  rl.close();

  return 0;
};
main.help = help;
main.version = version;

export default main;

const args = process.argv.slice(2);
main(...args).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
