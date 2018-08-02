'use strict';

import React, {
  Component,
} from 'react';

import {
  Row,
  Col,
  Icon,
  Input,
  Button,
  Tooltip,
  Popconfirm,
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

  deleteInterface = async uniqId => {
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
    const unControlled = this.props.unControlled;
    const formatMessage = this.formatMessage;
    const { interfaceList } = this.props;
    return interfaceList.filter(value =>
      value.pathname.toLowerCase().includes(this.state.filterString) ||
      value.description.toLowerCase().includes(this.state.filterString)
    ).map((value, index) => {
      const isSelected = value.uniqId === this.props.selectedInterface.uniqId;
      return (
        <li
          key={index}
          className={isSelected ? 'clicked' : ''}
        >
          <div className="interface-item"
            onClick={() => this.props.setSelectedInterface(value.uniqId)}>
            <h3 className="ellipsis" title={value.pathname}>{value.pathname}</h3>
            <p title={value.description}>{value.description}</p>
            <p>method: {value.method}
            </p>
          </div>
          {!unControlled && <div className="interface-control" style={{fontSize: '16px'}}>
            <Tooltip title={formatMessage('interfaceList.updateInterface')}>
              <Icon
                type="setting"
                onClick={() => this.showUpdateForm(value)}
                style={{marginRight: '4px'}}
              />
            </Tooltip>
            <Popconfirm
              title={formatMessage('common.deleteTip')}
              onConfirm={() => this.deleteInterface(value.uniqId)}
              okText={formatMessage('common.confirm')}
              cancelText={formatMessage('common.cancel')}
            >
              <Icon style={{color: '#f5222d'}} className="delete-icon" type="delete" />
            </Popconfirm>
          </div>}
        </li>
      );
    });
  }

  render () {
    const formatMessage = this.formatMessage;
    const unControlled = this.props.unControlled;
    const interfaceListClassNames = ['interface-list'];
    if (unControlled) interfaceListClassNames.push('uncontrolled');
    return (
      <div className={`${interfaceListClassNames.join(' ')}`}>
        {!unControlled && <Row className="interface-filter-row">
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
              <FormattedMessage id="interfaceList.addInterface" />
            </Button>
          </Col>
        </Row>}

        <ul style={{ maxHeight: '600px', overflowY: 'scroll' }}>
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
