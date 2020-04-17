# Volt integration examples

Find example integrations with ⚡️[Volt by Volusion](https://www.volusion.com/volt) here, mostly using webhooks that fire from Volt to your Google Cloud Functions.

Google Cloud Functions is part of Google's [Free Tier](https://cloud.google.com/free), providing 2 million requests per month for free. 😲 And the way we're writing our code using [FaaS](https://github.com/GoogleCloudPlatform/functions-framework-nodejs) doesn't lock you into Cloud Functions either… if you later decide you want to run this code on docker, or using Google Cloud Run, or even outside of Google in any Knative-based environment, have at it. But for this repo we're going to keep it simple, cheap, and minimal maintenance.

File structure is based on [Cloud Functions Starter Kit](https://github.com/volusion/cloud-functions-hello-world)

## Install

Clone this repo to your local machine, then in your terminal run:

```shell
npm install
```

Create a new file called `.env.yaml` where you'll set the environment variables with your API Keys
```shell
VOLT_API_KEY: 9fduAnbishA0N9BXlNQ6zC:9kaub81gaVl1oJfXiIbal8
```
👆 this is not a real key, replace with your own

Install the [Google Cloud SDK](https://cloud.google.com/sdk) if you don't already have it. Create a new project in [console](http://console.cloud.google.com/) and enable Cloud Functions API for that project. Set your terminal to use that project. 

## Usage

```shell
npm start
```

Each file in `/functions` is an endpoint. Feel free to create more, or less by:

1. Duplicating one of those example files in `/functions`
2. Referencing that new file in your `index.js`

# Example: ShipStation

This integration exists at `/functions/toShipStation.js`

Integrate [Volt by Volusion](https://volusion.com/volt) to [ShipStation](https://www.shipstation.com). This sample is intended to do the heavy lifting of the mapping exercise, and provide the framework for communicating with both the Volt and ShipStation APIs. It's all open source, giving you the
flexibility to customize it for your business. If you don't like free, flexible code, you can always pay for a [Zapier point & click Volt (V2) --> ShipStation integration](https://zapier.com/apps/shipstation/integrations/volusion/21127/create-new-shipstation-orders-from-new-volusion-orders) instead.

Set your ShipStation environment variables in the `.env.yaml` file
```shell
SHIPSTATION_API_KEY: 8bha9aca512444058405e0ae29a9f716
SHIPSTATION_API_SECRET: 4191eb59c9d74de1a91b8wh1ap12a9ve
```
👆 these are not real keys, replace with your own

## Deploy

To deploy all functions, run:

```shell
npm run deploy
```

Your functions will be accessible on Google Cloud Functions, at a URL such as:

https://us-central1-volt-oms-integration.cloudfunctions.net/helloWorld

Where `us-central1` is the Google Cloud **Region** you picked and `volt-oms-integration` is what you named your Google Cloud **Project** and `helloWorld` is what you named your **file** in this project.