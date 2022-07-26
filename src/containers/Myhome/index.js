import { List, Progress, Tabs } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { setUserBorrows, setUserLends } from "../../actions/lend";
import { Col, Row, TooltipIcon } from "../../components/common";
import { DOLLAR_DECIMALS } from "../../constants/common";
import { queryUserBorrows, queryUserLends } from "../../services/lend/query";
import { amountConversionWithComma } from "../../utils/coin";
import { marketPrice } from "../../utils/number";
import { decode } from "../../utils/string";
import Borrow from "./Borrow";
import Deposit from "./Deposit";
import History from "./History";
import "./index.less";

const { TabPane } = Tabs;

const Myhome = ({
  address,
  userLendList,
  setUserLends,
  setUserBorrows,
  userBorrowList,
  markets,
}) => {
  const [activeKey, setActiveKey] = useState("1");
  const [lendsInProgress, setLendsInProgress] = useState(false);
  const [borrowsInProgress, setBorrowsInProgress] = useState(false);

  const location = useLocation();
  const type = decode(location.hash);

  useEffect(() => {
    if (type && type === "borrow") {
      setActiveKey("2");
    }
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

      if (result?.lends?.length > 0) {
        setUserLends(result?.lends);
      }
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

      if (result?.borrows?.length > 0) {
        setUserBorrows(result?.borrows);
      }
    });
  };

  const calculateTotalDeposit = () => {
    const values =
      userLendList?.length > 0
        ? userLendList.map((item) => {
            return (
              marketPrice(markets, item?.amountIn?.denom) *
              item?.amountIn.amount
            );
          })
        : [];

    const sum = values.reduce((a, b) => a + b, 0);

    return `$${amountConversionWithComma(sum || 0, DOLLAR_DECIMALS)}`;
  };

  const calculateTotalBorrow = () => {
    const values =
      userBorrowList?.length > 0
        ? userBorrowList.map((item) => {
            return (
              marketPrice(markets, item?.amountOut?.denom) *
              item?.amountOut.amount
            );
          })
        : [];

    const sum = values.reduce((a, b) => a + b, 0);

    return `$${amountConversionWithComma(sum || 0, DOLLAR_DECIMALS)}`;
  };

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
      counts: calculateTotalBorrow(),
    },
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
                Your Borrow Limit <TooltipIcon text="Borrow limit of User" />
              </div>
              <div className="borrow-limit-bar">
                <div className="borrow-limit-upper">
                  <div>
                    <h4>25%</h4>
                  </div>
                  <div className="small-text">Borrow Limit :$7255</div>
                </div>
                <div className="borrow-limit-middle">
                  <Progress percent={25} size="small" />
                </div>
                <div className="borrow-limit-bottom">
                  <div className="small-text">Collateral :$12,150</div>
                  <div className="small-text">Borrowed :$2345</div>
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
          >
            <TabPane tab="Deposit" key="1">
              <Deposit inProgress={lendsInProgress} />
            </TabPane>
            <TabPane tab="Borrow" key="2">
              <Borrow inProgress={borrowsInProgress} />
            </TabPane>
            <TabPane tab="History" key="3">
              <History />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

Myhome.propTypes = {
  lang: PropTypes.string.isRequired,
  setUserBorrows: PropTypes.func.isRequired,
  setUserLends: PropTypes.func.isRequired,
  address: PropTypes.string,
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
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
    markets: state.oracle.market.list,
  };
};

const actionsToProps = {
  setUserBorrows,
  setUserLends,
};

export default connect(stateToProps, actionsToProps)(Myhome);
