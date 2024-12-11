import chalk from "chalk";

const color = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    process: chalk.cyan,
    error: chalk.red,
};

const logMessage = (type: keyof typeof color, message: string) => {
    console.log(color[type](message));
};

export const logger = {
    info: (message: string) => logMessage('info', message),
    success: (message: string) => logMessage('success', message),
    warning: (message: string) => logMessage('warning', message),
    process: (message: string) => logMessage('process', message),
    error: (message: string) => logMessage('error', message),
};