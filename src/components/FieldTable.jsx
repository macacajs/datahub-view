import React from 'react';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import {
  UnControlled as CodeMirror,
} from 'react-codemirror2';

import {
  Alert,
  Button,
  Modal,
  Checkbox,
} from 'antd';

import CustomTable from './CustomTable';

const parseString = (string) => {
  try {
    return JSON.parse(string || '{}');
  } catch (e) {
    return {};
  }
};

class FieldTable extends React.Component {
  constructor (props) {
    super(props);

    const schemaContent = parseString(props.schemaContent);
    this.state = {
      schemaField: props.type === 'req' ? 'reqSchemaContent' : 'resSchemaContent',
      title: props.type === 'req' ? 'fieldDes.req.title' : 'fieldDes.res.title',
      schemaModalVisible: false,
      schemaJSONParseError: false,
      schemaData: schemaContent.schemaData,
      enableSchemaValidate: schemaContent.enableSchemaValidate,
    };
  }

  componentWillReceiveProps (props) {
    const schemaContent = parseString(props.schemaContent); ;
    this.setState({
      schemaData: schemaContent.schemaData,
      enableSchemaValidate: schemaContent.enableSchemaValidate,
    });
  }

  editSchema () {
    this.setState({
      schemaModalVisible: true,
      schemaJSONParseError: false,
      schemaNewData: JSON.stringify(this.state.schemaData, null, 2),
    });
  }

  schemaModalTextAreaChange (editor, data, value) {
    this.setState({
      schemaNewData: value.trim(),
      schemaJSONParseError: false,
    });
  }

  confirmSchemaModal (data) {
    try {
      const newData = JSON.parse(this.state.schemaNewData);
      if (!(newData instanceof Array)) {
        this.setState({
          schemaFormatError: true,
        });
        return;
      }
      this.setState({
        schemaModalVisible: false,
      });
      this.props.handleAsynSecType(this.state.schemaField, JSON.stringify({
        enableSchemaValidate: this.state.enableSchemaValidate,
        schemaData: newData,
      }));
    } catch (e) {
      this.setState({
        schemaJSONParseError: true,
      });
    }
  }

  toggleSchemaValidate (e) {
    this.props.handleAsynSecType(this.state.schemaField, JSON.stringify({
      enableSchemaValidate: e.target.checked,
      schemaData: this.state.schemaData,
    }));
  }

  cancelSchemaModal () {
    this.setState({
      schemaModalVisible: false,
      schemaJSONParseError: false,
      schemaNewData: '{}',
    });
  }

  onSetSchemaData (data) {
    this.setState({
      schemaData: data,
      schemaNewData: JSON.stringify(data, null, 2),
    });
    try {
      this.props.handleAsynSecType(this.state.schemaField, JSON.stringify({
        enableSchemaValidate: this.state.enableSchemaValidate,
        schemaData: this.state.schemaData,
      }));
    } catch (e) {
    }
  }

  render () {
    return (
      <div>
        <Modal
          className="codemirror-modal"
          width="80%"
          title="schema"
          visible={this.state.schemaModalVisible}
          onOk={this.confirmSchemaModal.bind(this)}
          cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}
          okText={this.props.intl.formatMessage({id: 'common.confirm'})}
          onCancel={this.cancelSchemaModal.bind(this)}
        >
          <CodeMirror
            value={this.state.schemaNewData}
            options={{ ...this.props.codeMirrorOptions }}
            onChange={this.schemaModalTextAreaChange.bind(this)}
          />
          {this.state.schemaJSONParseError && <Alert style={{marginTop: '20px'}} message={this.props.intl.formatMessage({id: 'fieldDes.jsonFormatError'})} type="warning" />}
          {this.state.schemaFormatError && <Alert style={{marginTop: '20px'}} message={this.props.intl.formatMessage({id: 'fieldDes.pleaseInputArray'})} type="warning" />}
        </Modal>
        <section className="params-doc">
          <h1><FormattedMessage id={this.state.title} /></h1>
          <Checkbox
            checked={this.state.enableSchemaValidate}
            onChange={this.toggleSchemaValidate.bind(this)}
          >
            <FormattedMessage id='fieldDes.isUseCheck' />
          </Checkbox>
          <Button size="small" type="primary" onClick={this.editSchema.bind(this)}><FormattedMessage id='common.edit' /></Button>
          <CustomTable
            type="schema"
            className="schema-table"
            schemaData={this.state.schemaData}
            onChange={this.onSetSchemaData.bind(this)}
          />
        </section>
      </div>
    );
  }
}

export default injectIntl(FieldTable);
