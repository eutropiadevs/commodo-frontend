import { List, message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setAssetStatMap } from "../../../actions/asset";
import { ibcDenoms } from "../../../config/network";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import {
  queryAssetPoolFundBalance,
  queryModuleBalance,
  QueryPoolAssetLBMapping
} from "../../../services/lend/query";
import {
  amountConversion,
  commaSeparatorWithRounding,
  denomConversion
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice
} from "../../../utils/number";
import { iconNameFromDenom } from "../../../utils/string";
import DistributionAPY from "../DistributionAPY";
import { SvgIcon, TooltipIcon } from "../index";

const Details = ({
  asset,
  poolId,
  markets,
  refreshBalance,
  parent,
  assetDenomMap,
  setAssetStatMap,
}) => {
  const [stats, setStats] = useState();
  const [moduleBalanceStats, setModuleBalanceStats] = useState([]);
  const [assetPoolFunds, setAssetPoolFunds] = useState({});

  useEffect(() => {
    if (asset?.id && poolId) {
      QueryPoolAssetLBMapping(asset?.id, poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setStats(result?.PoolAssetLBMapping);
      });

      queryAssetPoolFundBalance(asset?.id, poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setAssetPoolFunds(result?.amount);
      });
    } else if (stats?.poolId) {
      setStats();
    }
  }, [asset, poolId, refreshBalance]);

  useEffect(() => {
    if (poolId) {
      queryModuleBalance(poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setModuleBalanceStats(result?.ModuleBalance?.moduleBalanceStats);
      });
    }
  }, [poolId, refreshBalance]);

  let assetStats = moduleBalanceStats?.filter(
    (item) => item?.assetId?.toNumber() === asset?.id?.toNumber()
  )[0];

  useEffect(() => {
    setAssetStatMap(asset?.id, assetStats?.balance);
  }, [assetStats]);

  let data = [
    {
      title: parent === "lend" ? "Deposited" : "Borrowed",
      counts: `$${commaSeparatorWithRounding(
        Number(
          amountConversion(
            (parent === "lend" ? stats?.totalLend : stats?.totalBorrowed) || 0
          ) *
            marketPrice(markets, asset?.denom, assetDenomMap[asset?.denom]?.id),
          assetDenomMap[asset?.denom]?.decimals
        ) +
          (parent === "lend"
            ? Number(
                amountConversion(
                  assetPoolFunds?.amount,
                  assetDenomMap[assetPoolFunds?.denom]?.decimals
                ) *
                  marketPrice(
                    markets,
                    assetPoolFunds?.denom,
                    assetDenomMap[assetPoolFunds?.denom]?.id
                  )
              )
            : 0),
        DOLLAR_DECIMALS
      )}`,
      tooltipText:
        parent === "lend" ? "Total funds Deposited" : "Total funds Borrowed",
    },
    {
      title: "Available",
      counts: `$${commaSeparatorWithRounding(
        Number(
          amountConversion(
            marketPrice(
              markets,
              assetStats?.balance?.denom,
              assetDenomMap[assetStats?.balance?.denom]?.id
            ) * assetStats?.balance.amount || 0,
            assetDenomMap[assetStats?.balance?.denom]?.decimals
          )
        ),
        DOLLAR_DECIMALS
      )}`,
      tooltipText:
        parent === "lend" ? "Total funds Available" : "Total funds Available",
    },
    {
      title: "Utilization",
      counts: (
        <>
          {Number(decimalConversion(stats?.utilisationRatio) * 100).toFixed(
            DOLLAR_DECIMALS
          )}
          %
        </>
      ),
      tooltipText:
        parent === "lend" ? "Asset Utilization" : "Asset Utilization",
    },
    {
      title: parent === "lend" ? "Lend APY" : "Borrow APY",
      counts: (
        <>
          <>
            {Number(
              decimalConversion(
                parent === "lend" ? stats?.lendApr : stats?.borrowApr
              ) * 100
            ).toFixed(DOLLAR_DECIMALS)}
            %
          </>
          {/* TODO: take the condition dynamically */}
          {parent === "lend" ? null : asset?.denom === "uatom" ||
            asset?.denom === ibcDenoms["uatom"] ||
            asset?.denom === "ucmst" ? (
            <DistributionAPY
              assetId={asset?.id}
              poolId={poolId}
              margin={"top"}
            />
          ) : null}
        </>
      ),
      tooltipText:
        parent === "lend" ? "Lend APY of Asset" : "Borrow APY of Asset",
    },
  ];

  return (
    <>
      <div className="card-head">
        <div className="head-left">
          <div className="assets-col">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(asset?.denom)} />
            </div>
            {denomConversion(asset?.denom)}
          </div>
        </div>
        <div className="head-right">
          <span>Oracle Price</span> : $
          {commaSeparator(
            Number(
              marketPrice(
                markets,
                asset?.denom,
                assetDenomMap[asset?.denom]?.id
              )
            ).toFixed(DOLLAR_DECIMALS)
          )}
        </div>
      </div>
      <List
        grid={{
          gutter: 16,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div>
              <p>
                {item.title} <TooltipIcon text={item.tooltipText} />
              </p>
              <h3>{item.counts}</h3>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

Details.propTypes = {
  refreshBalance: PropTypes.number.isRequired,
  setAssetStatMap: PropTypes.func.isRequired,
  asset: PropTypes.shape({
    denom: PropTypes.string,
  }),
  assetDenomMap: PropTypes.object,
  markets: PropTypes.object,
  parent: PropTypes.string,
  poolId: PropTypes.shape({
    low: PropTypes.number,
  }),
};

const stateToProps = (state) => {
  return {
    markets: state.oracle.market,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {
  setAssetStatMap,
};

export default connect(stateToProps, actionsToProps)(Details);
