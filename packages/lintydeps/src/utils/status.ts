import superagent from 'superagent'
import { logger } from './logger'
import yargs from 'yargs'

interface BuildData {
    state: string
    message: string
}

interface Argv {
    token: string
    [key: string]: unknown
}

const argv = yargs.option('token', {
    type: 'string',
    description: 'GitHub personal access token',
    demandOption: true
}).argv as Argv

/**
 * Update the build status on GitHub using the GitHub API and Travis CI environment variables
 * @param {BuildData} data - The build data
 * @returns {Promise<void>}
 */
export const buildStatus = async (data: BuildData): Promise<void> => {
    const ORG_NAME = process.env.TRAVIS_REPO_SLUG?.split('/')[0]
    const REPO_NAME = process.env.TRAVIS_REPO_SLUG?.split('/')[1]
    const COMMIT_SHA = process.env.TRAVIS_COMMIT
    const BUILD_ID = process.env.TRAVIS_BUILD_ID
    const AUTH_TOKEN = process.env[argv.token || 'GITHUB_PERSONAL_TOKEN']

    if (ORG_NAME && REPO_NAME && COMMIT_SHA && BUILD_ID && AUTH_TOKEN) {
        const url = `https://api.github.com/repos/${ORG_NAME}/${REPO_NAME}/statuses/${COMMIT_SHA}`
        const body = {
            state: data.state,
            target_url: `https://travis-ci.com/${ORG_NAME}/${REPO_NAME}/builds/${BUILD_ID}`,
            description: data.message,
            context: '[lintydeps]: Dependency check'
        }

        try {
            await superagent.post(url).set('Authorization', `token ${AUTH_TOKEN}`).send(body)
            logger.success(`Build status updated to ${data.state}`)
        } catch (error: any) {
            logger.error(`Failed to update build status: ${error.message}`)
        }
    }
}
