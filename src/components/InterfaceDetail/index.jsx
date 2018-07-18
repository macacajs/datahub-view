'use strict';

import React from 'react';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

// import {
//   UnControlled as CodeMirror,
// } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/selection/active-line';

import {
  Breadcrumb,
} from 'antd';

import InterfaceSceneList from './InterfaceSceneList';
import InterfaceContextConfig from './InterfaceContextConfig';
import InterfaceProxyConfig from './InterfaceProxyConfig';
import InterfaceSchema from './InterfaceSchema';

import './index.less';

// const codeMirrorOptions = {
//   mode: 'javascript',
//   theme: 'default',
//   indentUnit: 2,
//   tabSize: 2,
//   lineNumbers: true,
//   indentWithTabs: true,
//   matchBrackets: true,
//   smartIndent: true,
//   textWrapping: false,
//   lineWrapping: true,
//   autofocus: true,
//   autoCloseBrackets: true,
//   autoCloseTags: true,
//   foldGutter: true,
//   styleActiveLine: true,
//   gutters: [
//     'CodeMirror-linenumbers',
//     'CodeMirror-foldgutter',
//   ],
// };

const projectName = window.pageConfig.projectName;

class InterfaceDetail extends React.Component {
  render () {
    const { selectedInterface } = this.props;

    const apiHref = `//${location.host}/data/${projectName}/${this.props.selectedInterface.pathname}`;
    return (
      <div className="interface-detail">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/dashboard"><FormattedMessage id="topNav.allProject" /></a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/dashboard">
              {selectedInterface.description}
            </a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <content>
          <section>
            <h1> context config </h1>
            <a href={apiHref}> click to preview </a>
            <InterfaceContextConfig
            />
          </section>

          <section>
            <h1> proxy config </h1>
            <InterfaceProxyConfig
            />
          </section>

          <section className="data-scene">
            <h1>
              <FormattedMessage id='sceneList.title' />
            </h1>
            <InterfaceSceneList
              sceneList={this.props.sceneList}
            />
          </section>

          <section>
            <h1> schema data </h1>
            <InterfaceSchema
            />
          </section>
        </content>
      </div>
    );
  }
}

export default injectIntl(InterfaceDetail);
