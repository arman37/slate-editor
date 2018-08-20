/**
 * @author arman
 * @since 8/20/18
 *
 */
'use strict';

import React from 'react';
import isUrl from 'is-url';
import styled from 'react-emotion';
import { Block, Value } from 'slate';
import initialValue from './value.json';
import App from './app.component';
import { isKeyHotkey } from 'is-hotkey';
import imageExtensions from 'image-extensions';
import { Button, Icon, Toolbar } from './components';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';
import { Editor, getEventRange, getEventTransfer } from 'slate-react';


const DEFAULT_NODE = 'paragraph';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`;

function isImage(url) {
  return !!imageExtensions.find(url.endsWith)
}

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (change, reason, { node, child }) => {
      switch (reason) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Block.create('paragraph')
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    },
  },
};

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(initialValue)
    };
  }

  componentDidMount() {
    this._handleImageUpload();
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  renderNode = props => {
    const { attributes, children, node, isFocused } = props;

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;

      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;

      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;

      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;

      case 'list-item':
        return <li {...attributes}>{children}</li>;

      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;

      case 'image': {
        const src = node.data.get('src');
        return <Image src={src} selected={isFocused} {...attributes} />
      }
    }
  };

  /****************************************** Image Specific Handlers*******************************************/
  _handleImageUpload = () => {
    let insertImage = this.insertImage;
    let _self = this;

    document.querySelector('form input[type=file]').addEventListener('change', (event) => {
      event.preventDefault();

      let files = event.target.files;

      if (typeof files[0] !== 'object') return false;

      _self.state.value.change().call(insertImage, files[0], undefined, _self);
    });
  };

  insertImage(change, file, target, context) {
    let _self = context;

    if (target) {
      change.select(target);
    }

    let reader  = new FileReader();

    // listen for 'load' events on the FileReader
    reader.addEventListener("load", function () {
      let src = reader.result;
      change.insertBlock({
        type: 'image',
        isVoid: true,
        data: { src },
      });

      _self.onChange(change);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  onDropOrPaste = (event, change, editor) => {
    const target = getEventRange(event, change.value);
    if (!target && event.type == 'drop') return;

    const transfer = getEventTransfer(event);
    const { type, text, files } = transfer;

    if (type == 'files') {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');
        if (mime != 'image') continue;

        reader.addEventListener('load', () => {
          editor.change(c => {
            c.call(this.insertImage, reader.result, target);
          })
        });

        reader.readAsDataURL(file);
      }
    }

    if (type == 'text') {
      if (!isUrl(text)) return;
      if (!isImage(text)) return;

      change.call(insertImage, text, target);
    }
  };

  /********************************************* Text Specific Handlers *****************************************/
  hasMark = (type) => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  hasBlock = (type) => {
    const { value } = this.state;
    return value.blocks.some(node => node.type == type);
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)} >

        <Icon>{icon}</Icon>
      </Button>
    )
  };

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value } = this.state;
      const parent = value.document.getParent(value.blocks.first().key);

      isActive = this.hasBlock('list-item') && parent && parent.type === type;
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)} >

        <Icon>{icon}</Icon>
      </Button>
    )
  };

}

export default AppContainer;