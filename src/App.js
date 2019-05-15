import React, { Fragment } from 'react';
import * as monaco from 'monaco-editor';
import * as debounce from 'lodash/debounce';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: window.localStorage.getItem('code') || '// javascript\nconst _ = require("lodash");\n_.chunk(["a", "b", "c", "d"], 2);'
    }
  }

  runkitCode(code) {
    const base64code = encodeURIComponent(Buffer.from(code).toString('base64'))
    const iframe = `<iframe src="https://runkit.com/e?base64source=${base64code}" frameborder="0" style="width: 100%;"></iframe>`;
    this.setState({ code: iframe })
    return iframe;
  }

  componentDidMount() {
    if (!this.editor2) {
      const editor = monaco.editor.create(document.getElementById("editor"), {
        value: this.state.code,
        language: "javascript",
        theme: "vs-dark"
      });
      editor.onDidChangeModelContent(
        debounce(() => {
          const code = editor.getValue()
          window.localStorage.setItem('code', code)
          const iframe = this.runkitCode(code)
          this.editor2.setValue(iframe);
        }, 2000)
      )
      const iframe = this.runkitCode(this.state.code);

      this.editor2 = monaco.editor.create(document.getElementById("editor2"), {
        value: "<!-- iframe tag -->\n" + iframe,
        language: "html",
        theme: "vs-dark",
      });

      this.editor2.onDidChangeModelContent(
        debounce(() => {
          const code = this.editor2.getValue()
          this.setState({ code })
        }, 2000)
      )
    }
  }

  render() {
    return (
      <Fragment>
        <div id="editor" key="editor"
          style={{ width: '100%', height: '200px' }}
        />
        <div id="editor2" key="editor2"
          style={{ width: '100%', height: '100px' }}
        />
        <div style={{ margin: '0px' }}>
          preview
          <div dangerouslySetInnerHTML={{ __html: this.state.code }} />
        </div>
      </Fragment>
    );
  }
}

export default App