# ledger-experiments
Inside this repository you will find code that help you check some ledger corner cases.

# device used in tests
| device name  | secure element  | MCU  | eth app | can login to platform |
|---|---|---|---|---|
| dev nano 2 (nikola) |  1.4.2 |  1.5 | 1.1.8 | no |
| tomek private | 1.5.5 | 1.7 | 1.1.9 | yes |

# ledger states
not sure if any of those are distinct from each other
- initial request for pin
- app screen
- app screen blocked
- app screen blocked request for pin
- ethereum app
- ethereum app blocked
- ethereum app blocked request for pin

#### note for self:
if you click send tx very fast you will get two transactions to confirm one after another
