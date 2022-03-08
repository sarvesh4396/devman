const { js_examples } = require("../train/javascript");
const { py_examples } = require("../train/python");

const start_tokens = { javascript: "/**", typescript: "/**", python: '"""' };
const stop_tokens = { javascript: "*/", typescript: "*/", python: '"""' };

const generating_str = {
  javascript: `/**
    * Docstring for the above code:`,
  typescript: `/**
    * Docstring for the above code:`,
  python: `"""
    Docstring for the above code:`,
};
const algo_to_code_str = {
  javascript: `/**
  Write the above algorithm in javascript:`,
  typescript: `/**
  Write the above algorithm in typescript:`,
  python: `"""
  Explanation of what the above python code does`,
};
const code_to_algo_str = {
  javascript: `/**
  Explain the algorithm of above code`,
  typescript: `/**
  Explain the algorithm of above code`,
  python: `"""
  Explain above code of language python`,
};
const languages = {
  javascript: js_examples,
  typescript: js_examples,
  python: py_examples,
};
module.exports = {
  start_tokens,
  stop_tokens,
  generating_str,
  languages,
  algo_to_code_str,
  code_to_algo_str,
};
