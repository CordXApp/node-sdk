import path from 'path';
import fs from 'fs';
import stripComments from 'strip-json-comments';
import yaml from 'js-yaml';
import { defaultConfig } from './config/default';
import lintydeps from './client/lintydeps';
import yargs from 'yargs';

const CWD = process.cwd();
const argv = yargs.argv as { _: (string | number)[]; [key: string]: unknown };

function readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8').replace(/^\ufeff/, '');
}

let cliArguments = argv._;
if (cliArguments.length === 0) {
    console.error("Please provide the start location as 'linty <location>'. E.g., linty .");
} else {
    const dir = path.resolve(CWD, cliArguments[0] as string);
    const configFilePath = path.join(dir, '.ndcrc');
    let userConfig = {};
    let config = {};

    if (fs.existsSync(configFilePath) && fs.statSync(configFilePath).isFile()) {
        console.log("Config file `.lintyrc` found.\n");
        userConfig = yaml.load(stripComments(readFile(configFilePath))) || {};
    } else {
        console.log("Config file `.lintyrc` not found. Using default config.\nAdd '.lintyrc' file in your repo root if you wish to specify custom logic.\n");
    }

    config = { ...defaultConfig, ...userConfig };
    lintydeps(dir, config as any);
}