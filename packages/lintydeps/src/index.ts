import path from 'path'
import fs from 'fs'
import stripComments from 'strip-json-comments'
import yaml from 'js-yaml'
import { defaultConfig } from './config/default'
import lintydeps from './client/lintydeps'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const CWD = process.cwd()
const argv = yargs(hideBin(process.argv)).argv as { _: (string | number)[]; [key: string]: unknown }

const CONFIG_FILE_NAME = '.lintyrc'
const CONFIG_NOT_FOUND_MESSAGE = `Config file \`${CONFIG_FILE_NAME}\` not found. Using default config.\nAdd \`${CONFIG_FILE_NAME}\` file in your repo root if you wish to specify custom logic.\n`

interface Config {
    [key: string]: unknown
}

function readFile(filePath: string): string {
    try {
        return fs.readFileSync(filePath, 'utf8').replace(/^\ufeff/, '')
    } catch (error) {
        console.error(`Error reading file at ${filePath}:`, error)
        throw error
    }
}

function loadConfig(configFilePath: string): Config {
    if (fs.existsSync(configFilePath) && fs.statSync(configFilePath).isFile()) {
        console.log(`Config file \`${CONFIG_FILE_NAME}\` found.\n`)
        try {
            const fileContent = readFile(configFilePath)
            return (yaml.load(stripComments(fileContent)) as Config) || {}
        } catch (error) {
            console.error(`Error parsing config file at ${configFilePath}:`, error)
            throw error
        }
    } else {
        console.log(CONFIG_NOT_FOUND_MESSAGE)
        return {}
    }
}

function main() {
    const cliArguments = argv._
    if (cliArguments.length === 0) {
        console.error("Please provide the start location as 'linty <location>'. E.g., linty .")
        process.exit(1)
    }

    const dir = path.resolve(CWD, cliArguments[0] as string)
    const configFilePath = path.join(dir, CONFIG_FILE_NAME)
    const userConfig = loadConfig(configFilePath)
    const config = { ...defaultConfig, ...userConfig }

    lintydeps(dir, config)
}

main()
