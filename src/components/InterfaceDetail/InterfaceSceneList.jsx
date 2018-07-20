import React, {
  Component,
} from 'react';

import {
  Icon,
  Input,
  Button,
  Tooltip,
} from 'antd';

import {
  Row,
  Col,
} from 'react-flexbox-grid';

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

  formatMessage = id => this.props.intl.formatMessage({ id })

  showSceneForm = () => {
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

  confirmSceneForm = async ({ sceneName, data }) => {
    const { uniqId: interfaceUniqId } = this.props.interfaceData;
    this.setState({
      sceneFormLoading: true,
    });
    const apiName = this.state.stageData
      ? 'updateScene'
      : 'createScene';
    const res = await sceneService[apiName]({
      uniqId: this.state.stageData && this.state.stageData.uniqId,
      interfaceUniqId,
      sceneName,
      data,
    });
    this.setState({
      sceneFormLoading: false,
    });
    if (res.success) {
      this.setState({
        sceneFormVisible: false,
      }, this.postCreate);
    }
  }

  postCreate = async value => {
    await this.props.updateInterFaceAndScene();
  }

  filterScene = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  defaultColProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 3,
  }

  renderSceneList = () => {
    const formatMessage = this.formatMessage;
    const { sceneList, selectedScene } = this.props;
    return (
      <Row>
        {
          sceneList.filter(value => {
            return value.sceneName.toLowerCase().includes(this.state.filterString);
          }).map(value => {
            const isAvtive = selectedScene.uniqId === value.uniqId;
            const classNames = isAvtive ? [
              'scene-list-item',
              'scene-list-item-active',
            ] : [ 'scene-list-item' ];
            return <Col
              {...this.defaultColProps}
              key={value.uniqId}
            >
              <div className={classNames.join(' ')}>
                <div className="scene-name"
                  title={`${formatMessage('sceneList.sceneName')} ${value.sceneName}`}
                  onClick={() => this.props.changeSelectedScene(value)}
                >
                  {value.sceneName}
                </div>
                <div className="scene-operation">
                  <Tooltip title={formatMessage('sceneList.updateScene')}>
                    <Icon type="edit"
                      style={{ lineHeight: '20px', padding: '10px 5px' }}
                      onClick={() => this.showUpdateForm(value)}
                    />
                  </Tooltip>
                  <Tooltip title={formatMessage('sceneList.deleteScene')}>
                    <Icon type="delete"
                      style={{ color: '#f5222d', lineHeight: '20px', padding: '10px 5px' }}
                      onClick={() => this.props.deleteScene(value)}
                    />
                  </Tooltip>
                </div>
              </div>
            </Col>;
          })
        }
      </Row>
    );
  }

  render () {
    const formatMessage = this.formatMessage;
    return (
      <section>
        <h1><FormattedMessage id='sceneList.title' /></h1>
        <a href={this.props.previewLink} target="_blank">{formatMessage('interfaceDetail.previewData')}</a>
        <Row style={{padding: '4px 0'}}>
          <Col {...this.defaultColProps}>
            <Search
              placeholder={formatMessage('sceneList.searchScene')}
              onChange={this.filterScene}
            />
          </Col>
          <Col {...this.defaultColProps}>
            <Button
              type="primary"
              onClick={this.showSceneForm}
            >
              <FormattedMessage id='sceneList.createScene' />
            </Button>
          </Col>
        </Row>

        { this.renderSceneList() }

        <SceneForm
          visible={this.state.sceneFormVisible}
          onCancel={this.hideSceneForm}
          onOk={this.confirmSceneForm}
          confirmLoading={this.state.sceneFormLoading}
          stageData={this.state.stageData}
        />
      </section>
    );
  }
}

export default injectIntl(InterfaceSceneList);
