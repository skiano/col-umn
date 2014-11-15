
module.exports.checkOverflow = checkOverflow;
module.exports.checkStateChange = checkStateChange;

/*
 * The grid is invalid
 * if the child columns ever exceed
 * the nests `capacity`
 *
 */
function checkOverflow (workingNest, linkIdx) {
  if (workingNest.expects < 0) {
    throw new Error('too much material');
  }
}

/*
 * Certain chain patterns
 * are not valid
 * and the user needs to know
 * when mistakes are made
 * and where they come from
 *
 */
function checkStateChange (oldState, newState, expectations, linkIdx) {
  return true;
}

