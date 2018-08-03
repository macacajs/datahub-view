import React, {
  Component,
} from 'react';

import {
  Form,
  Input,
  Modal,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

import {
  UnControlled as CodeMirror,
  defaultCodeMirrorOptions as codeMirrorOptions,
} from '../../common/codemirror';

const FormItem = Form.Item;

class SceneFormComponent extends Component {
  constructor (props) {
    super(props);
    this.codeMirrorInstance = null;
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  validateCode = () => {
    let [data, error] = [{}, null];
    try {
      data = JSON.parse(this.codeMirrorInstance.doc.getValue());
    } catch (err) {
      error = err;
    }
    return { data, error };
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
    return <Modal
      style={{top: '20px'}}
      width='80%'
      wrapClassName='code-modal'
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
          const { data, error } = this.validateCode();
          if (error) {
            message.warn(formatMessage('sceneList.invalidSceneData'));
            return;
          }
          values.data = data;
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
                pattern: /^[a-zA-Z0-9_-]+$/,
              },
              { max: 128 },
            ],
          })(
            <Input/>
          )}
        </FormItem>
        <CodeMirror
          value={stageData && JSON.stringify(stageData.data, null, 2)}
          options={codeMirrorOptions}
          editorDidMount={instance => {
            this.codeMirrorInstance = instance;
            instance.focus();
          }}
        />
      </Form>
    </Modal>;
  }
}

export default Form.create()(injectIntl(SceneFormComponent));
