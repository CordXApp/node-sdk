import { logger } from '../utils/logger'
import { buildStatus } from '../utils/status'
import depcheck, { Results } from 'depcheck'

let BUILD_FAILED = { state: 'failed', message: 'Unable to lint dependencies,' }
let BUILD_PASSED = { state: 'passed', message: 'All dependencies are up to date,' }
let BUILD_PENDING = { state: 'pending', message: 'Checking dependencies, please wait...' }

interface Config {
    withoutDev: boolean
    ignoreBinPackage: boolean
    ignoreDirs: string[]
    ignoreMatches: string[]
    parsers?: any
    detectors?: any
    specials?: any
}

const lintydeps = async (rootPath: string, config: Config): Promise<void> => {
    logger.process(`Analysing dependencies in ${rootPath}...`)

    await buildStatus(BUILD_PENDING)

    depcheck(rootPath, config, async (unused: Results) => {
        const invalidFiles = Object.keys(unused.invalidFiles)
        const invalidDirs = Object.keys(unused.invalidDirs)
        const missingDependencies = Object.keys(unused.missing)
        const unusedDependencies = unused.dependencies
        const unusedDevDependencies = unused.devDependencies

        if (unusedDependencies.length) {
            logger.error(
                `\n ${unusedDependencies.length} Unused Dependencies: Declared in the package.json file, but not used by any code.`
            )
            unusedDependencies.forEach((fileName: string) => {
                console.log('  -- ', fileName)
            })
            BUILD_FAILED.message = `(${unusedDependencies.length}) Unused dependencies found.`
            await buildStatus(BUILD_FAILED)
            throw new Error(BUILD_FAILED.message)
        } else {
            logger.success('\n✓ No unused dependencies found.')
        }

        if (unusedDevDependencies.length) {
            logger.error(
                `\n ${unusedDevDependencies.length} Unused Dev Dependencies: Declared in the package.json file, but not used by any code.`
            )
            unusedDevDependencies.forEach((fileName: string) => {
                console.log('  -- ', fileName)
            })
            BUILD_FAILED.message = `(${unusedDevDependencies.length}) Unused dev dependencies found.`
            await buildStatus(BUILD_FAILED)
            throw new Error(BUILD_FAILED.message)
        } else {
            logger.success('\n✓ No unused dev dependencies found.')
        }

        if (missingDependencies.length) {
            logger.error(
                `\n ${missingDependencies.length} Missing Dependencies: is used somewhere in the code, but not declared in the package.json file.`
            )
            missingDependencies.forEach(fileName => {
                console.log('  -- ', fileName)
            })
            BUILD_FAILED.message = `(${missingDependencies.length}) Missing dependencies found.`
            await buildStatus(BUILD_FAILED)
            throw new Error(BUILD_FAILED.message)
        } else {
            logger.success('\n✓ No missing dependencies found.')
        }

        if (invalidFiles.length) {
            logger.warning(`\nFailed to parse ${invalidFiles.length} files`)
            invalidFiles.forEach(fileName => {
                console.log('  -- ', fileName)
            })
        }

        if (invalidDirs.length) {
            logger.warning(`Failed to parse ${invalidDirs.length} directories`)
            invalidDirs.forEach(fileName => {
                console.log('  -- ', fileName)
            })
        }

        await buildStatus(BUILD_PASSED)
    })
}

export default lintydeps
