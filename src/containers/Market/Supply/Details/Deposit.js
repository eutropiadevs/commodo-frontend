import { Button, message, Select, Spin } from "antd";
import Long from "long";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { setBalanceRefresh } from "../../../../actions/account";
import { Col, NoDataIcon, Row, SvgIcon } from "../../../../components/common";
import CustomRow from "../../../../components/common/Asset/CustomRow";
import Details from "../../../../components/common/Asset/Details";
import AssetStats from "../../../../components/common/Asset/Stats";
import Snack from "../../../../components/common/Snack";
import CustomInput from "../../../../components/CustomInput";
import { comdex } from "../../../../config/network";
import { ValidateInputNumber } from "../../../../config/_validation";
import {
  APP_ID,
  DEFAULT_FEE,
  DOLLAR_DECIMALS
} from "../../../../constants/common";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import { defaultFee } from "../../../../services/transaction";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance
} from "../../../../utils/coin";
import { commaSeparator, marketPrice } from "../../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../../utils/string";
import variables from "../../../../utils/variables";
import "./index.less";

const { Option } = Select;

const DepositTab = ({
  lang,
  dataInProgress,
  pool,
  assetMap,
  balances,
  address,
  markets,
  setBalanceRefresh,
  refreshBalance,
  assetDenomMap,
  userLendList,
}) => {
  const [assetList, setAssetList] = useState();
  const [selectedAssetId, setSelectedAssetId] = useState();
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [lendToAssetIdMap, setLendToAssetIdMap] = useState(false);
  const navigate = useNavigate();

  const availableBalance =
    getDenomBalance(balances, assetMap[selectedAssetId]?.denom) || 0;

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.transitAssetIds?.main?.toNumber()],
        assetMap[pool?.transitAssetIds?.first?.toNumber()],
        assetMap[pool?.transitAssetIds?.second?.toNumber()],
      ]);

      if (assetMap[pool?.transitAssetIds?.main?.toNumber()]?.id?.toNumber()) {
        handleAssetChange(pool?.transitAssetIds?.main?.toNumber());
      }
    }
  }, [pool, assetMap]);

  useEffect(() => {
    const lendAssetIdMap = userLendList?.reduce((map, obj) => {
      map[obj?.assetId?.toNumber()] = obj;
      return map;
    }, {});

    setLendToAssetIdMap(lendAssetIdMap);
  }, [userLendList]);

  const handleAssetChange = (value) => {
    setSelectedAssetId(value);
    setAmount(0);
    setValidationError();
  };

  const handleInputChange = (value) => {
    value = toDecimals(value, assetMap[selectedAssetId]?.decimals)
      .toString()
      .trim();

    setAmount(value);
    setValidationError(
      ValidateInputNumber(
        getAmount(value, assetMap[selectedAssetId]?.decimals),
        availableBalance
      )
    );
  };

  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.lend.v1beta1.MsgLend",
          value: {
            appId: Long.fromNumber(APP_ID),
            lender: address,
            poolId: pool?.poolId,
            assetId: Long.fromNumber(selectedAssetId),
            amount: {
              amount: getAmount(amount, assetMap[selectedAssetId]?.decimals),
              denom: assetMap[selectedAssetId]?.denom,
            },
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        setAmount(0);
        if (error) {
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }

        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );

        setBalanceRefresh(refreshBalance + 1);
        navigate("/myhome");
      }
    );
  };

  const handleMaxClick = () => {
    if (assetMap[selectedAssetId]?.denom === comdex.coinMinimalDenom) {
      return Number(availableBalance) > DEFAULT_FEE
        ? handleInputChange(
            amountConversion(
              availableBalance - DEFAULT_FEE,
              assetDenomMap[assetMap[selectedAssetId]?.denom]?.decimals
            )
          )
        : handleInputChange();
    } else {
      return handleInputChange(
        amountConversion(
          availableBalance,
          assetDenomMap[assetMap[selectedAssetId]?.denom]?.decimals
        )
      );
    }
  };

  let currentLendingId =
    lendToAssetIdMap[selectedAssetId]?.lendingId?.toNumber();

  return (
    <div className="details-wrapper">
      {!dataInProgress ? (
        <>
          <div className="details-left commodo-card">
            <CustomRow assetList={assetList} poolId={pool?.poolId?.low} />
            <div className="assets-select-card mb-0">
              <div className="assets-left">
                <label className="left-label">Lend</label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    popupClassName="asset-select-dropdown"
                    onChange={handleAssetChange}
                    value={selectedAssetId}
                    placeholder={
                      <div className="select-placeholder">
                        <div className="circle-icon">
                          <div className="circle-icon-inner" />
                        </div>
                        Select
                      </div>
                    }
                    defaultActiveFirstOption={true}
                    suffixIcon={
                      <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                    }
                    notFoundContent={<NoDataIcon />}
                  >
                    {assetList?.length > 0 &&
                      assetList?.map((record) => {
                        const item = record?.denom ? record?.denom : record;

                        return (
                          <Option key={item} value={record?.id?.toNumber()}>
                            <div className="select-inner">
                              <div className="svg-icon">
                                <div className="svg-icon-inner">
                                  <SvgIcon name={iconNameFromDenom(item)} />
                                </div>
                              </div>
                              <div className="name">
                                {denomConversion(item)}
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
              <div className="assets-right">
                <div className="label-right">
                  Available
                  <span className="ml-1">
                    {amountConversionWithComma(
                      getDenomBalance(
                        balances,
                        assetMap[selectedAssetId]?.denom
                      ) || 0
                    )}{" "}
                    {denomConversion(assetMap[selectedAssetId]?.denom)}
                  </span>
                  <div className="max-half">
                    <Button className="active" onClick={handleMaxClick}>
                      Max
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="input-select">
                    <CustomInput
                      value={amount}
                      onChange={(event) =>
                        handleInputChange(event.target.value)
                      }
                      validationError={validationError}
                    />
                  </div>
                  $
                  {commaSeparator(
                    Number(
                      amount *
                        marketPrice(
                          markets,
                          assetMap[selectedAssetId]?.denom,
                          selectedAssetId
                        ) || 0
                    ).toFixed(DOLLAR_DECIMALS)
                  )}{" "}
                </div>
              </div>
            </div>
            <Row>
              <Col sm="12" className="mt-3 mx-auto card-bottom-details">
                {!!currentLendingId ? (
                  <div>
                    {" "}
                    Lend position exists, try{" "}
                    <Button
                      onClick={() =>
                        navigate(`/myhome/deposit/${currentLendingId}`)
                      }
                      type="primary"
                      size="small"
                    >
                      Deposit
                    </Button>
                  </div>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col sm="12" className="mt-3 mx-auto card-bottom-details">
                <AssetStats
                  assetId={selectedAssetId}
                  pool={pool}
                  parent="lend"
                />
              </Col>
            </Row>
            <div className="assets-form-btn">
              <Button
                type="primary"
                className="btn-filled"
                loading={inProgress}
                disabled={
                  !Number(amount) ||
                  validationError?.message ||
                  inProgress ||
                  !selectedAssetId ||
                  currentLendingId
                }
                onClick={handleClick}
              >
                Lend
              </Button>
            </div>
          </div>
          <div className="details-right">
            <div className="commodo-card">
              <Details
                asset={assetMap[pool?.transitAssetIds?.first?.toNumber()]}
                poolId={pool?.poolId}
                parent="lend"
              />
              <div className="mt-5">
                <Details
                  asset={assetMap[pool?.transitAssetIds?.second?.toNumber()]}
                  poolId={pool?.poolId}
                  parent="lend"
                />
              </div>
            </div>
            <div className="commodo-card">
              <Details
                asset={assetMap[pool?.transitAssetIds?.main?.toNumber()]}
                poolId={pool?.poolId}
                parent="lend"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="loader">
          <Spin />
        </div>
      )}
    </div>
  );
};

DepositTab.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  assetDenomMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  markets: PropTypes.object,
  pool: PropTypes.shape({
    poolId: PropTypes.shape({
      low: PropTypes.number,
    }),
    mainAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
    firstBridgedAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
    secondBridgedAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
  refreshBalance: PropTypes.number.isRequired,
  userLendList: PropTypes.arrayOf(
    PropTypes.shape({
      amountIn: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      assetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      poolId: PropTypes.shape({
        low: PropTypes.number,
      }),
      rewardAccumulated: PropTypes.string,
    })
  ),
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pool: state.lend.pool._,
    assetMap: state.asset._.map,
    balances: state.account.balances.list,
    lang: state.language,
    markets: state.oracle.market,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
    userLendList: state.lend.userLends,
  };
};

const actionsToProps = { setBalanceRefresh };

export default connect(stateToProps, actionsToProps)(DepositTab);
