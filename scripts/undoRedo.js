function undoRedoManager(undoStack, redoStack) {
  this.undoStack = undoStack || [];
  this.redoStack = redoStack || [];

  this.pushUndo = function(state) {
    this.undoStack.push(state);
  }

  this.undo = function(currentState, callback) {
    let prevState = this.undoStack.pop();
    this.pushRedo(currentState);
    callback(prevState);

    return prevState;
  }

  this.pushRedo = function(state) {
    this.redoStack.push(state);
  }

  this.redo = function(currentState, callback) {
    let prevState = this.redoStack.pop();
    this.pushUndo(currentState);
    callback(prevState);

    return prevState;
  }

  return this;
}
