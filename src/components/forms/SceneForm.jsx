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

import '../../common/jsonlint';

import {
  UnControlled as CodeMirror,
} from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/display/placeholder';

const codeMirrorOptions = {
  theme: 'default',
  mode: 'application/json',
  lint: true,
  autofocus: true,
  foldGutter: true,
  matchBrackets: true,
  styleActiveLine: true,
  autoCloseBrackets: true,
  showTrailingSpace: true,
  placeholder: '{\n  ... Input JSON data here\n}',
  scrollbarStyle: 'overlay',
  gutters: [
    'CodeMirror-lint-markers',
    'CodeMirror-foldgutter',
  ],
};


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
                pattern: /^[a-z0-9_-]+$/,
              },
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
