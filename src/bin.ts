#!/usr/bin/env node
import { createInterface } from 'readline';
import { cpr } from './index.js';
import { exit } from './util.js';
import { name, version } from '../package.json';

const validArgs = ['-h', '-v', '--help', '--version', '--mkdirp'];

const help = `${name}
Usage: ${name} [OPTION]... SOURCE... DIRECTORY
Copy Single File to DEST File.
Copy SOURCE(s) FILE or DIRECTORY to DEST DIRECTORY.
Overwrite if the DEST FILE or DIRECTORY exist.

  -h --help            Usage information
  -v --version         output version information and exit
  --mkdirp             make dest directory recursively if it not exist
`;

let dest: string = '';

const main = async (...args: string[]) => {
  const _args = args.filter((i) => i.trim());
  const splitChar = '--';
  const idx = _args.findIndex((arg) => arg === splitChar);
  let options: string[] = [];
  let files: string[] = [];
  let sources: string[] = [];
  let mkdirp = false;
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
  dest = files.slice(-1)[0];
  sources = files.slice(0, -1);
  if (files.length === 1) {
    sources = files;
    dest = '';
  }
  if (options.length) {
    const arg = options[0];
    if (validArgs.includes(arg)) {
      if (arg === '-h' || arg === '--help') {
        console.log(help);
        return 0;
      } else if (arg === '-v' || arg === '--version') {
        console.log(version);
        return 0;
      } else if (arg === '--mkdirp') {
        mkdirp = true;
      }
    } else {
      console.error(`${name}: unknown option: ${options[0]}`);
      exit(name);
    }
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  cpr(sources, dest, mkdirp);

  rl.close();

  return 0;
};

const args = process.argv.slice(2);
main(...args).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
