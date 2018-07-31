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
  defaultCodeMirrorOptions as codeMirrorOptions,
} from '../../common/codemirror';

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
