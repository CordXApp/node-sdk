const { PasteClient } = require('..');

async function start() {

    let paste = new PasteClient();

    let res = await paste.post('Hello there everyone')
    
    await console.log(res.key);

    return console.log('done, test complete');
}

start();
