# jaymock-cli

[![CircleCI](https://img.shields.io/circleci/build/github/unmock/jaymock-cli?style=for-the-badge)](https://circleci.com/gh/unmock/jaymock-cli) [![XO](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=for-the-badge)](https://github.com/xojs/xo) [![Codecov](https://img.shields.io/codecov/c/github/unmock/jaymock-cli?style=for-the-badge)](https://codecov.io/gh/unmock/jaymock-cli)

> Mock an API and generate fake JSON test data, right from the terminal.

## Install

```
~ ❯❯❯ npm install --global @unmock/jaymock-cli
```

## Usage

```
  Usage
    $ jaymock <text> [--json]
    $ cat <file> | jaymock [--json]
    $ jaymock --server [--port <number>]
   
  Options
    --json, -j    Print output in JSON format
    --server, -s  Start the development server
    --port, -p    Specify a port number for the server
   
  Examples
    $ jaymock '{"firstName":"name.firstName", "lastName":"name.lastName"}'
    {
      "firstName": "Alvina",
      "lastName": "Hodkiewicz"
    }
    $ jaymock '{"firstName":"name.firstName", "lastName":"name.lastName"}' --json
    {"firstName":"Anthony","lastName":"Krajcik"}
    $ jaymock --server --port 1337
```

## Related

- [jaymock](https://github.com/unmock/jaymock) - API for this module
- [micro-jaymock](https://github.com/unmock/micro-jaymock) - Tiny API mocking microservice, which uses jaymock

## Contributing

Thanks for wanting to contribute! We will soon have a contributing page
detailing how to contribute. Meanwhile, feel free to star this repository, open issues,
and ask for more features and support.

Please note that this project is governed by the [Unmock Community Code of Conduct](https://github.com/unmock/code-of-conduct). By participating in this project, you agree to abide by its terms.

## License

MIT © [Meeshkan](http://meeshkan.com/)