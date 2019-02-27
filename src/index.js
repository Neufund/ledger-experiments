import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Eth from "@ledgerhq/hw-app-eth";

const fun = async function() {
     const transport = await TransportU2F.create();
     const eth = new Eth(transport);
     const address = await eth.getAddress("44'/60'/0'/0/0");
     console.log("address", address)
};
console.log("hello waiting for transport");
fun();
