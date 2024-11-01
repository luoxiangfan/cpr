# cpr
The cp -r command implementation for node.

## Installation

```js
npm install node-cpr
```

## Usage

```js
import { cpr } from 'node-cpr'
// or
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { cpr } = require('node-cpr')

cpr('example.js', 'dirname')

cpr('source/dir', 'dest/dir')

cpr('example.js', 'dirname/rename.js')

cpr(['example.js', 'src/'], 'dirname')
```

### Command Line Interface

```
Usage: node-cpr [OPTION]... SOURCE... DIRECTORY
Copy Single File to DEST File.
Copy SOURCE(s) FILE or DIRECTORY to DEST DIRECTORY.
Overwrite if the DEST FILE or DIRECTORY exist.

  -h --help            Usage information
  -v --version         output version information and exit
