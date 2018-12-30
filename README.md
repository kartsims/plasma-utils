# plasma-utils
`plasma-utils` is the set of core utilities for the Plasma Group series of projects. These utilities can be imported into other projects when necessary or convenient.

## Installation
There are several easy ways to start using `plasma-utils`! 

### Node.js
If you're developing a `Node.js` application, you can simply install `plasma-utils` via `npm`:

```
$ npm install --save plasma-utils
```

### Browser
If you're developing a browser application, we provide a compressed and minified version of `plasma-utils` that you can include in a `<script>` tag.

```
<script src="https://cdn.plasma.group/scripts/plasma-utils.min.js" type="text/javascript"></script>
```

## Contributing
Welcome! If you're looking to contribute to `plasma-utils`, you're in the right place.

### Contributing Guide and CoC
Plasma Group follows a [Contributing Guide and Code of Conduct](https://github.com/plasma-group/plasma-utils/blob/master/.github/CONTRIBUTING.md) adapted slightly from the [Contributor Covenant](https://www.contributor-covenant.org/version/1/4/code-of-conduct.html). All contributors are expected to read through this guide. We're here to cultivate a welcoming and inclusive contributing environment, and every new contributor needs to do their part to uphold our community standards.

### Requirements and Setup
#### Node.js
`plasma-utils` is tested and built with [`Node.js`](https://nodejs.org/en/). Although you **do not need [`Node.js`] to use this library in your application**, you'll need to install `Node.js` (and it's corresponding package manager, `npm`) for your system before contributing.

`plasma-utils` has been tested on the following versions of Node:

- 10.14.2

If you're having trouble getting a component of `plasma-utils` running, please make sure you have one of the above `Node.js` versions installed.

#### Packages
`plasma-utils` makes use of several `npm` packages.

Install all required packages with:

```
$ npm install
```

### Running Tests
`plasma-utils` makes use of a combination of [`Mocha`](https://mochajs.org/) (a testing framework) and [`Chai`](https://www.chaijs.com/) (an assertion library) for testing.

Run all tests with:

```
$ npm test
```

### Building
We're using `gulp` to provide a process to build `plasma-utils` for in-browser usage.

If you'd like to build `plasma-utils` yourself, simply run:

```
$ npm run build
```
