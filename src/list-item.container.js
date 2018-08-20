/**
 * @author arman
 * @since 8/20/18
 *
 */
'use strict';

import React from 'react';
import styled from 'react-emotion';

const ItemWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;

  & + & {
    margin-top: 0;
  }
`;

const CheckboxWrapper = styled('span')`
  margin-right: 0.75em;
`;

const ContentWrapper = styled('span')`
  flex: 1;
  opacity: ${props => (props.checked ? 0.666 : 1)};
  text-decoration: ${props => (props.checked ? 'none' : 'line-through')};

  &:focus {
    outline: none;
  }
`;

class ListItemContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onChange = event => {
    const checked = event.target.checked;
    const { editor, node } = this.props;

    editor.change(c => c.setNodeByKey(node.key, { data: { checked } }));
  };

  render() {
    const { attributes, children, node, readOnly } = this.props;
    const checked = node.data.get('checked');

    return (
      <ItemWrapper {...attributes}>
        <CheckboxWrapper contentEditable={false}>
          <input type="checkbox" checked={checked} onChange={this.onChange} />
        </CheckboxWrapper>
        <ContentWrapper
          checked={checked}
          contentEditable={!readOnly}
          suppressContentEditableWarning >
          {children}
        </ContentWrapper>
      </ItemWrapper>
    )
  }
}

export default ListItemContainer;