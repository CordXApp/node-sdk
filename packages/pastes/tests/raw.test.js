const { PasteClient } = require('..');

async function start() {

    let paste = new PasteClient();

    let res = await paste.raw('ogubuxalur')
    
    await console.log(res);

    return console.log('done, test complete');
}

start();