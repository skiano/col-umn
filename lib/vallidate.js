
module.exports.checkOverflow = checkOverflow;
module.exports.checkChain = checkChain;

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
function checkChain (idx, previousLinkType, nextLinkType, workingColumn, workingNest) {
  console.log(idx.toFixed(), ':\t', previousLinkType, '-->', nextLinkType)
  return true;
}

