Introduction to Streamr APIs
Streamr provides a set of APIs to enable easy integration with other systems. The APIs cover data input, data output, and managing various resources within Streamr (such as Canvases, Dashboards, and Streams).

There are RESTful HTTP endpoints that can be accessed using any HTTP library with ease. Streaming data output is available over websockets. For easy usage, we offer a Javascript client that works in the browser as well as node.js. The client is available on npm. Clients for other languages are coming soon.

Authentication
You authenticate to all the RESTful API endpoints using your user API key, found on your profile page. Include the following header on your HTTP request:

Authorization: token your-api-key

When reading from or writing to Streams, you can use a Stream-specific anonymous key instead of your user key to avoid exposing it. Anonymous keys can be managed on the Stream edit page.

Data Input
Data Input via HTTP
You can write events to streams by POSTing JSON objects to the below API endpoint. The body of the request should be a JSON object, encoded in UTF-8, containing the key-value pairs representing your data. You can also send a JSON list (of objects), if you want to push multiple events in one HTTP request (they will all get the same timestamp).

​

Endpoint
https://www.streamr.com/api/v1/streams/:id/data

GET
Endpoint

https://api.acme.com

/api/v1/streams/:id/data
Briefly describe this method...​
Request
Response
Path Parameters

Parameter Name
OPTIONAL 
string 
Briefly describe this parameter...​
 Add a parameter
Note that the stream id is part of the URL.

​

Authentication
See the section on authentication.


Options
Options for the data input can be provided in query parameters:

Parameter

Required

Description

ttl

no

Time-To-Live, in seconds. The event will be deleted after this time has passed. If not given, the event storage period will be the stream default.

pkey

no

For partitioned streams, provides the key to partition by. Can be eg. a customer id to make all events for that customer to go to the same Canvas for processing. If not given, a random partition is selected.

Example request body (single object):

{
    "foo": "hello",
    "bar": 24.5
}
Example request body (list of objects):

[{
    "foo": "hello",
    "bar": 24.5
},
{
    "foo": "goodbye",
    "bar": 30
}]
Usage Examples
Example using jquery:

var msg = {
    foo: "hello",
    bar: 24.5
}
 
$.ajax({
    type: "POST",
    url: "https://www.streamr.com/api/v1/streams/MY-STREAM-ID/data",
    headers: {
        Authorization: "token MY-STREAM-AUTH-KEY"
    },
    data: JSON.stringify(msg)
});
Example using node.js + restler:

var restler = require('restler');
​
var msg = {
    foo: "hello",
    bar: 24.5
}
​
restler.post('https://www.streamr.com/api/v1/streams/MY-STREAM-ID/data', {
    headers: {
        Authorization: "token MY-STREAM-AUTH-KEY"
    },
    data: JSON.stringify(msg)
})
Example using python + requests:

import requests
​
msg = {
    'foo': 'hello',
    'bar': 24.5
}
​
requests.post('https://www.streamr.com/api/v1/streams/MY-STREAM-ID/data?auth=MY-STREAM-AUTH-KEY', json=msg, headers={'Authorization': 'token MY-STREAM-AUTH-KEY'})
Example using curl:

curl -i -X POST -H "Authorization: token MY-STREAM-AUTH-KEY" -d "{\"foo\":\"hello\",\"bar\":24.5}" https://www.streamr.com/api/v1/streams/MY-STREAM-ID/data
Response Codes
code

description

200

Success (the response is empty)

400

Invalid request

401

Permission denied

403

Authentication failed

404

Stream not found

500

Unexpected error

Data Output
There are two APIs for requesting data from Streamr into external applications: our websocket-based streaming API, and our RESTful HTTP API.

The streaming API can be used to control external applications using realtime events from Streamr. For example, you could push realtime stock prices into a mobile app, or update player positions in a multiplayer game. Or you could implement a thermostat by controlling warming or cooling based on a temperature measurement. The streaming API pushes new events to subscribed clients immediately when they become available. For easy usage of the streaming API, we offer a Javascript client that works in the browser as well as node.js. Clients for other languages are coming soon.

Streamr Javascript Client
By using this client, you can easily subscribe to realtime Streamr streams from Javascript-based environments, such as browsers and node.js. This enables you to use Streamr as an over-the-internet pub/sub engine with powerful analytics and automation features.

The client uses websockets for streaming message delivery. It should work in all modern browsers.

Installation
The client is available on npm and can be installed simpy by:

npm install streamr-client

Usage
Here's a quick example. More detailed examples for the browser and node.js can be found here.

// Create a StreamrClient instance
var client = new StreamrClient({
    // See below for options
})
​
// Subscribe to a stream
var sub = client.subscribe(
    {
        stream: 'streamId',
        partition: 0,           // Optional, defaults to zero. Use for partitioned streams to select partition.
        authKey: 'authKey'      // Optional. If not given, uses the authKey given at client creation time.
        // optional resend options here
    },
    function(message, metadata) {
        // Do something with the message, which is an object
    }
)
Client options
Option

Default value

Description

url

ws://www.streamr.com/api/v1/ws

Address of the Streamr websocket endpoint to connect to.

authKey

null

Define default authKey to use when none is specified in the call to client.subscribe.

autoConnect

true

If set to true, the client connects automatically on the first call to subscribe(). Otherwise an explicit call to connect() is required.

autoDisconnect

true

If set to true, the client automatically disconnects when the last stream is unsubscribed. Otherwise the connection is left open and can be disconnected explicitly by calling disconnect().

Message handler callback
The second argument to client.subscribe(options, callback) is the callback function that will be called for each message as they arrive. Its arguments are as follows:

Argument

Description

message

A javascript object containing the message itself

metadata

Metadata for the message, for example metadata.timestamp etc.

Methods
Name

Description

connect()

Connects to the server, and also subscribes to any streams for which subscribe() has been called before calling connect().

disconnect()

Disconnects from the server, clearing all subscriptions.

pause()

Disconnects from the server without clearing subscriptions.

subscribe(options, callback)

Subscribes to a stream. Messages in this stream are passed to the callback function. See below for subscription options. Returns a Subscription object.

unsubscribe(Subscription)

Unsubscribes the given Subscription.

unsubscribeAll(streamId)

Unsubscribes all Subscriptions for streamId.

getSubscriptions(streamId)

Returns a list of Subscriptions for streamId.

bind(eventName, function)

Binds a function to an event called eventName

unbind(eventName, function)

Unbinds the function from events called eventName

Subscription options
Note that only one of the resend options can be used for a particular subscription. The default functionality is to resend nothing, only subscribe to messages from the subscription moment onwards.

Name

Description

stream

Stream id to subscribe to

authKey

User key or stream key that authorizes the subscription. If defined, overrides the client's authKey.

partition

Partition number to subscribe to. Defaults to the default partition (0).

resend_all

Set to true if you want all the messages for the stream resent from the earliest available message.

resend_last

Resend the previous N messages.

resend_from

Resend from a specific message number.

resend_from_time

Resend from a specific Date (or millisecond timestamp).

resend_to

Can be used in conjunction with resend_from to limit the end of the resend. By default it is the newest message.

Binding to events
The client and the subscriptions can fire events as detailed below. You can bind to them using bind:

​

GET
Get Cakes

https://api.cakes.com

/v1/cakes/:id
This endpoint allows you to get free cakes.
Request
Response
Path Parameters

id
OPTIONAL 
string 
ID of the cake to get, for free of course.
Headers

Authentication
REQUIRED 
string 
Authentication token to track down who is emptying our stocks.
Query Parameters

recipe
OPTIONAL 
string 
The API will do its best to find a cake matching the provided recipe.

gluten
OPTIONAL 
boolean 
Whether the cake should be gluten-free or not.
 Add a parameter
​