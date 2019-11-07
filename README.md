# joseph-galindo/unfetch

This is a fork of developit's [unfetch package](https://github.com/developit/unfetch)

The fork was created to support these following features:
- Allow fetch calls in the browser to use [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) as their `options.headers`, instead of being limited to only a JavaScript object literal.
  - Headers instances CANNOT be iterated like simple JavaScript objects correctly (since they are `Iterator`s), and must instead be iterated over using a native (not transpiled) `for...of` loop, or iterated over "by hand" using a `while` loop by leveraging the lower level `Iterator` data structures.