import { Button, Select } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setBalanceRefresh } from "../../../actions/account";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import CustomRow from "../../../components/common/Asset/CustomRow";
import Details from "../../../components/common/Asset/Details";
import CustomInput from "../../../components/CustomInput";
import HealthFactor from "../../../components/HealthFactor";
import { comdex } from "../../../config/network";
import { ValidateInputNumber } from "../../../config/_validation";
import { DEFAULT_FEE, DOLLAR_DECIMALS } from "../../../constants/common";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance
} from "../../../utils/coin";
import { commaSeparator, marketPrice } from "../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import ActionButton from "./ActionButton";
import "./index.less";

const { Option } = Select;

const RepayTab = ({
  lang,
  dataInProgress,
  borrowPosition,
  pool,
  assetMap,
  balances,
  address,
  refreshBalance,
  setBalanceRefresh,
  markets,
  pair,
}) => {
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [assetList, setAssetList] = useState();

  const selectedAssetId = pair?.assetOut?.toNumber();
  const availableBalance =
    getDenomBalance(balances, assetMap[selectedAssetId]?.denom) || 0;

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.mainAssetId?.toNumber()],
        assetMap[pool?.firstBridgedAssetId?.toNumber()],
        assetMap[pool?.secondBridgedAssetId?.toNumber()],
      ]);
    }
  }, [pool]);

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();

    setAmount(value);
    setValidationError(ValidateInputNumber(getAmount(value), availableBalance));
  };

  const handleMaxClick = () => {
    if (assetMap[selectedAssetId]?.denom === comdex.coinMinimalDenom) {
      return Number(availableBalance) > DEFAULT_FEE
        ? handleInputChange(amountConversion(availableBalance - DEFAULT_FEE))
        : handleInputChange();
    } else {
      return handleInputChange(amountConversion(availableBalance));
    }
  };

  const handleRefresh = () => {
    setBalanceRefresh(refreshBalance + 1);
    setAmount();
  };

  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <CustomRow assetList={assetList} />
        <div className="assets-select-card mb-3">
          <div className="assets-left">
            <label className="left-label">
              Repay Asset <TooltipIcon text="" />
            </label>
            <div className="assets-select-wrapper">
              <div className="assets-select-wrapper">
                <Select
                  className="assets-select"
                  dropdownClassName="asset-select-dropdown"
                  defaultValue="1"
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon">
                        <div className="circle-icon-inner" />
                      </div>
                      Select
                    </div>
                  }
                  defaultActiveFirstOption={true}
                >
                  <Option key="1">
                    <div className="select-inner">
                      <div className="svg-icon">
                        <div className="svg-icon-inner">
                          <SvgIcon
                            name={iconNameFromDenom(
                              assetMap[selectedAssetId]?.denom
                            )}
                          />
                        </div>
                      </div>
                      <div className="name">
                        {denomConversion(assetMap[selectedAssetId]?.denom)}
                      </div>
                    </div>
                  </Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="assets-right">
            <div className="label-right">
              Available
              <span className="ml-1">
                {amountConversionWithComma(availableBalance)}{" "}
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
                  onChange={(event) => handleInputChange(event.target.value)}
                  validationError={validationError}
                />{" "}
              </div>
              <small>
                $
                {commaSeparator(
                  Number(
                    amount *
                      marketPrice(markets, assetMap[selectedAssetId]?.denom) ||
                      0
                  ),
                  DOLLAR_DECIMALS
                )}{" "}
              </small>{" "}
            </div>
          </div>
        </div>
        <Row>
          <Col sm="12" className="mt-2 mx-auto card-bottom-details">
            <Row>
              <Col>
                <label>Remaining to Repay</label>
                <p className="remaining-infotext mt-1">
                  You don’t have enough funds to repay the full amount
                </p>
              </Col>
              <Col className="text-right">
                <div>
                  {amountConversionWithComma(borrowPosition?.amountOut?.amount)}{" "}
                  {denomConversion(borrowPosition?.amountOut?.denom)}
                </div>
                <small className="font-weight-light">
                  $
                  {commaSeparator(
                    Number(
                      amountConversion(borrowPosition?.amountOut?.amount) *
                        marketPrice(
                          markets,
                          assetMap[selectedAssetId]?.denom
                        ) || 0
                    ),
                    DOLLAR_DECIMALS
                  )}
                </small>
              </Col>
            </Row>
            <HealthFactor borrow={borrowPosition} />
            <Row className="mt-2">
              <Col>
                <label>Liquidation Threshold</label>
              </Col>
              <Col className="text-right">80%</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Penalty</label>
              </Col>
              <Col className="text-right">5%</Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Repay"
            lang={lang}
            disabled={!Number(amount) || dataInProgress || !selectedAssetId}
            amount={amount}
            address={address}
            borrowId={borrowPosition?.borrowingId}
            denom={borrowPosition?.amountOut?.denom}
            refreshData={handleRefresh}
          />
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <Details
            asset={assetMap[pool?.firstBridgedAssetId?.toNumber()]}
            poolId={pool?.poolId}
            parent="borrow"
          />
          <div className="mt-5">
            <Details
              asset={assetMap[pool?.secondBridgedAssetId?.toNumber()]}
              poolId={pool?.poolId}
              parent="borrow"
            />
          </div>
        </div>
        <div className="commodo-card">
          <Details
            asset={assetMap[pool?.mainAssetId?.toNumber()]}
            poolId={pool?.poolId}
            parent="borrow"
          />
        </div>
      </div>
    </div>
  );
};

RepayTab.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  borrowPosition: PropTypes.shape({
    lendingId: PropTypes.shape({
      low: PropTypes.number,
    }),
    amountIn: PropTypes.shape({
      denom: PropTypes.string,
      amount: PropTypes.string,
    }),
  }),
  pair: PropTypes.shape({
    id: PropTypes.shape({
      low: PropTypes.number,
    }),
    assetIn: PropTypes.shape({
      low: PropTypes.number,
    }),
    amountOut: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
  pool: PropTypes.shape({
    poolId: PropTypes.shape({
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
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pool: state.lend.pool._,
    pair: state.lend.pair,
    assetMap: state.asset._.map,
    balances: state.account.balances.list,
    lang: state.language,
    refreshBalance: state.account.refreshBalance,
    markets: state.oracle.market.list,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(RepayTab);
