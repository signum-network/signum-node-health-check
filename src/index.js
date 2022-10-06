const { checkNode } = require('./checkNode')
const { version } = require('../package.json')
const program = require('commander')
const { execAsync } = require('./execAsync')

const opts = program
  .version(version)
  .requiredOption('-n, --node <url>', 'Signum Node Host')
  .option('-s, --script <scriptPath>', 'A path to an executable command or script to be executed on failed health check')
  .option('-r, --referenceNode <url>', 'A reference node to compare to', 'https://europe.signum.network')
  .option('--nosslcheck', 'Disables ssl check')
  .parse()
  .opts();

if(opts.nosslcheck){
  console.info('Disable SSL check')
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

(async () => {
  try {
    const {status} = await checkNode(opts)
    if(status === 'SYNCED'){
      console.info('✅ Nodes are in sync')
    }
    if(status === 'SYNCING'){
      console.info(`⏳ ${opts.node} is still syncing, but all looks good.`)
    }
  } catch (e) {
    console.error('❌', new Date().toISOString(), 'Health Check failed', e.message)
    if(opts.script){
      await execAsync(opts.script, [e])
    }
    process.exit(-1)
  }
})()
