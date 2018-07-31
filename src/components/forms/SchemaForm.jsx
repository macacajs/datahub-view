import React, {
  Component,
} from 'react';

import {
  Form,
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
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';

const codeMirrorOptions = {
  theme: 'default',
  mode: 'application/json',
  lint: true,
  autofocus: true,
  foldGutter: true,
  lineNumbers: true,
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

class SchemaFormComponent extends Component {
  constructor (props) {
    super(props);
    this.codeMirrorInstance = null;
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  validateSchema = () => {
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
      confirmLoading,
      schemaData,
      schemaFormType,
    } = this.props;
    const stageData = schemaData.find(i => i.type === schemaFormType) || {};
    const formatMessage = this.formatMessage;
    return <Modal
      style={{top: '20px'}}
      width='80%'
      wrapClassName='schema-modal'
      visible={visible}
      destroyOnClose={true}
      title={
        <span>Schema&nbsp;&nbsp;
          <a target="_blank"
            href="https://github.com/macacajs/macaca-datahub/blob/2.x/README.md#schema-syntax">
            syntax docs
          </a>
        </span>}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={() => {
        const { data, error } = this.validateSchema();
        if (error) {
          message.warn(formatMessage('schemaData.invalidSchemaData'));
          return;
        }
        const values = {
          data,
          type: schemaFormType,
        };
        onOk(values);
      }}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical">
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

export default Form.create()(injectIntl(SchemaFormComponent));
