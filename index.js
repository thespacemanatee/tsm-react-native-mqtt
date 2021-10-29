import { NativeEventEmitter, NativeModules } from "react-native";

const Mqtt = NativeModules.Mqtt;

class MqttClient {
  constructor(options, clientRef) {
    this.options = options;
    this.clientRef = clientRef;
    this.eventHandler = {};

    this.dispatchEvent = function (data) {
      if (data && data.clientRef == this.clientRef && data.event) {
        if (this.eventHandler[data.event]) {
          this.eventHandler[data.event](data.message);
        }
      }
    };
  }
  on(event, callback) {
    console.log("setup event", event);
    this.eventHandler[event] = callback;
  }
  connect() {
    Mqtt.connect(this.clientRef);
  }
  disconnect() {
    Mqtt.disconnect(this.clientRef);
  }
  subscribe(topic, qos) {
    Mqtt.subscribe(this.clientRef, topic, qos);
  }
  unsubscribe(topic) {
    Mqtt.unsubscribe(this.clientRef, topic);
  }
  publish(topic,
    payload,
    qos,
    retain,
    base64) {
    Mqtt.publish(this.clientRef, topic, payload, qos, retain, base64);
  }
  reconnect() {
    Mqtt.reconnect(this.clientRef);
  }
  isConnected() {
    return Mqtt.isConnected(this.clientRef);
  }
  getTopics() {
    return Mqtt.getTopics(this.clientRef);
  }
  isSubbed(topic) {
    return Mqtt.isSubbed(this.clientRef, topic);
  }
}

const emitter = new NativeEventEmitter(Mqtt);

module.exports = {
  clients: [],
  eventHandler: null,
  dispatchEvents: function (data) {
    this.clients.forEach(function (client) {
      client.dispatchEvent(data);
    });
  },
  createClient: async function (options) {
    if (options.uri) {
      const pattern = /^((mqtt[s]?|ws[s]?)?:(\/\/)([0-9a-zA-Z_\.\-]*):?(\d+))$/;
      const matches = options.uri.match(pattern);
      if (!matches) {
        throw new Error(
          `Uri passed to createClient ${options.uri} doesn't match a known protocol (mqtt:// or ws://).`
        );
      }
      const protocol = matches[2];
      const host = matches[4];
      const port = matches[5];

      options.port = parseInt(port);
      options.host = host;
      options.protocol = "tcp";

      if (protocol == "wss" || protocol == "mqtts") {
        options.tls = true;
      }
      if (protocol == "ws" || protocol == "wss") {
        options.protocol = "ws";
      }
    }

    let clientRef = await Mqtt.createClient(options);

    const client = new MqttClient(options, clientRef);

    /* Listen mqtt event */
    if (this.eventHandler === null) {
      console.log("add mqtt_events listener");
      this.eventHandler = emitter.addListener("mqtt_events", (data) =>
        this.dispatchEvents(data)
      );
    }
    this.clients.push(client);

    return client;
  },
  removeClient: function (client) {
    const clientIdx = this.clients.indexOf(client);

    if (clientIdx > -1) this.clients.splice(clientIdx, 1);

    if (this.clients.length > 0) {
      this.eventHandler.remove();
      this.eventHandler = null;
    }

    Mqtt.removeClient(client.clientRef);
  },

  disconnectAll: function () {
    Mqtt.disconnectAll();
  },
};
