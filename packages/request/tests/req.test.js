const { RequestClient } = require('..');

async function start() {

    await console.log('starting request test.');

    let send = new RequestClient();

    await console.log('request client initialized');

    let response = await send.request('https://api.cordx.lol', 'GET');

    await console.log('response successful')
    
    await console.log('results ' + response.message);

    return console.log('tests complete');
}

start()