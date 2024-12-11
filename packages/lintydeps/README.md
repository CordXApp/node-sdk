# LintyDeps

LintyDeps is a tool designed to find and report missing or unused dependencies and dev dependencies in your project.

---

## Installation

You can install LintyDeps using npm:

```sh
npm install lintydeps --save-dev
```

---

## Basic Usage
You can use LintyDeps by running the following command:

```sh
npx linty <location>
```

For example: 

```sh
npx linty .
```

---

## Configuration
LintyDeps can be configured using a `.lintyrc` file in the root of your project. The configuration file can be in JSON or YAML format. Here is a basic config example in yaml:

```yaml
withoutDev: true
ignoreDirs:
  - node_modules
  - dist
```
