import React, { Fragment } from 'react';
import * as monaco from 'monaco-editor';
import * as _ from 'lodash'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    }
  }

  componentDidMount() {
    if (!this.editor2) {
      let editor = monaco.editor.create(document.getElementById("editor"), {
        language: "javascript",
        theme: "vs-dark"
      });
      editor.onDidChangeModelContent(
        _.debounce(() => {
          let code = editor.getValue()
          let base64code = encodeURIComponent(Buffer.from(code).toString('base64'))
          let iframe = `<iframe src="https://runkit.com/e?base64source=${base64code}" frameborder="0" style="width: 100%;"></iframe>`;
          this.editor2.setValue(iframe);
          this.setState({ code: iframe })
        }, 2000)
      )

      this.editor2 = monaco.editor.create(document.getElementById("editor2"), {
        language: "html",
        theme: "vs-dark",
      });

      this.editor2.onDidChangeModelContent(
        _.debounce(() => {
          let code = this.editor2.getValue()
          this.setState({ code })
        },2000)
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
        <div dangerouslySetInnerHTML={{ __html: this.state.code }} />
      </Fragment>
    );
  }
}

export default App