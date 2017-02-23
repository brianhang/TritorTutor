import React from 'react'

import { FormGroup, InputGroup, FormControl, Button, Glyphicon, Panel } from 'react-bootstrap'

class TutorNameFilter extends React.Component {
  render() {
    return (
      <Panel header='Filter by Name' />
      <FormGroup>
        <InputGroup>
          <FormControl type='text' placeholder='Name' />
          <InputGroup.Button>
            <Button><Glyphicon glyph='search' /></Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
      </Panel>
    );
  }
}

TutorNameFilter.displayName = 'TutorNameFilter';

export default TutorNameFilter
