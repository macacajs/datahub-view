import React, {
  Component,
} from 'react';

import {
  Col,
  Row,
  Input,
  Button,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import SceneForm from '../forms/SceneForm';
import { sceneService } from '../../service';

const Search = Input.Search;

class InterfaceSceneList extends Component {
  state = {
    sceneFormVisible: false,
    sceneFormLoading: false,
    filterString: '',
    stageData: null,
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  showCreateForm = () => {
    this.setState({
      formType: 'create',
      stageData: null,
      sceneFormVisible: true,
    });
  }

  showUpdateForm = async value => {
    this.setState({
      formType: 'update',
      stageData: value,
      sceneFormVisible: true,
    });
  }

  hideSceneForm = () => {
    this.setState({
      sceneFormVisible: false,
    });
  }

  confirmSceneForm = async ({ sceneName, data }, callback = () => {}) => {
    this.setState({
      sceneFormLoading: true,
    });
    const apiName = this.state.stageData
      ? 'updateScene'
      : 'createScene';
    const res = await sceneService[apiName]({
      uniqId: this.state.stageData && this.state.stageData.uniqId,
      sceneName,
      data,
    });
    this.setState({
      sceneFormLoading: false,
    });
    if (res.success) {
      this.setState({
        sceneFormVisible: false,
      }, () => {
        callback();
        this.props.fetchSceneList();
      });
    }
  }

  filterScene = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  renderSceneList = () => {
    const formatMessage = this.formatMessage;
    const { sceneList } = this.props;
    return sceneList.filter(value =>
      value.pathname.toLowerCase().includes(this.state.filterString) ||
      value.description.toLowerCase().includes(this.state.filterString)
    ).map((value, index) => {
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
            onClick={() => this.setSelectedScene(value.uniqId)}
          >
            <div className="left">
              <h3>{value.pathname}</h3>
              <p>{value.description}</p>
              <p>method: {value.method}
              </p>
            </div>
            <div className="right">
              <Icon
                type="setting"
                onClick={() => this.showUpdateForm(value)}
              />
              <Popconfirm
                title={formatMessage('common.deleteTip')}
                onConfirm={() => this.deleteScene(value.uniqId)}
                okText={formatMessage('common.confirm')}
                cancelText={formatMessage('common.cancel')}
              >
                <Icon className="delete-icon" type="delete" />
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
      <div>
        <Row>
          <Col span={6}>
            <Search
              placeholder={formatMessage('sceneList.searchScene')}
              onChange={this.filterScene}
            />
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              onClick={this.showCreateForm}
            >
              <FormattedMessage id='sceneList.createScene' />
            </Button>
          </Col>
        </Row>

        <ul>
          { this.renderSceneList() }
        </ul>

        <SceneForm
          visible={this.state.sceneFormVisible}
          onCancel={this.hideSceneForm}
          onOk={this.confirmSceneForm}
          confirmLoading={this.state.sceneFormLoading}
          stageData={this.state.stageData}
        />
      </div>
    );
  }
}

export default injectIntl(InterfaceSceneList);
