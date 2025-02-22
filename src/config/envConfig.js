export const envConfig = {
  rpc: "https://devnet.rpc.comdex.one",
  rest: "https://devnet.rest.comdex.one",
  chainId: "test-1",
  coinDenom: "CMDX",
  coinMinimalDenom: "ucmdx",
  coinDecimals: 6,
  prefix: "comdex",
  coinType: 118,
  chainName: "Comdex Test Chain",
  explorerUrlToTx: "https://dev-explorer.comdex.one/transactions/{txHash}",
  apiUrl: "https://test-stat.comdex.one",
  comdexStakingUrl: "https://comdex.omniflix.co/stake",
  webSocketApiUrl: "wss://devnet.rpc.comdex.one/websocket",
  symbol: "CMDX",

  commodo: {
    appId: 3,
    cswapAppId: 2,
    numberOfTopAssets: 3,
    websiteUrl: "https://devnet.commodo.one",
    cswapUrl: "https://devnet.cswap.one",
    rewardsUrl: "https://docs.commodo.one/rewards",
    atomCmdxPoolId: 1,
  },

  cSwap: {
    appId: 1,
    masterPoolId: 1,
    websiteUrl: "https://devnet.cswap.one",
    networkTag: "Devnet",
  },

  harbor: {
    title: "Harbor Protocol",
    websiteUrl: "https://devnet.harborprotocol.one",
    appId: 2,
    governanceContractAddress: "comdex17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgs4jg6dx",
    lockingContractAddress: "comdex1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqdfklyz",
    airdropContractAddress: "comdex1ghd753shjuwexxywmgs4xz7x2q732vcnkm6h2pyv9s6ah3hylvrqfy9rd8",
    harborAirdropApiUrl: "http://3.7.255.161",
    harborDashboardTVLApiUrl: " https://test-stat.comdex.one"
  },
};