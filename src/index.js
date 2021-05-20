const { checkNode } = require('./checkNode')
const { version } = require('../package.json')
const program = require('commander')
const { execAsync } = require('./execAsync')

const opts = program
  .version(version)
  .requiredOption('-n, --node <url>', 'Signum Node Host')
  .option('-s, --script <scriptPath>', 'A path to an executable command or script to be executed on failed health check')
  .option('-r, --referenceNode <url>', 'A reference node to compare to', 'https://wallet.burstcoin.ro')
  .parse()
  .opts();

(async () => {
  try {
    return await checkNode(opts)
  } catch (e) {
    console.error(new Date().toISOString(), 'Health Check failed', e)
    if(opts.script){
      await execAsync(opts.script, [e])
    }
  }
})()
