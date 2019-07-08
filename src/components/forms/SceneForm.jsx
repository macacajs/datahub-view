import React, {
  Component,
} from 'react';

import {
  Form,
  Input,
  Modal,
  message,
  Collapse,
} from 'antd';

const Panel = Collapse.Panel;

import {
  injectIntl,
} from 'react-intl';

import {
  UnControlled as CodeMirror,
  defaultCodeMirrorOptions as codeMirrorOptions,
} from '../../common/codemirror';

import './SceneForm.less';

const FormItem = Form.Item;

class SceneFormComponent extends Component {
  constructor (props) {
    super(props);
    this.codeMirrorInstance = null;
    this.codeMirrorResHeaderInstance = null;
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  validateCode = () => {
    let [data, responseHeaders, error] = [{}, {}, null];
    try {
      data = JSON.parse(this.codeMirrorInstance.doc.getValue());
      responseHeaders = JSON.parse(this.codeMirrorResHeaderInstance ? this.codeMirrorResHeaderInstance.doc.getValue() : '{}');
    } catch (err) {
      error = err;
    }
    return { data, responseHeaders, error };
  }

  render () {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      stageData,
    } = this.props;
    const {
      getFieldDecorator,
    } = form;
    const formatMessage = this.formatMessage;

    let showResInfo = false;
    if (stageData && stageData.contextConfig) {
      const {
        responseDelay,
        responseStatus,
        responseHeaders,
      } = stageData.contextConfig;
      showResInfo = responseDelay && responseDelay !== '0' || responseStatus && responseStatus !== '200' || responseHeaders && JSON.stringify(responseHeaders) !== '{}';
    }

    return <Modal
      style={{top: '20px'}}
      width='80%'
      wrapClassName='code-modal scene-form-modal'
      visible={visible}
      destroyOnClose={true}
      title={formatMessage(stageData ? 'sceneList.updateScene' : 'sceneList.createScene')}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields((err, values) => {
          if (err) {
            message.warn(formatMessage('common.input.invalid'));
            return;
          }
          const { data, responseHeaders, error } = this.validateCode();
          if (error) {
            message.warn(formatMessage('sceneList.invalidSceneData'));
            return;
          }
          values.data = data;
          values.contextConfig = {
            responseDelay: values.responseDelay,
            responseStatus: values.responseStatus,
            responseHeaders,
          };
          onOk(values);
        });
      }}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical">
        <FormItem label={formatMessage('sceneList.sceneName')}>
          {getFieldDecorator('sceneName', {
            initialValue: stageData && stageData.sceneName,
            rules: [
              {
                required: true,
                message: formatMessage('sceneList.invalidSceneName'),
                pattern: /^[\u4e00-\u9fa5-_a-zA-Z0-9]+$/,
              },
              { max: 128 },
            ],
          })(
            <Input style={{display: 'inline'}}/>
          )}
        </FormItem>

        <Collapse defaultActiveKey={showResInfo ? '0' : ''}>
          <Panel header={formatMessage('sceneList.rewriteResponse')} key="0">
            <FormItem label={formatMessage('contextConfig.responseDelayField')}>
              {getFieldDecorator('responseDelay', {
                initialValue: stageData && stageData.contextConfig && stageData.contextConfig.responseDelay || 0,
                rules: [
                  {
                    message: formatMessage('contextConfig.invalidDelay'),
                    pattern: /^[0-9]{1,2}(\.\d)?$/,
                  },
                ],
              })(
                <Input maxLength={4}/>
              )}
            </FormItem>
            <FormItem label={`${formatMessage('contextConfig.responseStatus')} 200-50x`}>
              {getFieldDecorator('responseStatus', {
                initialValue: stageData && stageData.contextConfig && stageData.contextConfig.responseStatus || 200,
                rules: [
                  {
                    pattern: /^[1-5]\d{2}$/,
                    message: formatMessage('contextConfig.invalidStatus'),
                  },
                ],
              })(
                <Input maxLength={3}/>
              )}
            </FormItem>
            <FormItem className="context-config" label={formatMessage('sceneList.rewriteResponseHeader')}>
              <CodeMirror
                value={stageData && stageData.contextConfig && stageData.contextConfig.responseHeaders ? JSON.stringify(stageData.contextConfig.responseHeaders, null, 2) : '{}'}
                options={codeMirrorOptions}
                editorDidMount={instance => {
                  this.codeMirrorResHeaderInstance = instance;
                }}
              />
            </FormItem>
          </Panel>
        </Collapse>
        <FormItem className="res-data" label={formatMessage('sceneList.responseData')}>
          <CodeMirror
            value={stageData && JSON.stringify(stageData.data, null, 2)}
            options={codeMirrorOptions}
            editorDidMount={instance => {
              this.codeMirrorInstance = instance;
              instance.focus();
            }}
          />
        </FormItem>
      </Form>
    </Modal>;
  }
}

export default Form.create()(injectIntl(SceneFormComponent));
