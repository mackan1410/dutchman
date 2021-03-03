
/*
  Class for managing undo/redo.
  The manager keeps track of states.

  Author: Markus Hellgren
*/

function undoRedoManager(undoStack, redoStack, limit) {
  this.undoStack = undoStack || []; // the undo stack
  this.redoStack = redoStack || []; // the redo stack
  this.limit = limit || 5; // how many undo and redo states the manager can keep track of, default is 5

  /*
    Pushes a state to the undo stack
  */
  this.pushUndo = function(state) {
    if(this.undoStack.length == this.limit) this.undoStack.shift();
    this.undoStack.push(state);
  }

  /*
    Restores a state from the undo stack
  */
  this.undo = function(currentState, callback) {
    let prevState = this.undoStack.pop();
    this.pushRedo(currentState);
    callback(prevState);

    return prevState;
  }

  /*
    Pushes a state to the redo stack
  */
  this.pushRedo = function(state) {
    if(this.redoStack.length == this.limit) this.redoStack.shift();
    this.redoStack.push(state);
  }

  /*
    Restores a state from the redo stack
  */
  this.redo = function(currentState, callback) {
    let prevState = this.redoStack.pop();
    this.pushUndo(currentState);
    callback(prevState);

    return prevState;
  }

  return this;
}
