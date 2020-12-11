'use strict';

import React, {
  Component,
} from 'react';

import {
  Row,
  Col,
  Icon,
  Input,
  Upload,
  Button,
  Message,
  Tooltip,
  Popconfirm,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import InterfaceForm from './forms/InterfaceForm';
import InterfaceSelectForm from './forms/InterfaceSelectForm';

import {
  interfaceService,
  sceneGroupService,
} from '../service';

import './InterfaceList.less';

const Search = Input.Search;

const globalProxy = window.context && window.context.globalProxy;

class InterfaceList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      interfaceFormVisible: false,
      interfaceFormLoading: false,
      interfaceSelectFormVisible: false,
      interfaceSelectFormLoading: false,
      filterString: '',
      stageData: null,
    };
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

  confirmInterfaceForm = async ({ pathname, description, method, mockConfig }) => {
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
      mockConfig,
    });

    // Add Global Proxy	
    if (res.data &&	
      res.data.uniqId &&	
      apiName === 'createInterface' &&	
      globalProxy	
    ) {	
      await interfaceService.updateInterface({	
        uniqId: res.data.uniqId,	
        proxyConfig: {	
          enabled: false,	
          proxyList: [{	
            proxyUrl: globalProxy,	
          }],	
        },	
      });	
    }

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

  downloadInterface = value => {
    location.href = interfaceService.getDownloadAddress({
      uniqId: value.uniqId,
    });
  }

  uploadProps = () => {
    return {
      accept: 'text',
      action: interfaceService.uploadServer,
      showUploadList: false,
      headers: {
        authorization: 'authorization-text',
      },
      onChange (info) {
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            Message.success(`${info.file.name} file uploaded successfully`);
            location.reload();
          } else {
            Message.error(info.file.response.message);
          }
        } else if (info.file.status === 'error') {
          Message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
  }

  showInterfaceSelectForm = async () => {
    this.setState({
      interfaceSelectFormVisible: true,
    });
  }

  closeInterfaceSelectForm = async () => {
    this.setState({
      interfaceSelectFormVisible: false,
    });
  }

  // 给项目场景添加接口
  addInterface = async (interfaceListSelected) => {
    this.setState({
      interfaceSelectFormLoading: true,
    });
    const interfaceListToAdd = this.props.interfaceList.filter(item => interfaceListSelected.includes(item.pathname)).map(item => {
      return {
        interfacePathname: item.pathname,
        interfaceMethod: item.method,
        scene: item.currentScene,
      };
    });
    const interfaceListToUpdate = this.props.selectedSceneGroup.interfaceList.concat(interfaceListToAdd);
    const res = await sceneGroupService.updateSceneGroup({
      uniqId: this.props.selectedSceneGroup.uniqId,
      interfaceList: interfaceListToUpdate,
    });
    this.setState({
      interfaceSelectFormLoading: false,
    });
    if (res.success) {
      this.setState({
        interfaceSelectFormVisible: false,
      }, async () => {
        await this.props.updateSceneGroupList();
        await this.props.updateInterfaceList();
      });
    }
  }

  deleteInterfaceInSceneGroup = async (pathname, method) => {
    const index = this.props.selectedSceneGroup.interfaceList.findIndex(item => {
      return (item.interfacePathname === pathname &&
        item.interfaceMethod === method);
    });
    const interfaceListToUpdate = this.props.selectedSceneGroup.interfaceList;
    interfaceListToUpdate.splice(index, 1);
    await sceneGroupService.updateSceneGroup({
      uniqId: this.props.selectedSceneGroup.uniqId,
      interfaceList: interfaceListToUpdate,
    });
    await this.props.updateSceneGroupList();
    await this.props.updateInterfaceList();
  }

  filterInterface = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  renderInterfaceList = (isDefaultSceneGroup, actualInterfaceList) => {
    const unControlled = this.props.unControlled;
    const formatMessage = this.formatMessage;

    return actualInterfaceList.filter(value =>
      value.pathname.toLowerCase().includes(this.state.filterString) ||
      value.description.toLowerCase().includes(this.state.filterString))
      .map((value, index) => {
        const isSelected = value.uniqId === this.props.selectedInterface.uniqId;

        return (
          <li
            key={index}
            data-accessbilityid={`project-add-api-list-${index}`}
            className={[isSelected ? 'clicked' : ''].join(' ')}
            onClick={() => this.props.setSelectedInterface(value.uniqId)}
          >
            <div className="interface-item">
              <h3 className="interface-item-title" title={value.pathname}>{value.pathname}</h3>
              <p className="interface-item-desc" title={value.description}>{value.description}</p>
              <p className="interface-item-method">
                <span className="interface-item-method-name">method: </span>
                <span className="interface-item-method-value">{value.method}</span>
              </p>
            </div>
            {!unControlled && <div className="interface-control" style={{fontSize: '16px'}}>
              {
                isDefaultSceneGroup &&
              <span>
                <Upload name={ value.uniqId } {...this.uploadProps()}>
                  <Icon className="upload-icon" type="upload" />
                </Upload>
                <Icon
                  type="download"
                  className="download-icon"
                  onClick={() => this.downloadInterface(value)}
                />
                <Tooltip title={formatMessage('interfaceList.updateInterface')}>
                  <Icon
                    type="setting"
                    className="setting-icon"
                    onClick={() => this.showUpdateForm(value)}
                  />
                </Tooltip>
              </span>
              }
              <Popconfirm
                title={formatMessage(isDefaultSceneGroup ? 'common.deleteTip' : 'common.removeTip')}
                onConfirm={() => {
                  isDefaultSceneGroup ? this.deleteInterface(value.uniqId)
                    : this.deleteInterfaceInSceneGroup(value.pathname, value.method);
                }}
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
    const { interfaceList = [], actualInterfaceList = [] } = this.props;
    const selectedSceneGroup = this.props.selectedSceneGroup || {};
    const isDefaultSceneGroup = !selectedSceneGroup.uniqId;

    const formatMessage = this.formatMessage;
    const unControlled = this.props.unControlled;
    const interfaceListClassNames = ['interface-list'];
    if (unControlled) interfaceListClassNames.push('uncontrolled');
    return (
      <div className={`${interfaceListClassNames.join(' ')}`}>
        {
          !unControlled &&
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
                onClick={isDefaultSceneGroup ? this.showCreateForm : this.showInterfaceSelectForm}
              >
                <FormattedMessage id="interfaceList.addInterface" />
              </Button>
            </Col>
          </Row>
        }
        <ul className="interface-list-container">
          { this.renderInterfaceList(isDefaultSceneGroup, actualInterfaceList) }
        </ul>

        <InterfaceForm
          visible={this.state.interfaceFormVisible}
          onCancel={this.closeInterfaceForm}
          onOk={this.confirmInterfaceForm}
          confirmLoading={this.state.interfaceFormLoading}
          stageData={this.state.stageData}
        />

        <InterfaceSelectForm
          visible={this.state.interfaceSelectFormVisible}
          onCancel={this.closeInterfaceSelectForm}
          onOk={this.addInterface}
          interfaceList={interfaceList}
          actualInterfaceList={actualInterfaceList}
          confirmLoading={this.state.interfaceSelectFormLoading}
        />
      </div>
    );
  }
}

export default injectIntl(InterfaceList);
