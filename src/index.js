#!/usr/bin/env node
"use strict";

const minimist = require("minimist");
const Handlebars = require("handlebars");
const _ = require("lodash");
const ejs = require("ejs");

const args = minimist(process.argv.slice(2), {
  string: ["name"],
  default: { name: "world" },
});

const greeting = Handlebars.compile("Hello, {{name}}!")({
  name: _.capitalize(args.name),
});

const rendered = ejs.render("<%= greeting %> (Frogbot v3 demo)", {
  greeting,
});

console.log(rendered);
