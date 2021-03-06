# Voracious

Voracious is a (prototype) tool for foreign language learners to get the most out of watching TV and movies. It lets you easily:
- simultaneously display foreign and native subtitles
- train your listen/comprehension with a "quiz mode" that automatically pauses after each subtitle
- replay the current subtitle to re-listen to tricky speech
- highlight words/phrases for later study
- export highlights for SRS in Anki
- automatically generate furigana for Japanese text
- _(coming soon)_ hover over words to see definitions
- _(coming soon)_ study comics/images as well, with OCR

# Using Voracious (Quick Start)

- Click `+ Add Video`
- Paste a link to a video in the Video URL field and click `Set URL`
- Click `Import Subs` to add subtitle tracks. Ideally you should add at least two subtitle tracks:
 - One in the same langauge as the video (transcription)
 - And then one in your native language (translation)
- Use the video controls and buttons/key-shorcuts to play video, change quiz modes, etc.
- (Japanese only) hover/click on words

# Development

(Note: development has only been tested on macOS, though effort has been made to make it cross-platform)

## Overview and repo structure

Voracious is mostly built as a single-page web app with React (using `create-react-app`), and then packaged as a cross-platform desktop app using Electron. As with a normal `create-react-app`-based app, the bulk of the code is in `src/` with some static resources in `public/`. The output of webpack (after `yarn react-build`) will go into `build/`. Electron-builder is used to package the resulting build into an Electron-based app, with its output going to `dist/`.

The `app/` dir contains a small amount of code and config related to Electron. The main Electron entry point is `app/electron-main.js`, and `app/package.json` is the `package.json` that's distributed in the final app.

Most third-party dependencies are pure JS (`react`, `immutable`, etc.) and are declared in the root `package.json`. Those are bundled with the the Voracious code (by webpack) into a single JS file. That means that the root `node_modules/` does _not_ needed to be distributed with the final Electron app. This sort of bundling isn't generally necessary to do for Electron apps, but it's convenient for various reasons.

Dependencies that use native code (e.g. `sqlite`) need to be compiled against the Electron V8 runtime, and are declared in `app/package.json`. The corresponding `app/node_modules/` _is_ packaged into the final distributed Electron app.

Electron-builder is configured via `electron-builder.json`. The current config has it basically combine the contents of `build/` and `app/` to form the distributed archive.

## Installing for development

```
$ yarn # install pure-JS and development dependencies
$ cd app
$ yarn # install dependencies that include native code in app/ subdir
$ cd ..
$ yarn rebuild-native # rebuild native deps in app/node_modules against correct Electron V8 runtime
```

## Running in development mode

Start the React development server with:
```
$ yarn react-start
```

Once the React server has started up, **in a separate terminal** run:
```
$ yarn electron-start
```

The Electron app will open, with the main window serving from the development server (localhost:3000). Edits to the source will cause it to automatically reload.

## Building for release

First build the JS:
```
$ yarn react-build
```

Then build the distributable desktop app:
```
$ yarn dist
```

The output zip and DMG can then be found in the `dist` dir.

If you don't need the zip/DMG archives, then just run:

```
$ yarn dist-mac-dir
```

(On Mac) the resulting app can be found at `dist/mac/Voracious.app`.

## Inspecting the distributed archive

It's often useful to check exactly what files have been included in the archive distributed with the Electron app. An easy way to do that is to install the `asar` tool (`yarn global add asar`) and then (on mac) run:

```$ asar list dist/mac/Voracious.app/Contents/Resources/app.asar```
