import { Button, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { queryExternalLendRewardsAPR } from "../../../services/rewards/query";
import { decimalConversion } from "../../../utils/number";
import "./index.less";

const DistributionAPY = ({ value, margin, assetId, poolId }) => {
  const [apr, setAPR] = useState();

  useEffect(() => {
    if (assetId && poolId) {
      queryExternalLendRewardsAPR(assetId, poolId, (error, result) => {
        if (error) {
          return;
        }

        setAPR(result?.apr);
      });
    }
  }, [assetId, poolId]);

  return (
    <Tooltip
      placement="topLeft"
      title={"Projected Distribution Reward APY for Borrowing"}
    >
      <Button
        type="primary"
        className={
          margin === "top"
            ? "mt-1 distribution-apy-button"
            : "ml-1 distribution-apy-button"
        }
      >
        {Number(decimalConversion(apr || 0) * 100).toFixed(DOLLAR_DECIMALS)}%
      </Button>
    </Tooltip>
  );
};

DistributionAPY.propTypes = {
  margin: PropTypes.string,
  value: PropTypes.any,
};

export default DistributionAPY;
