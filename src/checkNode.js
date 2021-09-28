const fetch = require('node-fetch')

function isStuck ({ numberOfBlocks, lastBlockchainFeederHeight }) {
  return numberOfBlocks - lastBlockchainFeederHeight > 1
}

function isSyncedWithReferenceNode ({ status, referenceStatus }) {
  return Math.abs(status.numberOfBlocks - referenceStatus.numberOfBlocks) <= 1
}

async function fetchBlockChainStatus ({ node }) {
  let host = node
  if (!node.endsWith('/')) {
    host += '/'
  }

  const response = await fetch(`${host}burst?requestType=getBlockchainStatus`)
  if (!response.ok) {
    throw new Error(`Could not reach node: ${response.statusText}`)
  }
  return response.json()
}

async function checkNode ({ node, referenceNode }) {

  const status = await fetchBlockChainStatus({ node })
  if (isStuck(status)) {
    throw new Error(`Node [${node}] is stuck`)
  }

  const referenceStatus = await fetchBlockChainStatus({ node: referenceNode })

  console.info(new Date().toISOString(), node, status.numberOfBlocks, referenceNode, referenceStatus.numberOfBlocks)

  if (!isSyncedWithReferenceNode({ status, referenceStatus })) {
    throw new Error(`Nodes [${node}] and [${referenceNode}] are not synced`)
  }

}

module.exports = {
  checkNode
}
