import React, {Component} from 'react';
import SpareOnDrop from './integrations/SpareOnDrop';

class Demo extends Component {
  state = {
    showCustomizedBoard: false,
    showWithMoveValidation: false,
    showRandomVsRandomGame: false,
    showPlayRandomMoveEngine: false,
    showAllowDragFeature: false,
    showPrestoChango: false,
    showUndoMove: false,
    showSpareOnDrop: false
  };

  render() {
    return (
      <div className="app" style={boardsContainer}>
        <SpareOnDrop/>
      </div>
    );
  }
}

export default Demo;

const boardsContainer = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '100vw',
  marginBlock: 30,
};
