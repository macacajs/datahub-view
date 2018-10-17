import React, {
  Component,
} from 'react';

import {
  Modal,
  Form,
  Input,
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

class ContextFormComponent extends Component {
  constructor (props) {
    super(props);
    this.codeMirrorInstance = null;
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  validateCode = () => {
    let [data, error] = [{}, null];
    try {
      data = JSON.parse(this.codeMirrorInstance.doc.getValue());
      if (Object.prototype.toString.call(data) !== '[object Object]') {
        error = new TypeError();
      }
    } catch (err) {
      error = err;
    }
    return { data, error };
  }

  render () {
    const props = this.props;
    const formatMessage = this.formatMessage;
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      stageData,
    } = props;
    const {
      getFieldDecorator,
    } = form;
    return <Modal
      visible={visible}
      wrapClassName='context-config-modal'
      destroyOnClose={true}
      title={formatMessage('contextConfig.modifyProperty')}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields((err, values) => {
          if (err) {
            message.warn(formatMessage('common.input.invalid'));
            return;
          }
          const { data, error } = this.validateCode();
          if (error) {
            message.warn(formatMessage('contextConfig.invalidResponseHeaders'));
            return;
          }
          values.responseHeaders = data;
          onOk(values);
        });
      }}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical">
        <FormItem label={formatMessage('contextConfig.responseDelayField')}>
          {getFieldDecorator('responseDelay', {
            initialValue: stageData && stageData.responseDelay,
            rules: [
              {
                message: formatMessage('contextConfig.invalidDelay'),
                pattern: /^[0-9]{1,2}(\.\d)?$/,
              },
            ],
          })(
            <Input maxLength="4"/>
          )}
        </FormItem>
        <FormItem label={`${formatMessage('contextConfig.responseStatus')} 200-50x`}>
          {getFieldDecorator('responseStatus', {
            initialValue: stageData && stageData.responseStatus,
            rules: [
              {
                pattern: /^[1-5]\d{2}$/,
                message: formatMessage('contextConfig.invalidStatus'),
              },
            ],
          })(
            <Input maxLength="3"/>
          )}
        </FormItem>
        <FormItem label='Rewrite response headers in JSON format'>
          <CodeMirror
            value={stageData && stageData.responseHeaders ? JSON.stringify(stageData.responseHeaders, null, 2) : '{}'}
            options={{
              ...codeMirrorOptions,
              foldGutter: false,
              lineNumbers: false,
            }}
            editorDidMount={instance => {
              this.codeMirrorInstance = instance;
            }}
          />
        </FormItem>
      </Form>
    </Modal>;
  }
}

export default Form.create()(injectIntl(ContextFormComponent));
