import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import variables from "../../../utils/variables";
import { Button, List, Select, Input, Progress, Switch } from "antd";
import "./index.less";

const { Option } = Select;

const DepositTab = (lang) => {
  const data = [
    {
      title: "Total Borrowed",
      counts: '$1,234.20'
    },
    {
      title: "Available",
      counts: "$1,234.20"
    },
    {
      title: "Utilization",
      counts: "30.45%"
    },
    {
      title: "Borrow APY",
      counts: "30.45%"
    }
  ];
  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <div className="deposit-head">
          <div className="deposit-head-left">
            <div className="assets-col">
              <div className="assets-icon">
                <SvgIcon name="uscx-icon" />
              </div>
              USCX
            </div>
            <span className="hyphen-icon">-</span>
            <div className="assets-col">
              <div className="assets-icon">
                <SvgIcon name="atom-icon" />
              </div>
              USCX
            </div>
          </div>
          <div className="deposit-head-right">
            Use as Collateral
            <Switch size="small" />
          </div>
        </div>
        <div className="assets-select-card mb-0">
          <div className="assets-left">
            <label className="leftlabel">
              Collateral Asset
            </label>
            <div className="assets-select-wrapper">
              <Select
                className="assets-select"
                dropdownClassName="asset-select-dropdown"
                placeholder={
                  <div className="select-placeholder">
                    <div className="circle-icon">
                      <div className="circle-icon-inner" />
                    </div>
                    Select
                  </div>
                }
                defaultActiveFirstOption={true}
                suffixIcon={<SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />}
              >
                <Option key="1">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name="atom-icon" />
                      </div>
                    </div>
                    <div className="name">Atom</div>
                  </div>
                </Option>
              </Select>
            </div>
          </div>
          <div className="assets-right">
            <div className="label-right">
              Available
              <span className="ml-1">
                142 USCX
              </span>
              <div className="maxhalf">
                <Button className="active">
                  Max
                </Button>
              </div>
            </div>
            <div>
              <div className="input-select">
                <Input
                  placeholder=""
                  value="23.00"
                />
              </div>
              <small>$120.00</small>
            </div>
          </div>
        </div>
        <Row>
          <Col sm="12" className="mt-3 mx-auto card-bottom-details">
            <Row className="pb-2">
              <Col sm="12" className="bond-row">
                <span className="mr-2">Bond</span> <Switch defaultChecked size="small" />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Max LTV</label>
              </Col>
              <Col className="text-right">
                85%
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Threshold</label>
              </Col>
              <Col className="text-right">
                80%
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Penalty</label>
              </Col>
              <Col className="text-right">
                5%
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Current LTV</label>
              </Col>
              <Col className="text-right">
                35%
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Deposit APY</label>
              </Col>
              <Col className="text-right">
                3.80%
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <Button
            type="primary"
            className="btn-filled"
          >
            Deposit
          </Button>
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name="uscx-icon" />
                </div>
                USCX
              </div>
              <span className="percent-badge">
                +6.18 <SvgIcon name="commodo-icon" />
              </span>
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <div>
                  <p>{item.title}</p>
                  <h3>{item.counts}</h3>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="commodo-card">
          <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name="atom-icon" />
                </div>
                ATOM
              </div>
              <span className="percent-badge">
                +6.18 <SvgIcon name="commodo-icon" />
              </span>
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <div>
                  <p>{item.title}</p>
                  <h3>{item.counts}</h3>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

DepositTab.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(DepositTab);