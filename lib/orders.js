/**
 * @file Order APIs
 */

var helpers = require('./helpers');
var qs      = require('querystring');

/**
 * Get all orders at a business.
 * @param {String} options.businessId
 * @param {String} options.startAt (optional) - the time from which to start fetching orders
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional) - the time at which to stop fetching orders
 * @param {Integer} options.limit (optional) - the number of orders to fetch
 * @param {String} options.cardNumberFirst6 (optional) - limit results to orders with transactions done by cards starting with these 6 numbers
 * @param {String} options.cardNumberLast4 (optional) - limit results to orders with transactions done by cards ending with these 4 numbers
 * @param {Integer} options.cardExpirationMonth (optional) - limit results to orders with transactions done by cards expiring in this month
 * @param {Integer} options.cardExpirationYear (optional) - limit results to orders with transactions done by cards expiring in this year
 * @param {String} options.cardHolderFirstName (optional) - limit results to orders with transactions done by cards with this card holder first name
 * @param {String} options.cardHolderLastName (optional) - limit results to orders with transactions done by cards with this card holder last name
 * @param {String} options.storeId (optional) - only fetch orders for this store
 * @param {String} options.includeStaysAll (optional)
 * @return {OrderList} orders
 */
module.exports.getOrders = function getOrders(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) { return next(hasErr); }

  var query = helpers.getKeys(options, [
    'startAt',
    'startOffset',
    'endAt',
    'limit',
    'cardNumberFirst6',
    'cardNumberLast4',
    'cardExpirationMonth',
    'cardExpirationYear',
    'cardHolderFirstName',
    'cardHolderLastName',
    'storeId',
    'includeStaysAll'
  ]);

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/orders?' + qs.stringify(query),
    method : 'GET'
  }, next);
};

/**
 * Get a single order at a business.
 * @param {String} options.businessId
 * @param {String} options.orderId
 * @return {Order} order
 */
module.exports.getOrder = function getOrder(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'orderId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/orders/' + encodeURIComponent(options.orderId),
    method : 'GET'
  }, next);
};

/**
 * Sends a cloud order by specifying the entire order object.
 * @param {Object} order - the full cloud order object
 */
module.exports.sendRawCloudOrder = function (order, next) {
  this.request({
    url    : '/businesses/' + order.context.businessId + '/orders',
    method : 'POST',
    body   : order
  }, next);
};

/**
 * Send a message from the cloud to your application running at a Poynt terminal.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.recipientClassName
 * @param {String} options.recipientPackageName
 * @param {String} options.deviceId
 * @param {String} options.serialNumber
 * @param {String} options.data (optional) - defaults to "{}"
 * @param {String} options.ttl (optional) - defaults to 900 seconds or 15 min
 * @param {String} options.collapseKey (optional)
 */
module.exports.sendCloudOrder = function sendCloudOrder(options, next) {
  // var hasErr = helpers.hasKeys(options, ['businessId', 'storeId', 'deviceId']);
  // if (hasErr) { return next(hasErr); }

  var order = {
    businessId : options.businessId,
    storeId    : options.storeId,
    deviceId   : options.deviceId,
    ttl        : options.ttl || 900,
    items      : options.items || [],
    amounts    : options.amounts || {},
    context    : options.context || {},
    statuses   : options.statuses || {},
    customerUserId : options.customerUserId || null,
    createdAt  : options.createdAt || new Date().toISOString(),
    updatedAt  : options.updatedAt || new Date().toISOString()
  };

  if (options.multiTender) { order.multiTender = options.multiTender; }
  if (options.serialNumber) { order.serialNum = options.serialNumber; }
  if (options.collapseKey) { order.collapseKey = options.collapseKey; }

  this.sendRawCloudOrder(order, next);
};

/**
 * Sends a cloud order by specifying the entire order object.
 * @param {Object} order - the full cloud order object
 */
module.exports.sendRawCloudOrderComplete = function (order, next) {
  this.request({
    // https://services.poynt.net/businesses/d308764d-3a49-405a-b896-d9f88ae45b27/orders/4f561b57-8168-4533-8dbc-57aff464918c/complete
    url    : '/businesses/' + order.businessId + '/orders/' + order.orderId + '/forceComplete',
    method : 'POST',
    body   : {}
  }, next);
};

/**
 * Send a message from the cloud to your application running at a Poynt terminal.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.recipientClassName
 * @param {String} options.recipientPackageName
 * @param {String} options.deviceId
 * @param {String} options.serialNumber
 * @param {String} options.data (optional) - defaults to "{}"
 * @param {String} options.ttl (optional) - defaults to 900 seconds or 15 min
 * @param {String} options.collapseKey (optional)
 */
module.exports.sendCloudOrderComplete = function sendCloudOrderComplete(options, next) {
  var order = {};

  if (options.serialNumber) { message.serialNum = options.serialNumber; }
  if (options.collapseKey) { message.collapseKey = options.collapseKey; }

  this.sendRawCloudOrderComplete(options, next);
};
