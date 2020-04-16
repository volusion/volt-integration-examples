# Cloud Functions Starter Kit

This repo is helpful to start with if you want to use Google Cloud Functions. Specifically, the [Functions Framework](https://cloud.google.com/functions/docs/functions-framework).

## Why this repo?

1. A single file structure housing multiple functions
2. A way to deploy all your functions with a single command `npm run deploy`
3. A way to run all your functions locally on a single port for easier development

## Usage

Install the [Google Cloud SDK](https://cloud.google.com/sdk) if you don't already have it. Create a new project in [console](http://console.cloud.google.com/) and enable Cloud Functions API for that project. Set your terminal to use that project. 

```shell
npm install
npm start
```

Each file in `/functions` is an endpoint. Feel free to create more, or less by:

1. Duplicating one of those example files in `/functions`
2. Referencing that new file in your `index.js`

## Deploy

To deploy all functions, run:

```shell
npm run deploy
```

Your functions will be accessible on Google Cloud Functions, at a URL such as:

https://us-central1-volt-oms-integration.cloudfunctions.net/helloWorld

Where `us-central1` is the Google Cloud **Region** you picked and `volt-oms-integration` is what you named your Google Cloud **Project** and `helloWorld` is what you named your **file** in this project.