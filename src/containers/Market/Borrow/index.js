import { message, Table } from "antd";
import { SvgIcon } from "../../../components/common";
import { useEffect, useState } from "react";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "../../../constants/common";
import { queryLendPools } from "../../../services/lend/query";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { denomConversion } from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";
import { columns } from "./data";

const Borrow = ({ assetMap }) => {
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [inProgress, setInProgress] = useState(false);
  const [lendPools, setLendPools] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetchLendPools((pageNumber - 1) * pageSize, pageSize, true, false);
  };

  const fetchLendPools = (offset, limit, isTotal, isReverse) => {
    setInProgress(true);
    queryLendPools(offset, limit, isTotal, isReverse, (error, result) => {
      setInProgress(false);

      if (error) {
        message.error(error);
        return;
      }

      setLendPools(result);
    });
  };

  const handleChange = (value) => {
    setPageNumber(value.current - 1);
    setPageSize(value.pageSize);
    fetchLendPools(
      (value.current - 1) * value.pageSize,
      value.pageSize,
      true,
      false
    );
  };

  const tableData =
    lendPools?.pools?.length > 0
      ? lendPools?.pools?.map((item, index) => {
          return {
            key: index,
            id: item.id,
            asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        assetMap[item?.mainAssetId?.toNumber()]?.denom
                      )}
                    />
                  </div>
                  {denomConversion(
                    assetMap[item?.mainAssetId?.toNumber()]?.denom
                  )}
                </div>
              </>
            ),
            bridge_asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        assetMap[item?.firstBridgedAssetId?.toNumber()]?.denom
                      )}
                    />
                  </div>
                  {denomConversion(
                    assetMap[item?.firstBridgedAssetId?.toNumber()]?.denom
                  )}
                </div>
              </>
            ),
            bridge_asset2: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        assetMap[item?.secondBridgedAssetId?.toNumber()]?.denom
                      )}
                    />
                  </div>
                  {denomConversion(
                    assetMap[item?.secondBridgedAssetId?.toNumber()]?.denom
                  )}
                </div>
              </>
            ),
            available_to_borrow: item,
            asset_apy: item,
            bridge_apy: item,
            bridge_apy2: item,
            action: item,
          };
        })
      : [];

  return (
    <div className="commodo-card bg-none">
      <div className="card-header">AssetS to BORROW</div>
      <div className="card-content">
        <Table
          className="custom-table market-table1"
          dataSource={tableData}
          columns={columns}
          loading={inProgress}
          onChange={(event) => handleChange(event)}
          pagination={{
            total:
              lendPools && lendPools?.pagination && lendPools.pagination.total,
            pageSize,
          }}
          scroll={{ x: "100%", y: "30vh" }}
        />
      </div>
    </div>
  );
};

Borrow.propTypes = {
  assetMap: PropTypes.object,
};

const stateToProps = (state) => {
  return {
    assetMap: state.asset._.map,
  };
};

export default connect(stateToProps)(Borrow);
