# signum-node-health-check
A small tool to check a nodes health, i.e. if it's in sync etc.

# Install

> Prerequisites: Need NodeJS 14+ installed

To install just type:  `npm i signum-node-health-check -g`

The checker will be installed as command line tool `signumhealth`

# Usage

`signumhealth --help` to show the help options.

```bash
Usage: signumhealth [options]

Options:
  -V, --version              output the version number
  -n, --node <url>           Signum Node Host
  -s, --script <scriptPath>  A path to an executable command or script to be
                             executed on failed health check
  -r, --referenceNode <url>  A reference node to compare to (default:
                             "https://wallet.burstcoin.ro")
  -h, --help                 display help for command
```

## Examples

### Checking current state

```bash
$ signumhealth -n https://brazil.signum.network

# 2021-05-20T20:47:17.090Z https://brazil.signum.network 884947 https://wallet.burstcoin.ro 884947
# ✅ All fine
```

In case of error it might look something like this

```bash
2021-05-20T20:43:07.953Z https://brazil.signum.network 884940 https://wallet.burstcoin.ro 884946
2021-05-20T20:43:07.957Z Health Check failed Error: Nodes [https://brazil.signum.network] and [https://wallet.burstcoin.ro] are not synced
    at checkNode (/home/ohager/.nvm/versions/node/v14.12.0/lib/node_modules/signum-node-health-check/src/checkNode.js:37:11)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    at async /home/ohager/.nvm/versions/node/v14.12.0/lib/node_modules/signum-node-health-check/src/index.js:16:12
```

### Executing a script in case of error

Use the `-s` or `--script` option

```bash
$ signumhealth -n https://brazil.signum.network -s ./myscript.sh
```

The error will be passed as argument to the script, so you can do something like this

```bash
#!/bin/bash
echo "$1" | mail -s "Signum Health Check Failure" development@signum.network
```

Which sends an email (using ssmtp tool) in case of an error. 
This way it's a pretty flexible thing and combined with a cron job you can frequently 
monitor a nodes health. Keep in mind that block times are about 240 secs, when setting up the cron job.

