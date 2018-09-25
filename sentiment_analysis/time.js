const {
  performance,
  PerformanceObserver
} = require('perf_hooks');

function someFunction() {
  setTimeout(function () {
  console.log('hello world');

}, 5000)
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();