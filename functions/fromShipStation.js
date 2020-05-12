require('env-yaml').config({ path: '.env.yaml' })
const axios = require('axios');

// Credentials 
const VOLT_API_KEY = process.env.VOLT_API_KEY
const SHIPSTATION_API_KEY = process.env.SHIPSTATION_API_KEY
const SHIPSTATION_API_SECRET = process.env.SHIPSTATION_API_SECRET

async function sendShipStationTrackingNumbersToVolt(req) {

  /***************************************************************************/
  // catch the ShipStation webhook
  /***************************************************************************/
  const shipNotifyEvent = req.body;
  console.log("shipNotifyEvent", JSON.stringify(shipNotifyEvent))

  /***************************************************************************/
  // ShipStation hooks require us to fetch the actual hook data at a resource_url
  /***************************************************************************/
  const { data } = await axios.get(shipNotifyEvent.resource_url, {
      auth: {
        username: SHIPSTATION_API_KEY,
        password: SHIPSTATION_API_SECRET
      }
    });
  
  /***************************************************************************/
  // map ShipStation to Volt
  /***************************************************************************/

  // ShipStation: https://www.shipstation.com/docs/custom-store/v1/reference/notify
  // volt: https://app.swaggerhub.com/apis-docs/volusion/VOLT/1.1#/Orders/addFulfillmentLifecycleEvent

  // build fulfillment event
  let fulfillmentEvent = {
      eventType: "shipped",
      trackingInformation: [
          {
              carrier: mapShipStationCarrierToVoltCarrier(data.shipments[0].carrierCode),
              number: data.shipments[0].trackingNumber
          }
      ],
      requiresNotification: true
  }

  // debug output
  console.log("data", JSON.stringify(data))
  console.log("orderNumber", data.shipments[0].orderNumber)
  console.log("orderKey", data.shipments[0].orderKey)
  console.log("fulfillmentEvent", JSON.stringify(fulfillmentEvent))

  /***************************************************************************/
  // import the tracking number into Volt
  /***************************************************************************/
    const voltClient = require('@volusion/volt-api');
    const volt = new voltClient({
        apiKey: VOLT_API_KEY
    });
    const voltData = await volt.addOrderFulfillmentEvent(data.shipments[0].orderKey, fulfillmentEvent);
  /***************************************************************************/

}

function mapShipStationCarrierToVoltCarrier(carrierCode) {
  // https://www.shipstation.com/docs/api/carriers/list/
  switch (carrierCode) {
    case 'stamps_com': case 'endicia':
      return 'USPS'
      break;
    default:
      return carrierCode.toUpperCase();
  }
}

exports.handler = async (req, res) => {
    const response = await sendShipStationTrackingNumbersToVolt(req);
    console.log('Successfully inserted tracking number');
    res.send('Successfully inserted tracking number');
    return;
  };
