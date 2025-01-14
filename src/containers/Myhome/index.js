import { List, message, Progress, Tabs } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { setBalanceRefresh } from "../../actions/account";
import { setUserBorrows, setUserLends } from "../../actions/lend";
import { Col, Row, TooltipIcon } from "../../components/common";
import { DOLLAR_DECIMALS } from "../../constants/common";
import {
  queryLendPair,
  queryLendPool,
  queryUserBorrows,
  queryUserLends,
} from "../../services/lend/query";
import { amountConversion, commaSeparatorWithRounding } from "../../utils/coin";
import { decimalConversion, marketPrice } from "../../utils/number";
import { decode } from "../../utils/string";
import Borrow from "./Borrow";
import Deposit from "./Deposit";
import History from "./History";
import "./index.less";

const Myhome = ({
  address,
  userLendList,
  setUserLends,
  setUserBorrows,
  userBorrowList,
  markets,
  assetRatesStatsMap,
  assetMap,
  assetDenomMap,
  setBalanceRefresh,
  refreshBalance,
}) => {
  const [activeKey, setActiveKey] = useState("1");
  const [lendsInProgress, setLendsInProgress] = useState(false);
  const [borrowsInProgress, setBorrowsInProgress] = useState(false);
  const [borrowToPair, setBorrowToPair] = useState({});
  const [borrowToLend, setBorrowToLend] = useState({});
  const [borrowToPool, setBorrowToPool] = useState({});

  const location = useLocation();
  const type = decode(location.hash);

  useEffect(() => {
    if (type && type === "borrow") {
      setActiveKey("2");
    }

    setBalanceRefresh(refreshBalance + 1);
  }, []);

  useEffect(() => {
    setUserLends([]);
    setUserBorrows([]);
  }, []);

  useEffect(() => {
    if (address) {
      fetchUserBorrows();
      fetchUserLends();
    }
  }, [address]);

  const fetchUserLends = () => {
    setLendsInProgress(true);
    queryUserLends(address, (error, result) => {
      setLendsInProgress(false);

      if (error) {
        message.error(error);
        return;
      }

      setUserLends(result?.lends || []);
    });
  };

  const fetchUserBorrows = () => {
    setBorrowsInProgress(true);
    queryUserBorrows(address, (error, result) => {
      setBorrowsInProgress(false);

      if (error) {
        message.error(error);
        return;
      }

      setUserBorrows(result?.borrows || []);

      if (result?.borrows?.length > 0) {
        for (let i = 0; i < result?.borrows?.length; i++) {
          fetchPair(result?.borrows[i]);
        }
      }
    });
  };

  const fetchPair = (borrow) => {
    queryLendPair(borrow?.pairId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setBorrowToPair((prevState) => ({
        [borrow?.borrowingId]: result?.ExtendedPair,
        ...prevState,
      }));

      setBorrowToLend((prevState) => ({
        [borrow?.lendingId?.toNumber()]: borrow?.lendingId?.toNumber(),
        ...prevState,
      }));

      queryLendPool(
        result?.ExtendedPair?.assetOutPoolId,
        (error, poolResult) => {
          if (error) {
            message.error(error);
            return;
          }

          setBorrowToPool((prevState) => ({
            [borrow?.borrowingId]: poolResult?.pool,
            ...prevState,
          }));
        }
      );
    });
  };
  const calculateTotalDeposit = () => {
    const values =
      userLendList?.length > 0
        ? userLendList.map((item) => {
            return (
              marketPrice(
                markets,
                item?.amountIn?.denom,
                assetDenomMap[item?.amountIn?.denom]?.id
              ) *
              amountConversion(
                item?.amountIn.amount,
                assetDenomMap[item?.amountIn?.denom]?.decimals
              )
            );
          })
        : [];

    const sum = values.reduce((a, b) => a + b, 0);

    return `$${commaSeparatorWithRounding(sum || 0, DOLLAR_DECIMALS)}`;
  };

  const calculateTotalBorrow = () => {
    const values =
      userBorrowList?.length > 0
        ? userBorrowList.map((item) => {
            return (
              marketPrice(
                markets,
                item?.amountOut?.denom,
                assetDenomMap[item?.amountOut?.denom]?.id
              ) *
              amountConversion(
                item?.amountOut.amount,
                assetDenomMap[item?.amountOut?.denom]?.decimals
              )
            );
          })
        : [];

    return values.reduce((a, b) => a + b, 0);
  };

  const calculateTotalBorrowLimit = () => {
    // calculate borrow limit of all borrow positions.
    const borrowValues =
      userBorrowList?.length > 0
        ? userBorrowList.map((item) => {
            return (
              marketPrice(
                markets,
                assetMap[borrowToPair[item?.borrowingId]?.assetIn]?.denom,
                borrowToPair[item?.borrowingId]?.assetIn
              ) *
              Number(
                amountConversion(
                  item?.amountIn.amount,
                  assetMap[borrowToPair[item?.borrowingId]?.assetIn]?.decimals
                )
              ) *
              (borrowToPair[item?.borrowingId]?.isInterPool
                ? Number(
                    decimalConversion(
                      assetRatesStatsMap[
                        borrowToPair[item?.borrowingId]?.assetIn
                      ]?.ltv
                    )
                  ) *
                  Number(
                    decimalConversion(
                      assetRatesStatsMap[
                        borrowToPool[item?.borrowingId]?.transitAssetIds?.first
                      ]?.ltv
                    )
                  )
                : Number(
                    decimalConversion(
                      assetRatesStatsMap[
                        borrowToPair[item?.borrowingId]?.assetIn
                      ]?.ltv
                    ) || 0
                  ))
            );
          })
        : [];

    let borrowValue = borrowValues.reduce((a, b) => a + b, 0);

    // calculate borrow limit value only lend positions which don't have borrow position.
    let borrowsWithLend = Object?.values(borrowToLend);

    const lendValues =
      userLendList?.length > 0 && borrowsWithLend?.length
        ? userLendList.map((item) => {
            if (!borrowsWithLend.includes(item?.lendingId?.toNumber()))
              // considering lend positions which don;t have borrow position opend.
              return (
                marketPrice(
                  markets,
                  item?.amountIn?.denom,
                  assetDenomMap[item?.amountIn?.denom]?.id
                ) *
                amountConversion(
                  item?.amountIn.amount,
                  assetDenomMap[item?.amountIn?.denom]?.decimals
                ) *
                Number(
                  decimalConversion(assetRatesStatsMap[item?.assetId]?.ltv)
                )
              );
            else {
              return 0;
            }
          })
        : [];

    let lendValue = lendValues.reduce((a, b) => a + b, 0);

    // borrow limit = sum of all collateral deposited * its LTV of all borrow positions and lends positions without borrow postion

    return Number(borrowValue || 0) + Number(lendValue || 0);
  };

  const totalBorrow = Number(calculateTotalBorrow());
  const borrowLimit = Number(calculateTotalBorrowLimit());
  const currentLimit = (
    (borrowLimit ? totalBorrow / borrowLimit : 0) * 100
  ).toFixed(DOLLAR_DECIMALS);

  const data = [
    {
      title: (
        <>
          Total Deposited{" "}
          <TooltipIcon text="Value of total Asset Deposited by User" />
        </>
      ),
      counts: calculateTotalDeposit(),
    },
    {
      title: (
        <>
          Total Borrowed{" "}
          <TooltipIcon text="Value of total Asset Borrowed by User" />
        </>
      ),
      counts: `$${commaSeparatorWithRounding(
        totalBorrow || 0,
        DOLLAR_DECIMALS
      )}`,
    },
  ];

  const tabItems = [
    {
      label: "Lend",
      key: "1",
      children: (
        <Deposit fetchUserLends={fetchUserLends} inProgress={lendsInProgress} />
      ),
    },
    {
      label: "Borrow",
      key: "2",
      children: (
        <Borrow
          fetchUserBorrows={fetchUserBorrows}
          inProgress={borrowsInProgress}
        />
      ),
    },
    { label: "History", key: "3", children: <History /> },
  ];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card myhome-upper">
            <div className="myhome-upper-left">
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>{item.title}</p>
                      <h3>{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
              />
            </div>
            <div className="myhome-upper-right">
              <div className="mb-3">
                Your Borrow Limit
                <TooltipIcon
                  text="Borrowing limit of user, range 0-105%.
 If it’s greater than 100% position(s) prone to liquidation"
                />
              </div>
              <div className="borrow-limit-bar">
                <div className="borrow-limit-upper">
                  <div>
                    <h4>{currentLimit || 0}%</h4>
                  </div>
                  <div className="small-text">
                    Borrow Limit :$
                    {commaSeparatorWithRounding(
                      borrowLimit || 0,
                      DOLLAR_DECIMALS
                    )}
                  </div>
                </div>
                <div className="borrow-limit-middle">
                  <Progress percent={currentLimit} size="small" />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            className="commodo-tabs"
            defaultActiveKey="1"
            onChange={setActiveKey}
            activeKey={activeKey}
            items={tabItems}
          />
        </Col>
      </Row>
    </div>
  );
};

Myhome.propTypes = {
  lang: PropTypes.string.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  setUserBorrows: PropTypes.func.isRequired,
  setUserLends: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  assetDenomMap: PropTypes.object,
  assetRatesStatsMap: PropTypes.object,
  markets: PropTypes.object,
  userBorrowList: PropTypes.arrayOf(
    PropTypes.shape({
      amountOut: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      borrowingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      lendingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      pairId: PropTypes.shape({
        low: PropTypes.number,
      }),
      interestAccumulated: PropTypes.string,
    })
  ),
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
    lang: state.language,
    address: state.account.address,
    userLendList: state.lend.userLends,
    userBorrowList: state.lend.userBorrows,
    markets: state.oracle.market,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    assetMap: state.asset._.map,
    assetDenomMap: state.asset._.assetDenomMap,
    refreshBalance: state.account.refreshBalance,
  };
};

const actionsToProps = {
  setUserBorrows,
  setUserLends,
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(Myhome);
