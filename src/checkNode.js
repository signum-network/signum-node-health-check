const fetch = require('node-fetch')

async function fetchBlock ({ node, height }) {
  let host = node
  if (!node.endsWith('/')) {
    host += '/'
  }

  const url = height !== undefined ? `${host}api?requestType=getBlock&height=${height}` : `${host}api?requestType=getBlock`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Could not reach node: ${response.statusText}`)
  }
  return response.json()
}

async function fetchLatestBlock ({ node }) {
  return fetchBlock({ node })
}

async function checkNode ({ node, referenceNode }) {
  let status = 'SYNCED'
  const [block, referenceBlock] = await Promise.all([
    fetchLatestBlock({ node }),
    fetchLatestBlock({ node: referenceNode })
  ])

  console.info(new Date().toISOString())
  console.info( node, '- height:', block.height,)
  console.info( referenceNode, '- height:', referenceBlock.height)

  const blockDiff = referenceBlock.height - block.height
  if (blockDiff < 0) {
    throw new Error(`Node [${node}] is ahead of Node [${referenceNode}] - Try choosing another reference node`)
  }
  let currentReferenceBlock = referenceBlock
  if (blockDiff > 0) {
    status = 'SYNCING'
    console.info(`Node [${node}] is ${blockDiff} block(s) behind of Node [${referenceNode}] - syncing...`)
    currentReferenceBlock = await fetchBlock({ node: referenceNode, height: block.height })
  }
  console.info('Signature Check:')
  console.info(node, `- signature (height: ${block.height}):`, block.blockSignature)
  console.info(referenceNode, `- signature (height: ${currentReferenceBlock.height}):`, currentReferenceBlock.blockSignature)
  if (block.blockSignature !== currentReferenceBlock.blockSignature) {
    throw new Error(`Node [${node}] is forked from [${referenceNode}] - Try popping off to get in sync again`)
  }

  return {
    status
  }
}

module.exports = {
  checkNode
}
