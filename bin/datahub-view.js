#!/usr/bin/env node

const { join } = require('path');
const { spawn } = require('child_process');

const cwd = join(require.resolve('..'), '..', '..');
spawn('npm', ['run', 'dev'], { cwd });

