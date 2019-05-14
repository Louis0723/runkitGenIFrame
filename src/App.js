import React, { Fragment } from 'react';
import * as monaco from 'monaco-editor';
import * as debounce from 'lodash/debounce';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 'const _ = require("lodash");\n_.chunk(["a", "b", "c", "d"], 2);'
    }
  }

  runkitCode(code) {
    let base64code = encodeURIComponent(Buffer.from(code).toString('base64'))
    let iframe = `<iframe src="https://runkit.com/e?base64source=${base64code}" frameborder="0" style="width: 100%;"></iframe>`;
    this.setState({ code: iframe })
    return iframe;
  }

  componentDidMount() {
    if (!this.editor2) {
      let editor = monaco.editor.create(document.getElementById("editor"), {
        value: "// javascript",
        language: "javascript",
        theme: "vs-dark"
      });
      editor.onDidChangeModelContent(
        debounce(() => {
          let code = editor.getValue()
          let iframe = this.runkitCode(code)
          this.editor2.setValue(iframe);
        }, 2000)
      )

      this.editor2 = monaco.editor.create(document.getElementById("editor2"), {
        value: "<!-- iframe tag -->",
        language: "html",
        theme: "vs-dark",
      });

      this.editor2.onDidChangeModelContent(
        debounce(() => {
          let code = this.editor2.getValue()
          this.setState({ code })
        }, 2000)
      )
      this.runkitCode(this.state.code)
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
        <p>
          preview
          <div dangerouslySetInnerHTML={{ __html: this.state.code }} />
        </p>
      </Fragment>
    );
  }
}

export default App