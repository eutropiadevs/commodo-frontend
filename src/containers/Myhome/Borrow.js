import { Button, Table, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon
} from "../../components/common";
import HealthFactor from "../../components/HealthFactor";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { decimalConversion } from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";
import AssetApy from "../Market/AssetApy";
import InterestAndReward from "./Calculate/InterestAndReward";
import "./index.less";

const Borrow = ({
  lang,
  userBorrowList,
  inProgress,
  address,
  fetchUserBorrows,
  assetDenomMap,
}) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 130,
    },
    {
      title: (
        <>
          Debt <TooltipIcon text="Current Outstanding Debt" />
        </>
      ),
      dataIndex: "debt",
      key: "debt",
      width: 300,
    },
    {
      title: "Collateral",
      dataIndex: "collateral",
      key: "collateral",
      width: 300,
    },
    {
      title: (
        <>
          Health Factor{" "}
          <TooltipIcon text="Numeric representation of your position's safety. Liquidation at H.F<1.0" />
        </>
      ),
      dataIndex: "health",
      key: "health",
      width: 250,
      align: "center",
      render: (item) => <HealthFactor parent="table" borrow={item} />,
    },
    {
      title: "Borrow APY",
      dataIndex: "apy",
      key: "apy",
      width: 180,
      render: (borrow) => <AssetApy borrowPosition={borrow} parent="borrow" />,
    },
    {
      title: (
        <>
          Interest <TooltipIcon text="Interest accrued by borrowing" />
        </>
      ),
      dataIndex: "interest",
      key: "interest",
      width: 250,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 120,
      render: (item) => (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title={
              item?.isLiquidated ? "Position has been sent for Auction." : ""
            }
          >
            <Button
              disabled={item?.isLiquidated}
              onClick={() =>
                navigate(`/myhome/borrow/${item?.borrowingId?.toNumber()}`)
              }
              type="primary"
              className="btn-filled"
              size="small"
            >
              Edit
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const tableData =
    userBorrowList?.length > 0
      ? userBorrowList?.map((item, index) => {
          return {
            key: index,
            asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon name={iconNameFromDenom(item?.amountOut?.denom)} />
                  </div>
                  {denomConversion(item?.amountOut?.denom)}
                </div>
              </>
            ),
            debt: (
              <>
                {" "}
                {amountConversionWithComma(
                  item?.amountOut?.amount,
                  assetDenomMap[item?.amountOut?.denom]?.decimals
                )}{" "}
                {denomConversion(item?.amountOut?.denom)}
              </>
            ),
            collateral: (
              <>
                {" "}
                {amountConversionWithComma(
                  item?.amountIn?.amount,
                  assetDenomMap[item?.amountIn?.denom]?.decimals
                )}{" "}
                {denomConversion(item?.amountIn?.denom)}
              </>
            ),
            apy: item,
            interest: (
              <>
                {amountConversionWithComma(
                  decimalConversion(
                    item?.interestAccumulated,
                    assetDenomMap[item?.amountOut?.denom]?.decimals
                  )
                )}{" "}
                {denomConversion(item?.amountOut?.denom)}
              </>
            ),
            health: item,
            action: item,
          };
        })
      : [];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="d-flex w-100 align-items-center justify-content-between">
              <div className="card-header text-left">MY Borrowed AssetS</div>
              <InterestAndReward
                lang={lang}
                address={address}
                updateDetails={fetchUserBorrows}
              />
            </div>
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
                loading={inProgress}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%" }}
                locale={{ emptyText: <NoDataIcon /> }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Borrow.propTypes = {
  fetchUserBorrows: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  assetDenomMap: PropTypes.object,
  inProgress: PropTypes.bool,
  userBorrowList: PropTypes.arrayOf(
    PropTypes.shape({
      amountOut: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      borrowingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      cpoolName: PropTypes.string,
      lendingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      pairId: PropTypes.shape({
        low: PropTypes.number,
      }),
      interestAccumulated: PropTypes.string,
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    userBorrowList: state.lend.userBorrows,
    address: state.account.address,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

export default connect(stateToProps)(Borrow);
