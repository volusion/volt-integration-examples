require('env-yaml').config({ path: '.env.yaml' })
const objectMapper = require('object-mapper');

// Credentials 
const SHIPSTATION_API_KEY = process.env.SHIPSTATION_API_KEY
const SHIPSTATION_API_SECRET = process.env.SHIPSTATION_API_SECRET

async function sendVoltOrdersToShipStation(req) {

  /***************************************************************************/
  // catch the order from the Volt webhook
  /***************************************************************************/
  const order = req.body.value;
  console.log("order", JSON.stringify(order))

  /***************************************************************************/
  // map volt to ShipStation
  /***************************************************************************/

  // left side is the volt order format... --> right side is ShipStation order model
  // volt: (see example-json/volt-order-1.json) or https://app.swaggerhub.com/apis-docs/volusion/VOLT/1
  // ShipStation: https://www.shipstation.com/docs/api/models/order/

  // but first, map a few new properties ShipStation expects
  let totalOrderWeight = 0
  order.cart.items.map( item => {
      item.product.weight_unit = 'grams';
      item.product.weight = item.product.weight * 454; // convert our lbs to gram
      if (!item.product.weight) {
          item.product.weight = 1;
      }
      totalOrderWeight = totalOrderWeight + item.product.weight
  })
  if (order.paid === true) {
      order.amountPaid = order.grandTotal;
  } else {
      order.amountPaid = 0;
  }
  order.weight = totalOrderWeight;
  order.weight_unit = 'grams';

  // now do the mapping
  let volt_to_shipstation_mappings = {
      "orderNumber": "orderNumber",
      "id": "orderKey",
      "createdOn": "orderDate",
      "status": {
          key: "orderStatus",
          transform: function (value) { 
              switch (value) {
                  case "New":
                      return "awaiting_payment";
                  case "In Progress":
                      return "awaiting_shipment";
                  case "Complete":
                      return "shipped";
                  case "Cancelled":
                      return "cancelled";
              }
          }
      },
      "customerId": "customerUsername",
      "placedBy.emailAddress": "customerEmail",
      "deliverTo": {
          key: "shipTo.name",
          transform: function (value) { 
              return value.firstName + " " + value.lastName;
          }
      },    
      "deliverTo.address.address1": "shipTo.street1",
      "deliverTo.address.address2": "shipTo.street2",
      "deliverTo.address.city": "shipTo.city",
      "deliverTo.address.state": "shipTo.state",
      "deliverTo.address.postalCode": "shipTo.postalCode",
      "deliverTo.address.country": "shipTo.country",
      "placedBy.phoneNumber": "shipTo.phone",
      "deliverTo.isResidential": "shipTo.residential",
      "cart.items[].product.sku": "items[].sku",
      "cart.items[].product.name": "items[].name",
      "cart.items[].product.imageMetadata.imageLink.fullUri": "items[].imageUrl",
      "cart.items[].product.weight": "items[].weight.value",
      "cart.items[].product.weight_unit": "items[].weight.units",
      "cart.items[].quantity": "items[].quantity",
      "cart.items[].product.price": "items[].unitPrice",
      "cart.items[].product.productVariantId": "items[].product_id",
      "cart.items[].product.fulfillmentData.sourceSku": "items[].fulfillmentSku",
      "taxAmount": "taxAmount",
      "cart.shippingMethod.shippingCost": "shippingAmount",
      "shopperNote": "customerNotes", 
      "merchantNote": "internalNotes",
      "paymentMethod": "paymentMethod",
      "cart.shippingMethod.name": "requestedShippingService",
      "weight": "weight.value",
      "weight_unit": "weight.units",
  };

  // run the map
  let orderInShipStationFormat = objectMapper(order, volt_to_shipstation_mappings);
  // one more post processing step
  orderInShipStationFormat.billTo = orderInShipStationFormat.shipTo

  /***************************************************************************/
  // import the order into ShipStation
  /***************************************************************************/
  
  const shipstationAPI = require('node-shipstation');
  const shipstation = new shipstationAPI(
      SHIPSTATION_API_KEY, // api key
      SHIPSTATION_API_SECRET // api secret
  );

  // call promisified shipstation addOrder function
  console.log("orderInShipStationFormat",JSON.stringify(orderInShipStationFormat)); // success
  const addOrder = (orderInShipStationFormat) =>
    new Promise((resolve, reject) => {
      shipstation.addOrder(orderInShipStationFormat, (err, res, body) => {
        if (err) {
          return reject(err)
        }
        // body is the successful data model of shipstation in case you wanted to see their data model after successful insert
        console.log("shipStationResponse",JSON.stringify(body)); // success
        return resolve()
      })
    })
  await addOrder(orderInShipStationFormat);
  /***************************************************************************/

}

exports.handler = async (req, res) => {
    const response = await sendVoltOrdersToShipStation(req);
    console.log('Successfully inserted shipstation order');
    res.send('Successfully inserted shipstation order');
    return;
  };
