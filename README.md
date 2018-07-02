# Ticks Tracer

[![npm](https://img.shields.io/npm/v/ticks-tracer.svg)](https://www.npmjs.com/package/ticks-tracer)
[![npm](https://img.shields.io/npm/l/ticks-tracer.svg)](https://github.com/faressoft/ticks-tracer/blob/master/LICENSE)

> Takes snapshots for an object across event loop ticks.

# Hint

Good for testing flow control packages like `flowa`, `async`, `q`, etc.

# Table of Contents  

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [License](#license)

## Installation

```
npm install --save ticks-tracer
```

## Usage

Take snapshot on every `check` phase of the event loop (using `setImmediate` internally).

```js
var TicksTracer = require('ticks-tracer');

// A flow control package
var Flowa = require('flowa');

// The object to trace
var context = {};

// A dummy flow
var flow = new Flowa({
  type: 'series',
  task1: generateDummyTask(1),
  task2: generateDummyTask(2),
  group1: {
    type: 'parallel',
    task3: generateDummyTask(3),
    task4: generateDummyTask(4)
  },
  task5: generateDummyTask(5)
});

// Start tracing
var ticksTracer = new TicksTracer(context);

// Execute the tasks
flow.run(context).then(function(result) {

  // Get the taken snapshots
  console.log(ticksTracer.getSnapshots());
  console.log(ticksTracer.getSnapshotsDiffs());

  // Stop the tracing
  ticksTracer.stop();

});

// Don't worry about this
function generateDummyTask(id) {
  
  return function(context, callback) {
    context['task' + id] = true;
    setImmediate(callback);
  };

}
```

The output is:

```
[
  {},
  { task1: true },
  { task1: true, task2: true },
  { task1: true, task2: true, task3: true, task4: true },
  { task1: true, task2: true, task3: true, task4: true, task5: true }
]
```

## API

<dl>
<dt><a href="#constructor">TicksTracer(tracedObject)</a></dt>
<dd><p>To create a TicksTracer object and start tracing</p></dd>
<dt><a href="#stop">stop()</a></dt>
<dd><p>Stop tracing</p></dd>
<dt><a href="#getTicksCount">getTicksCount()</a> ⇒ <code>Number</code></dt>
<dd><p>Get the current tick number</p></dd>
<dt><a href="#getSnapshotAt">getSnapshotAt(tick)</a> ⇒ <code>Object</code></dt>
<dd><p>Get a taken snapshot by a tick number</p></dd>
<dt><a href="#getSnapshots">getSnapshots()</a> ⇒ <code>Array</code></dt>
<dd><p>Get all taken snapshots indexed by ticks numbers</p></dd>
<dt><a href="#getSnapshotsDiffs">getSnapshotsDiffs()</a> ⇒ <code>Array</code></dt>
<dd><p>Get a list of snapshots that represent only the diffs</p></dd>
</dl>

<a name="constructor"></a>

## TicksTracer(tracedObject)

To create a TicksTracer object and start tracing.

| Param        | Type                | Description                     |
|--------------|---------------------|---------------------------------|
| tracedObject | <code>Object</code> | The object to take snapshots of |

<a name="stop"></a>

## stop()

Stop tracing.

## getTicksCount() ⇒ <code>Number</code>

Get the current tick number.

**Returns**: <code>Number</code>

## getSnapshotAt(tick) ⇒ <code>Object</code>

Get a taken snapshot by a tick number.

| Param | Type                | Description                     |
|-------|---------------------|---------------------------------|
| tick  | <code>Number</code> | The tick number                 |

**Returns**: <code>Object</code>

## getSnapshots() ⇒ <code>Array</code>

Get all taken snapshots indexed by ticks numbers.

**Returns**: <code>Array</code>

## getSnapshotsDiffs() ⇒ <code>Array</code>

Get a list of snapshots that represent only the diffs

**Returns**: <code>Array</code>

# License

This project is under the MIT license.
