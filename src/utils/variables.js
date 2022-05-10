const variables = {
  en: {
    // Sidebar menu
    dashboard: "Dashboard",
    myhome: "My Home",
    market: "Market",
    govern: "Govern",
    liquidation: "Liquidation",
    airdrop: "Airdrop",

    // Connect account
    connect: "Connect",
    connected: "Connected",
    testnet: "Devnet-2",
    mainnet: "Mainnet",
    connect_wallet: "Connect Wallet",
    keplr_wallet: "Keplr Wallet",
    balance_wallet: "Balance",
    address_wallet: "Address",
    disconnect: "Disconnect",
    disconnect_wallet: "Disconnect Wallet",
    yes: "Yes",
    no: "No",
    view_explore: "View Explorer",

    // Dashboard
    overview: "Overview",
    tvl: "Total Value Locked (TVL)",
    tv: "Total Value",
    collateral: "Collateral",
    liquidity: "Liquidity",
    pair_id: "Pair Id",
    cmdx_circulating_supply: "Circulating Supply",
    cmdx_market_cap: "Market Cap",
    cmdx_price: "CMDX Price",
    others: "OTHERS",
    staked: "Staked",
    casset_market_cap: "cAsset Market Cap",
    trading_fee: "Trading Fee",
    txn_fee: "TXN Fee",
    gold: "ucgold",
    silver: "Silver",
    crude_oil: "Crude Oil",
    price: "Price",
    trade: "Trade",
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
    //Banner
    decentralized: "Decentralized",
    synthetic_exchange: "Synthetics Exchange",
    platform: "Platform",
    find_out_more: "Find Out More",

    //Total volume
    total_volume: "TOTAL VOLUME",
    total_value_locked: "TOTAL VALUE LOCKED",
    total_liquidity: "Liquidity",
    total_collateral: "Collateral",

    // Balances
    total_claimable_rewards: "total claimable rewards",
    holding: "Holding",
    borrowed: "Borrowed",
    farming: "Farming",
    total_value: "Total Value",
    current_ltv: "Current LTV",
    cAsset_balance: "cAsset Balance",
    mint_balance: "Mint Balance",
    farm_balance: "Farm Balance",
    asset_balance: "Asset Balance",
    borrowing_power_used: "Borrowing Power Used",
    your_collateral: "Your Collateral",
    health_factor: "Health Factor",
    you_borrowed: "You Borrowed",
    borrow_information: "Borrow Information",
    cmdx: "cmdx",
    ust: "ust",
    atom: "atom",
    xprt: "xprt",
    USD: "USD",
    CMDX: "CMDX",
    deposit: "Deposit",
    withdraw: "Withdraw",
    draw: "Draw",
    repay: "Repay",
    deposit_collateral: "Deposit Collateral",
    withdraw_collateral: "Withdraw Collateral",
    draw_debt: "Draw Debt",
    repay_debt: "Repay Debt",
    closeVault: "Close Vault",
    collateral_type: "Collateral Type",
    add_remove: "Add/Remove",

    // Send
    receiver_address: "Reciepient address",
    receiver_address_placeholder: "Enter Reciepient's address",
    token: "Token",
    amount: "Amount",
    send: "Send",
    cancle: "Cancle",
    available: "Available",
    max: "Max",
    half: "Half",
    from: "From",
    to: "To",

    // Borrow Page
    edit: "Edit",
    close: "Close",
    borrow_cAssets: "Borrow cAssets",
    borrow_cAsset: "Borrow cAsset",
    choose_collateral: "Collateral Asset",
    collateral_asset:
      "Collateral asset may affect the minimum collateral ratio.",
    set_collateral_ratio: "Set a Collateral Ratio",
    liquidate_below_minimum:
      "Position will be liquidated if the collateral ratio moves below the minimum threshold",

    confirm_borrow_amount: "Confirm borrow amount",
    position_closed: "Position can be closed by repaying the borrowed amount.",
    asset_description: "",
    withdraw_amount: "Withdrawn Amount",
    burn_amount: "Burn Amount",

    // Farm Page
    collateral_ratio: "Collateral Ratio",
    borrowed_assets: "Borrowed Assets",
    remove: "Remove",
    remove_liquidity: " Remove Liquidity",
    long: "Long",
    short: "Short",
    provide_casset: "Provide cAsset",
    provide_ust: "Provide UST",
    provide: "Provide",
    total_amount: "Total amount",
    pool_details: "POOL DETAILS",
    your_details: "YOUR DETAILS",
    my_amount: "My amount",
    my_liquidity: "My liquidity",
    available_amount: "Available Amount ",
    available_lp: "Available LP",
    bonded_lp: "Bonded LP",
    manage_liquidity: "Manage Liquidity",
    unbond_token: "Unbond Token",
    unbond: "Unbond",
    bond: "Bond",
    start_earning : "Start Earning",
    bond_lptokens: "Bond LP Tokens",
    unbonding_period: "Unbonding Period",
    amount_to_unbond: "Amount to Unbond",
    amount_to_bond: "Amount to Bond",
    unbonding: "Unbonding",
    unbonding_duration: "Unbonding Duration",
    unbond_lp_token: "Unbond LP Token",
    unbonding_complete: "Unbonding Complete",
    // Swap Page
    limit_order: "Limit Order",
    pay: "Pay",
    balance: "Balance",
    tobuy: "To Buy",
    expected_price: "Expected Price",
    minimum_received: "Minimum Received",
    tx_fee: "Transaction Fee",
    tx_hash: "Transaction Hash",
    swap_fee: "Swap Fee",
    oracle_price: "Oracle Price",
    sell: "Sell",
    to_get: "To Get",
    buy: "Buy",
    price_per_gld: "Price per ucgold",
    spread: "Spread",
    slippage: "Slippage",
    commission: "Commission",
    swap: "Swap",
    swap_anyway: "Swap Anyway",
    oracle_price_tooltip: "Asset price feched from oracle",
    volume_tooltip: "24 hour trading volume for the Asset",
    premium_tooltip:
      "Difference between the Asset price in the pool and the oracle price",
    liquidity_tooltip: "Total liquidity for current Asset",
    estimated_slippage: "Estimated Slippage",

    // caution notice
    back: "Back",
    caution_header: "Caution Notice",
    sub_text:
      "Trading involves a significant risk of loss and is not suitable for all investors, in particular, past developments do not necessarily indicate future results",
    risk: "TRADE AT YOUR OWN RISK",
    read_and_understand:
      "I have read and understand these risks, and wish to proceed.",
    agree: "Agree",

    // Theme Switch
    switch_dark: "Enable dark mode",
    switch_light: "Enable light mode",
    poolSize: "Pool Size",
    poolLiquidity: "Pool Liquidity",
    apr: "APR",

    //Tooltip text
    tooltip_circulating_supply:
      "Circulating supply is the amount of CMDX available and circulating in the market.",
    tooltip_total_value:
      "Total value of all cAssets holdings, minted, farmed and asset balances across the platform",
    tooltip_total_value_locked:
      "Total value locked of collateral, liquidity and staked CMDX",
    tooltip_market_cap: "Market Cap = Current Price * Circulating Supply",
    tooltip_staked: "Total Value of Staked CMDX",
    tooltip_liquidity: "Total liquidity in cAsset pools",
    tooltip_collateral: "Total collateral locked for minted cAssets",
    // Mint
    tooltip_total_casset: "Total value of all cAssets held",
    tooltip_total_mint: "Total collateral value minus borrowed value",
    tooltip_total_farm: "Total value of all assets in liquidity pools",
    tooltip_total_asset: "Total value of native and IBC tokens in wallet",
    tooltip_cswap_price:
      "cSwap price calculated based on the pool price and spread",
    tooltip_tx_fee: "Fee paid to the protocol to execute this transaction",
    lq_ratio: "Liquidation Ratio",
    debt: "Debt", 
    casset: "cAsset",
    cswap_price: "cSwap Price",
    tooltip_burn_amount:
      "The minted cAsset will be burned to keep the protocol solvent once you withdraw your collateral",
    tooltip_withdraw_amount:
      "Amount of collateral redeemed for the borrowed cAsset",

    //Assets
    total_asset_balance: "Total Asset Balance",
    tx_success: "Transaction Successful",
    tx_failed: "Transaction Failed",
    asset_bought: "Asset Bought",
    asset_swap: "Asset Swapped",

    // Govern Page
    banner_paira:
      "Stake your CMDX tokens to earn rewards and participate in governance proposals",
    yield_card_text:
      "  Yield smarter with Unagii, the automated DeFi yield platform redefining the way you earn.",
    omniflix_card_text:
      "OmniFlix Network is a trusted Proof-of-Stake infrastructure provider and validator to comfortably stake your coins and earn rewards.",
    manage_stake: " Manage Stake",

    // More Page
    details: "Details",
    filter: "Filter",
    campaign: "Campaign",
  },
};

export default variables;
