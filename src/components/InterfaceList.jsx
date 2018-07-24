'use strict';

import React, {
  Component,
} from 'react';

import {
  Input,
  Button,
  Row,
  Col,
  Popconfirm,
  Popover,
  Icon,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import InterfaceForm from './forms/InterfaceForm';

import { interfaceService } from '../service';

import './InterfaceList.less';

const Search = Input.Search;

class InterfaceList extends Component {
  state = {
    interfaceFormVisible: false,
    interfaceFormLoading: false,
    filterString: '',
    stageData: null,
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  showCreateForm = () => {
    this.setState({
      stageData: null,
      interfaceFormVisible: true,
    });
  }

  showUpdateForm = async value => {
    this.setState({
      stageData: value,
      interfaceFormVisible: true,
    });
  }

  closeInterfaceForm = () => {
    this.setState({
      interfaceFormVisible: false,
    });
  }

  confirmInterfaceForm = async ({ pathname, description, method }) => {
    this.setState({
      interfaceFormLoading: true,
    });
    const apiName = this.state.stageData
      ? 'updateInterface'
      : 'createInterface';
    const res = await interfaceService[apiName]({
      uniqId: this.state.stageData && this.state.stageData.uniqId,
      pathname,
      description,
      method,
    });
    this.setState({
      interfaceFormLoading: false,
    });
    if (res.success) {
      this.setState({
        interfaceFormVisible: false,
      }, () => {
        this.props.updateInterfaceList();
      });
    }
  }

  deleteInterface = async (uniqId) => {
    await interfaceService.deleteInterface({ uniqId });
    await this.props.updateInterfaceList();
  }

  filterInterface = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  renderInterfaceList = () => {
    const formatMessage = this.formatMessage;
    const { interfaceList } = this.props;
    return interfaceList.filter(value =>
      value.pathname.toLowerCase().includes(this.state.filterString) ||
      value.description.toLowerCase().includes(this.state.filterString)
    ).map((value, index) => {
      const isSelected = value.uniqId === this.props.selectedInterface.uniqId;
      return (
        <Popover
          key={index}
          placement="right"
          content={
            <div style={{ maxWidth: '400px', wordBreak: 'break-all'}}>
              <div>{value.pathname}</div><br/>
              <div>{value.description}</div>
            </div>
          }
          trigger="hover">
          <li
            className={isSelected ? 'clicked' : ''}
            onClick={() => this.props.setSelectedInterface(value.uniqId)}
          >
            <div className="left">
              <h3 className="ellipsis">{value.pathname}</h3>
              <p>{value.description}</p>
              <p>method: {value.method}
              </p>
            </div>
            <div className="right" style={{fontSize: '16px'}}>
              <Icon
                type="setting"
                onClick={() => this.showUpdateForm(value)}
                style={{marginRight: '4px'}}
              />
              <Popconfirm
                title={formatMessage('common.deleteTip')}
                onConfirm={e => this.deleteInterface(value.uniqId)}
                okText={formatMessage('common.confirm')}
                cancelText={formatMessage('common.cancel')}
              >
                <Icon style={{color: '#f5222d'}} className="delete-icon" type="delete" />
              </Popconfirm>
            </div>
          </li>
        </Popover>
      );
    });
  }

  render () {
    const formatMessage = this.formatMessage;
    return (
      <div className="interface-list">
        <Row className="interface-filter-row">
          <Col span={15}>
            <Search
              data-accessbilityid="project-search-api"
              placeholder={formatMessage('interfaceList.searchInterface')}
              onChange={this.filterInterface}
            />
          </Col>
          <Col span={8} offset={1}>
            <Button
              type="primary"
              data-accessbilityid="project-add-api-list-btn"
              onClick={this.showCreateForm}
            >
              <FormattedMessage id='interfaceList.addInterface' />
            </Button>
          </Col>
        </Row>

        <ul style={{ maxHeight: '500px', overflowY: 'scroll' }}>
          { this.renderInterfaceList() }
        </ul>

        <InterfaceForm
          visible={this.state.interfaceFormVisible}
          onCancel={this.closeInterfaceForm}
          onOk={this.confirmInterfaceForm}
          confirmLoading={this.state.interfaceFormLoading}
          stageData={this.state.stageData}
        />
      </div>
    );
  }
}

export default injectIntl(InterfaceList);
