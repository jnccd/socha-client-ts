# Typescript client for Software-Challenge Germany 2022/2023

[![Discord](https://img.shields.io/discord/233577109363097601?color=blue&label=Discord)](https://discord.gg/ARZamDptG5)
[![Documentation](https://img.shields.io/badge/Software--Challenge%20-Documentation-%234299e1)](https://docs.software-challenge.de/)

This repository contains a random client for the game "Hey, Danke für den Fisch" written for Typescript and Node JS.

Because it is a random client, it will only do seemingly random moves. If you wish to build your own client on top of this one you can follow the instructions below. 

## Usage

You can either [clone this repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) or download it as an archive using the green `<> Code` button in the top right.

To build the code you need to install [the Typescript transpiler](https://www.typescriptlang.org/id/download) and [Node.js Version 18](https://nodejs.org/download/release/v18.9.0/)!

Once everything is prepared you can add your code to the `logic.js` file using any IDE you like, however I would recommend Visual Studio Code.

To setup this project execute the following in the console:

```npm install```

To build and run it write this:

```tsc && node output/logic.js```

If you wish to pass program arguments to the `node ` execution you can use `--` like so:

```node output/logic.js -- --help```
