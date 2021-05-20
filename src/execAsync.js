const {spawn} = require('child_process');

const STDIO_OPTIONS = {stdio: 'inherit'};

function execAsync(cmd, args, opts = STDIO_OPTIONS ) {
    return new Promise((resolve, reject) => {
        const commandLine = `${cmd} ${args.join(" ")}`
        console.log(`Executing [${commandLine}]`);
        const process = spawn(cmd, args, opts);
        process.on('close', (code) => {
            if (code !== 0) {
                reject(`${commandLine} failed - Code: ${code}`);
            } else {
                resolve();
            }
        })
    });
}

module.exports = {
    execAsync
}

