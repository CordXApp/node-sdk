'use strict';

const ora = require('ora');
const chalk = require('chalk'); 
const { RequestClient } = require('../..');

module.exports.get_method = async function() {
    const wait = (time) => new Promise(resolve => setTimeout(() => resolve(), time));

    const logs = ora('creating new request client');
    const logs2 = ora('attempting to send a get request to: api.cordx.lol')
    const logs3 = ora('all tests complete, cleaning up tasks.')

    logs.start();

    await wait(5000);

    const client = new RequestClient();

    if (client) setTimeout(() => {
        logs.stopAndPersist({
            text: chalk.green('  request client created successfully'),
            symbol: '✔️'
        })
    }, 5000);

    else if (!client) setTimeout(() => {
        logs.stopAndPersist({
            text: chalk.red('  failed to create request client'),
            symbol: '❌'
        })
    }, 5000);

    logs2.start();

    const res = await client.get('https://api.cordx.lol')

    await wait(5000);

    if (res.message && res.message !== '') setTimeout(() => {
        logs2.stopAndPersist({
            text: chalk.green(`  request successful, results: ${res.message}`),
            symbol: '✔️'
        })
    }, 5000)

    logs3.start();

    await wait(5000);

    logs3.stopAndPersist({
        text: chalk.green(' done, exiting.'),
        symbol: '✔️'
    });
}