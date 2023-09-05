import { useEffect } from 'react';
import { HardwareWebSdk } from "@onekeyfe/hd-web-sdk";
import { UI_RESPONSE, UI_EVENT, UI_REQUEST } from "@onekeyfe/hd-core";
import "./App.css";

HardwareWebSdk.init({
  debug: true,
  // The official iframe page deployed by OneKey
  // of course you can also deploy it yourself
  connectSrc: "https://jssdk.onekey.so/0.3.2/",
});

function App() {
  const init = () => {
    HardwareWebSdk.on(UI_EVENT, (e) => {
      switch (e.type) {
        case UI_REQUEST.REQUEST_PIN:
          HardwareWebSdk.uiResponse({
            type: UI_RESPONSE.RECEIVE_PIN,
            payload: "@@ONEKEY_INPUT_PIN_IN_DEVICE",
          });
          break;
        case UI_REQUEST.REQUEST_PASSPHRASE:
          HardwareWebSdk.uiResponse({
            type: UI_RESPONSE.RECEIVE_PASSPHRASE,
            payload: {
              value: "",
              passphraseOnDevice: true,
              save: true,
            },
          });
          break;
        default:
        // NOTHING
      }
    });
  };

  const getPassphraseState = async () => {
    const res = await HardwareWebSdk.searchDevices();
    console.log(res);
    const device = res.payload[0];
    const { connectId, deviceId } = device;
    const passphraseState = await HardwareWebSdk.getPassphraseState(connectId);
    console.log(passphraseState);
    const publicKey = await HardwareWebSdk.evmGetPublicKey(
      connectId,
      deviceId,
      {
        showOnOneKey: false,
        chainId: 1,
        path: "m/44'/60'/0'/0",
        passphraseState: passphraseState.payload,
      }
    );
    console.log(publicKey);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <button onClick={getPassphraseState}>getPassphraseState</button>
    </div>
  );
}

export default App;
