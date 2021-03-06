const BigNumber = require('bignumber.js')

module.exports = async ({ web3, getNamedAccounts, deployments, getChainId, artifacts }) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const config = require('../deploy-configs/get-network-config')

  const mphTokenDeployment = await get('MPHToken')

  const deployResult = await deploy('MPHMinter', {
    from: deployer,
    args: [
      mphTokenDeployment.address,
      config.govTreasury,
      config.devWallet,
      BigNumber(config.devRewardMultiplier).toFixed()
    ]
  })
  if (deployResult.newlyDeployed) {
    log(`MPHMinter deployed at ${deployResult.address}`)

    const MPHToken = artifacts.require('MPHToken')
    const mphTokenContract = await MPHToken.at(mphTokenDeployment.address)
    await mphTokenContract.transferOwnership(deployResult.address, { from: deployer })
  }
}
module.exports.tags = ['MPHMinter', 'MPHRewards']
module.exports.dependencies = ['MPHToken']
