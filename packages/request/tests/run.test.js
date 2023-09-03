'use strict';
const { get_method } = require('./workers/get.test');
const wait = (time) => new Promise(resolve => setTimeout(() => resolve(), time)); 

async function startTests() {
    await get_method();
}

startTests();