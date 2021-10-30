## Description

A react-native-mqtt fork that allows Android clients to send base64 strings in byte arrays.

## MQTT Features (inherited from the native MQTT framework)
* Uses [MQTT Framework](https://github.com/ckrey/MQTT-Client-Framework) for IOS, [Paho MQTT Client](https://eclipse.org/paho/clients/android/) for Android
* Full Android support
* Partial iOS support
* SSL/TLS
* Native library, supports MQTT over TCP (forget websockets, we're on **mobile**)


## Getting started

### Installation

#### Step 1:
```bash
npm install tsm-react-native-mqtt --save
```

or

```bash
yarn add tsm-react-native-mqtt
```

#### Step 2: (Skip this step if you are using RN 0.60 or above as the module will be auto-linked)

```bash
react-native link tsm-react-native-mqtt
```


#### Step 3:
##### iOS

Add `pod 'MQTTClient'` to your podfile and `pod install`

<details>
<summary>Alternatively you can manually link the library on iOS (click to expand)</summary>

In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
* Go to `node_modules` ➜ `tsm-react-native-mqtt` and add `RCTMqtt.xcodeproj`
* In XCode, in the project navigator, select your project. Add `libRCTmqtt.a` and `libicucore.tbd` to your project's `Build Phases` ➜ `Link Binary With Libraries`
* Click `RCTMqtt.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). In the `Search Paths` section, look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../../react-native/React` - mark  as `recursive`.

</details>



##### Android

* Add the following line in `getPackages()` method inside the `ReactNativeHost` object in `android/app/src/main/java/.../MainApplication.java`:

```java

packages.add(new RCTMqttPackage());           // as a child of the getPackages() returned array

```

Don't forget to include `import com.tuanpm.RCTMqtt.*;` with the other imports at the top.

* Append the following lines to `android/settings.gradle` before `include ':app'`:

```
include ':tsm-react-native-mqtt'
project(':tsm-react-native-mqtt').projectDir = new File(rootProject.projectDir,  '../node_modules/tsm-react-native-mqtt/android')

```


- Insert the following lines inside the dependencies block in `android/app/build.gradle`:

```
implementation ':tsm-react-native-mqtt'
```



## Usage

```javascript
import MQTT from 'tsm-react-native-mqtt';

/* create mqtt client */
MQTT.createClient({
  uri: 'mqtt://test.mosquitto.org:1883',
  clientId: 'your_client_id'
}).then(function(client) {

  client.on('closed', function() {
    console.log('mqtt.event.closed');
  });

  client.on('error', function(msg) {
    console.log('mqtt.event.error', msg);
  });

  client.on('message', function(msg) {
    console.log('mqtt.event.message', msg);
  });

  client.on('connect', function() {
    console.log('connected');
    client.subscribe('/data', 0);
    client.publish('/data', "test", 0, false, true);
  });

  client.connect();
}).catch(function(err){
  console.log(err);
});

```

## API

* `mqtt.createClient(options)`  create new client instance with `options`, async operation
  * `uri`: `protocol://host:port`, protocol is [mqtt | mqtts]
  * `host`: ipaddress or host name (override by uri if set)
  * `port`: port number (override by uri if set)
  * `tls`: true/false (override by uri if set to mqtts or wss)
  * `user`: string username
  * `pass`: string password
  * `auth`: true/false - override = true Set to true if `user` or `pass` exist
  * `clientId`: string client id
  * `keepalive`

* `client`
  * `on(event, callback)`: add event listener for
    * event: `connect` - client connected
    * event: `closed` - client disconnected
    * event: `error` - error
    * event: `message` - message object
  * `connect`: begin connection
  * `disconnect`: disconnect
  * `subscribe(topic, qos)`
  * `publish(topic, payload, qos, retain, base64)`

* `message`
  * `retain`: *boolean* `false`
  * `qos`: *number* `2`
  * `data`: *string* `"test message"`
  * `topic`: *string* `"/data"`

## Todo
* [x] byte array support for iOS
## LICENSE

```text
Copyright 2021 Chong Chee Kit

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
