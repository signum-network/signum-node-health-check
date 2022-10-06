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
  -s, --script <scriptPath>  A path to an executable command or script to be executed on failed health check
  -r, --referenceNode <url>  A reference node to compare to (default: "https://europe.signum.network")
  --nosslcheck               Disables ssl check
  -h, --help                 display help for command
```

## Examples

### Checking current state

```bash
signumhealth  -n https://brazil.signum.network
2022-10-06T12:53:42.300Z
https://brazil.signum.network - height: 1066154
https://europe.signum.network - height: 1066154
Signature Check:
https://brazil.signum.network - signature (height: 1066154): 610998114ebea5594846c88ace5321e0046a6ca6c55a35824d2762076bab3a0654350a98ef5721ee6926fb1dc65fc65a0391d00b29f6a7e5309c1667de51600b
https://europe.signum.network - signature (height: 1066154): 610998114ebea5594846c88ace5321e0046a6ca6c55a35824d2762076bab3a0654350a98ef5721ee6926fb1dc65fc65a0391d00b29f6a7e5309c1667de51600b
✅ Nodes are in sync
```

Or maybe this

```bash
signumhealth  -n  https://cyb3rsignum.freeddns.org:8125 
2022-10-06T12:53:42.300Z
https://cyb3rsignum.freeddns.org:8125 - height: 1005841
https://europe.signum.network - height: 1066155
Node [https://cyb3rsignum.freeddns.org:8125] is 60314 block(s) behind of Node [https://europe.signum.network] - syncing...
Signature Check:
https://cyb3rsignum.freeddns.org:8125 - signature (height: 1005841): 0de5c6c5d1ce17f5232c615e7548beecdb1197279cbc1f978c2cd47ec757b5063d6779c9c5c8db63ac34ebf4137107df9492ddadd84ba71e646d3187d0a1ba44
https://europe.signum.network - signature (height: 1005841): 0de5c6c5d1ce17f5232c615e7548beecdb1197279cbc1f978c2cd47ec757b5063d6779c9c5c8db63ac34ebf4137107df9492ddadd84ba71e646d3187d0a1ba44
⏳ https://cyb3rsignum.freeddns.org:8125 is still syncing, but all looks good.
```

In case of error it exits with code: -1 


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

