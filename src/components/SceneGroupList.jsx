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
  Message,
  Tooltip,
  Checkbox,
  Popconfirm,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import SceneGroupForm from './forms/SceneGroupForm';

import { sceneGroupService } from '../service';

import './SceneGroupList.less';

const Search = Input.Search;

class SceneGroupList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sceneGroupFormVisible: false,
      sceneGroupFormLoading: false,
      filterString: '',
      stageData: null,
    };
  }

    formatMessage = id => this.props.intl.formatMessage({ id });

    showCreateForm = () => {
      this.setState({
        stageData: null,
        sceneGroupFormVisible: true,
      });
    }

    showUpdateForm = async value => {
      this.setState({
        stageData: value,
        sceneGroupFormVisible: true,
      });
    }

    closeSceneGroupForm = () => {
      this.setState({
        sceneGroupFormVisible: false,
      });
    }

    confirmSceneGroupForm = async ({ sceneGroupName, description }) => {
      this.setState({
        sceneGroupFormLoading: true,
      });
      const apiName = this.state.stageData
        ? 'updateSceneGroup'
        : 'createSceneGroup';
      const res = await sceneGroupService[apiName]({
        uniqId: this.state.stageData && this.state.stageData.uniqId,
        sceneGroupName,
        description,
      });

      this.setState({
        sceneGroupFormLoading: false,
      });
      if (res.success) {
        this.setState({
          sceneGroupFormVisible: false,
        }, () => {
          this.props.updateSceneGroupList();
        });
      }
    }

    deleteSceneGroup = async uniqId => {
      await sceneGroupService.deleteSceneGroup({ uniqId });
      await this.props.updateSceneGroupList();
      await this.props.updateInterfaceList();
    }

    downloadSceneGroup = value => {
      location.href = sceneGroupService.getDownloadAddress({
        uniqId: value.uniqId,
      });
    }

    uploadProps = () => {
      return {
        accept: 'text',
        action: sceneGroupService.uploadServer,
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

    changeSceneGroup = async (value) => {
      const res = await sceneGroupService.updateSceneGroup({
        uniqId: value.uniqId,
        enable: !(value.enable),
      });
      if (res.success) {
        Message.success(this.formatMessage('sceneGroupList.switchSceneGroup'));
        this.props.updateSceneGroupList();
      }
    }

    filterSceneGroup = (e) => {
      const filter = e.target.value.toLowerCase();
      this.setState({
        filterString: filter,
      });
    }

    renderSceneGroupList = () => {
      const formatMessage = this.formatMessage;
      const { sceneGroupList } = this.props;
      return sceneGroupList.filter(value =>
        value.sceneGroupName.toLowerCase().includes(this.state.filterString) ||
        value.description && value.description.toLowerCase().includes(this.state.filterString)
      ).map((value, index) => {
        const isSelected = value.uniqId === this.props.selectedSceneGroup.uniqId;

        return (
          <li
            key={index}
            className={[isSelected ? 'clicked' : ''].join(' ')}
            onClick={() => this.props.viewSceneGroup(value.uniqId)}
          >
            <Checkbox
              checked={value.enable}
              onClick={() => this.changeSceneGroup(value)}
            />
            <h3 className="sceneGroup-item-title">{value.sceneGroupName}</h3>
            <p className="sceneGroup-item-desc">{value.description}</p>
            <div className="sceneGroup-control" style={{ fontSize: '16px' }}>
              <Tooltip title={formatMessage('sceneGroupList.updateSceneGroup')}>
                <Icon
                  type="setting"
                  className="setting-icon"
                  onClick={() => this.showUpdateForm(value)}
                />
              </Tooltip>
              <Popconfirm
                title={formatMessage('common.deleteTip')}
                onConfirm={() => this.deleteSceneGroup(value.uniqId)}
                okText={formatMessage('common.confirm')}
                cancelText={formatMessage('common.cancel')}
              >
                <Icon style={{ color: '#f5222d' }} className="delete-icon" type="delete" />
              </Popconfirm>
            </div>
          </li>
        );
      });
    }

    render () {
      const formatMessage = this.formatMessage;
      const isDefault = !this.props.selectedSceneGroup.uniqId;

      return (
        <div className={['scene-group-list', this.props.collapsed ? 'scene-group-collapsed' : ''].join(' ')}>
          <Row className="scene-filter-row">
            <Col span={12}>
              <Search
                placeholder={formatMessage('sceneGroupList.searchSceneGroup')}
                onChange={this.filterSceneGroup}
              />
            </Col>
            <Col span={8} offset={1}>
              <Button
                type="primary"
                onClick={this.showCreateForm}
              >
                <FormattedMessage id="sceneGroupList.addSceneGroup" />
              </Button>
            </Col>
          </Row>
          <ul>
            <li
              className={['default-scene-group', isDefault ? 'clicked' : ''].join(' ')}
              onClick={() => this.props.viewSceneGroup()}
            >
                default
            </li>
            {
              this.renderSceneGroupList()
            }
          </ul>

          <SceneGroupForm
            visible={this.state.sceneGroupFormVisible}
            onCancel={this.closeSceneGroupForm}
            onOk={this.confirmSceneGroupForm}
            confirmLoading={this.state.sceneGroupFormLoading}
            stageData={this.state.stageData}
          />
        </div>
      );
    }
}

export default injectIntl(SceneGroupList);
