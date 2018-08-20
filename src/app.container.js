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

}

export default AppContainer;