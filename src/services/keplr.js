import {
  AccountSetBase,
  ChainStore,
  getKeplrFromWindow
} from "@keplr-wallet/stores";
import { cmst, comdex, harbor } from "../config/network";

const getCurrencies = (chain) => {
  if (chain?.rpc === comdex?.rpc) {
    return [
      {
        coinDenom: chain?.coinDenom,
        coinMinimalDenom: chain?.coinMinimalDenom,
        coinDecimals: chain?.coinDecimals,
      },
      {
        coinDenom: cmst?.coinDenom,
        coinMinimalDenom: cmst?.coinMinimalDenom,
        coinDecimals: cmst?.coinDecimals,
      },
      {
        coinDenom: harbor?.coinDenom,
        coinMinimalDenom: harbor?.coinMinimalDenom,
        coinDecimals: harbor?.coinDecimals,
      },
    ];
  } else {
    return [
      {
        coinDenom: chain?.coinDenom,
        coinMinimalDenom: chain?.coinMinimalDenom,
        coinDecimals: chain?.coinDecimals,
      },
    ];
  }
};

export const getChainConfig = (chain = comdex) => {
  return {
    chainId: chain?.chainId,
    chainName: chain?.chainName,
    rpc: chain?.rpc,
    rest: chain?.rest,
    stakeCurrency: {
      coinDenom: chain?.coinDenom,
      coinMinimalDenom: chain?.coinMinimalDenom,
      coinDecimals: chain?.coinDecimals,
    },
    walletUrlForStaking: chain?.walletUrlForStaking,
    bip44: {
      coinType: chain?.coinType,
    },
    bech32Config: {
      bech32PrefixAccAddr: `${chain?.prefix}`,
      bech32PrefixAccPub: `${chain?.prefix}pub`,
      bech32PrefixValAddr: `${chain?.prefix}valoper`,
      bech32PrefixValPub: `${chain?.prefix}valoperpub`,
      bech32PrefixConsAddr: `${chain?.prefix}valcons`,
      bech32PrefixConsPub: `${chain?.prefix}valconspub`,
    },
    currencies: getCurrencies(chain),
    feeCurrencies: [
      {
        coinDenom: chain?.coinDenom,
        coinMinimalDenom: chain?.coinMinimalDenom,
        coinDecimals: chain?.coinDecimals,
        coinGeckoId: chain?.coinGeckoId,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    coinType: chain?.coinType,
  };
};

export const initializeChain = (callback) => {
  (async () => {
    if (!window?.leap?.getOfflineSigner || !window.wallet) {
      const error = "Please install leap extension extension";
      callback(error);
    } else {
      if (window.leap.experimentalSuggestChain) {
        try {
          await window.leap.experimentalSuggestChain(getChainConfig());
          const offlineSigner = window?.leap?.getOfflineSigner(comdex?.chainId);
          const accounts = await offlineSigner.getAccounts();

          callback(null, accounts[0]);
        } catch (error) {
          callback(error?.message);
        }
      } else {
        const versionError = "Please use the recent version of keplr extension";
        callback(versionError);
      }
    }
  })();
};

export const initializeIBCChain = (config, callback) => {
  (async () => {
    if (!window?.leap?.getOfflineSigner || !window.wallet) {
      const error = "Please install leap extension extension";

      callback(error);
    } else {
      if (window.leap.experimentalSuggestChain) {
        try {
          await window.leap.experimentalSuggestChain(config);
          const offlineSigner = window?.leap?.getOfflineSigner(config?.chainId);
          const accounts = await offlineSigner.getAccounts();
          callback(null, accounts[0]);
        } catch (error) {
          callback(error?.message);
        }
      } else {
        const versionError = "Please use the recent version of keplr extension";
        callback(versionError);
      }
    }
  })();
};

export const fetchKeplrAccountName = async () => {
  const chainStore = new ChainStore([getChainConfig()]);

  const accountSetBase = new AccountSetBase(
    {
      // No need
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    chainStore,
    comdex?.chainId,
    {
      suggestChain: false,
      autoInit: true,
      getKeplr: getKeplrFromWindow,
    }
  );

  // Need wait some time to get the Keplr.
  await (() => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  })();

  return accountSetBase?.name;
};
