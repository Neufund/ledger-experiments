# ledger-experiments
Inside this repository you will find code that help you check some ledger corner cases.

## device used in tests
| device name  | secure element  | MCU  | eth app | can login to platform |
|---|---|---|---|---|
| dev nano 2 (nikola) |  1.4.2 |  1.5 | 1.1.8 | no |
| tomek private | 1.5.5 | 1.7 | 1.1.9 | yes |

## ledger states
not sure if any of those are distinct from each other smth to check
- initial request for pin
- app screen
- app screen blocked
- app screen blocked request for pin
- ethereum app
- ethereum app blocked
- ethereum app blocked request for pin

## ledger exceptions

### when you decline sign on app eth
```
TransportStatusError
message: "Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)"
name: "TransportStatusError"
stack: "" <- removed
statusCode: 27013
statusText: "CONDITIONS_OF_USE_NOT_SATISFIED"
```

### when contract data is turned off
```
TransportStatusError
message: "Ledger device: Invalid data received (0x6a80)"
name: "TransportStatusError"
stack: "" <- removed
statusCode: 27264
statusText: "INCORRECT_DATA"
```

### timeout
```
id: "U2F_5"
message: "Failed to sign with Ledger device: U2F TIMEOUT"
name: "TransportError"
originalError: Error: Sign failed at makeError (webpack:///./node_modules/u2f-api/lib/u2f-api.js?:102:14) at cbChrome (webpack:///./node_modules/u2f-api/lib/u2f-api.js?:277:14) at u2f.responseHandler_ (webpack:///./node_modules/u2f-api/lib/google-u2f-api.js?:343:3) at eval (webpack:///./node_modules/u2f-api/lib/google-u2f-api.js?:212:7)
    metaData:
    code: 5
    type: "TIMEOUT"
    message: "Sign failed"
    stack: "" <- removed
stack: "" <- removed
```

### ledger is locked
You will get this error if you try to call `eth.getAddress`, `web3.getAccounts`, `web3.sendTransaction`. What's interesting if you would try to call `eth.signTransaction` or `eth.signPersonalMessage` you will be prompted to unlock device and will get a timeout. 

```
message: "Ledger device: UNKNOWN_ERROR (0x6804)"
name: "TransportStatusError"
stack: ""  <- removed
statusCode: 26628
statusText: "UNKNOWN_ERROR"
```

## notes:
- Timeout is 30s and cannot be changed.
- It works with Firefox you have to enable in `security.webauth.u2f` flag. You can access it through `about:config`.
- If app is waiting for user action (approval / recjetion) you can create another actions and those would be put in queue. That might have some UI implications as we have be careful not to send double tx's.


## small dev notes
- create timeinterval with get config
