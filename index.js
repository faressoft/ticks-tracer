/**
 * Ticks Tracer
 * Takes snapshots for an object across event loop ticks
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var clone = require('clone');

/**
 * Ticks Tracer
 * 
 * @param {Object} tracedObject
 */
function TicksTracer(tracedObject) {

  /**
   * The current tick number
   * @type {Number}
   */
  this._ticksCounter = 0;

  /**
   * To store the taken snapshots indexed by ticks numbers
   * @type {Array}
   */
  this._snapshots = [];

  /**
   * Is taking snapshots stopped
   * @type {Boolean}
   */
  this._isStopped = false;

  /**
   * The object to take snapshots of
   * @type {Object}
   */
  this._tracedObject = tracedObject;

  // Stat tracing
  this._tracing();

}

/**
 * Take a snapshot for the traced object
 */
TicksTracer.prototype._takeSnapshot = function() {

  this._snapshots[this._ticksCounter] = clone(this._tracedObject);
  
};

/**
 * Start tracing
 *
 * - Keeps calling itself after each event loop tick.
 * - Stops when the `_isStopped` flag is true.
 * - On each tick:
 *   - Call `_takeSnapshot()`
 *   - Increment the `_ticksCounter`
 */
TicksTracer.prototype._tracing = function() {

  if (this._isStopped) {
    return;
  }

  this._takeSnapshot();
  this._ticksCounter++;

  setImmediate(this._tracing.bind(this));
  
};

/**
 * Get the current tick number
 * 
 * @return {Number}
 */
TicksTracer.prototype.getTicksCount = function() {

  return this._ticksCounter;
  
};

/**
 * Get a taken snapshot by a tick number
 * 
 * @param  {Number} tick
 * @return {Object}
 */
TicksTracer.prototype.getSnapshotAt = function(tick) {

  return this._snapshots[tick];
  
};

/**
 * Get all taken snapshots indexed by ticks numbers
 * 
 * @return {Array}
 */
TicksTracer.prototype.getSnapshots = function() {

  return this._snapshots;
  
};

/**
 * Get a list of snapshots that represent only the diffs
 * 
 * @return {Array}
 */
TicksTracer.prototype.getSnapshotsDiffs = function() {

  var diffs = [];
  var self = this;

  self._snapshots.forEach(function(snapshot, index) {

    var prevSnapshotKeys = null;
    var diff = {};

    if (index == 0) {
      diffs.push(snapshot);
      return;
    }

    prevSnapshotKeys = Object.keys(self._snapshots[index - 1]);

    for (var key in self._snapshots[index]) {
    
      if (prevSnapshotKeys.indexOf(key) == -1) {
        diff[key] = self._snapshots[index][key];
      }
    
    }

    diffs.push(diff);
    
  });

  return diffs;
  
};

/**
 * Stop tracing
 * 
 * @return {Object}
 */
TicksTracer.prototype.stop = function() {

  this._isStopped = true;
  
};

module.exports = TicksTracer;
