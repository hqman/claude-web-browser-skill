# claude-web-browser-skill

Forked from [mitsuhiko/agent-commands/skills/web-browser](https://github.com/mitsuhiko/agent-commands/tree/main/skills/web-browser) with modifications.

## About

This is a web browser skill for Claude Code that allows interaction with web pages through Chrome DevTools Protocol (CDP). It provides tools for automated browser control including navigation, JavaScript execution, screenshots, and element selection.

## Modifications from Original

This fork includes the following changes:
- Default behavior: Chrome starts with profile by default (no `--profile` flag needed)
- Added `.gitignore` for common development files
- Package configuration updates for better dependency management

## Features

- **Browser Control**: Launch Chrome/Chromium with remote debugging
- **Navigation**: Open URLs in current or new tabs
- **JavaScript Execution**: Run JavaScript code in the active tab
- **Screenshots**: Capture viewport screenshots
- **Element Picker**: Interactive element selection tool

See [SKILL.md](./SKILL.md) for detailed usage instructions.
