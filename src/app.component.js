/**
 * @author arman
 * @since 8/20/18
 *
 */
'use strict';

import React from 'react';
import { Editor } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { Icon, Button, Toolbar } from './components';

const style = {
  root: {
    backgroundColor: '#b9b8b8'
  },
  toolbar: {
    backgroundColor: 'black'
  },
  upload: {
    marginTop: '5px'
  }
};

/**
 *
 * @param {Object} value
 * @param {Object} schema
 * @param {Function} onChange
 * @param {Function} renderNode
 * @param {Function} onDropOrPaste
 * @param {Function} onClickUpload
 * @param {Function} onKeyDown
 * @param {Function} renderMark
 * @param {Function} renderMarkButton
 * @param {Function} renderBlockButton
 * @constructor
 */
const App = ({ value, schema, onChange, renderNode, onDropOrPaste, onClickUpload, onKeyDown, renderMark, renderMarkButton, renderBlockButton  }) => (
  <div style={style.root}>
    <Toolbar style={style.toolbar}>
      <Button onMouseDown={onClickUpload} style={style.upload}>
        <img src="https://png2.kisspng.com/20180405/ccw/kisspng-organization-company-marketing-non-profit-organisa-upload-button-5ac5a4b53139b8.0800972715229021972016.png" alt="Upload Image" width='40' height='40' title="Upload Photo" />
      </Button>
      <form style={{display: 'none'}}>
        <input type="file" accept="image/jpeg, image/png" />
      </form>

      {renderMarkButton('bold', 'format_bold')}
      {renderMarkButton('italic', 'format_italic')}
      {renderMarkButton('underlined', 'format_underlined')}
      {renderMarkButton('code', 'code')}
      {renderBlockButton('heading-one', 'looks_one')}
      {renderBlockButton('heading-two', 'looks_two')}
      {renderBlockButton('block-quote', 'format_quote')}
      {renderBlockButton('numbered-list', 'format_list_numbered')}
      {renderBlockButton('bulleted-list', 'format_list_bulleted')}
    </Toolbar>
    <Editor
      spellCheck
      autoFocus
      placeholder="Enter some rich text..."
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      renderMark={renderMark}
      schema={schema}
      onDrop={onDropOrPaste}
      onPaste={onDropOrPaste}
      renderNode={renderNode} />
  </div>
);

export default App;