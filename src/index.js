import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Eth from "@ledgerhq/hw-app-eth";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";

import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";



const config = {
    derivationPath: "44'/60'/0'/0",
    infuraId: "xxx",
    useRopsten: true
};

let rpcUrl = `https://${config.useRopsten ? "ropsten" : "mainnet"}.infura.io/v3/${config.infuraId}`;

const handleChange = () => {
    config.infuraId = infura.value;
    config.derivationPath = dp.value;
    config.useRopsten = useRp.checked;
    rpcUrl = `https://${config.useRopsten ? "ropsten" : "mainnet"}.infura.io/v3/${config.infuraId}`;
};

const infura = document.getElementById("infura-id");
infura.value = config.infuraId;
infura.onchange = handleChange;

const dp =  document.getElementById("derivation-path");
dp.value = config.derivationPath;
dp.onchange = handleChange;

const useRp =  document.getElementById("use-ropsten");
useRp.checked = config.useRopsten;
useRp.onchange = handleChange;

const getAddressButton =  document.getElementById("get-address");
getAddressButton.onclick = async () => {
    const addressElement = document.getElementById("address-field");
    const ledgerAddress = await eth_address();
    addressElement.value = ledgerAddress.address
};

const web3Callback = function(error, result){
    if(!error)
        console.log(JSON.stringify(result));
    else
        console.error(error);
};

const engine = new Web3ProviderEngine();

const getTransport = () => TransportU2F.create();
const ledgerProvider = createLedgerSubprovider(getTransport, {
    networkId: 3,
    accountsLength: 1,
});


engine.addProvider(ledgerProvider);
engine.addProvider(
    new RpcSubprovider({
        rpcUrl,
    }),
);

engine.start();
const web3 = new Web3(engine);

// console.log("get balance");
// web3.eth.getBalance(myAddress, web3Callback);


// console.log("calling for accounts");
// web3.eth.getAccounts(web3Callback);


// console.log("trying to send some transaction");
// const tx = {
//     from: myAddress,
//     to: otherAddress,
//     value: 100000000000000,
//     gas: 21000,
//     gasPrice: 1000000000,
// };
// web3.eth.sendTransaction(tx, web3Callback);


// console.log("trying to sign something");
// web3.eth.sign(myAddress, web3.sha3("signing something"), web3Callback);

const eth_address = async function () {
    console.log("calling native app getAddress");
    const transport = await TransportU2F.create();
    const eth = new Eth(transport);
    const address = await eth.getAddress(config.derivationPath);
    transport.close();
    console.log("address", address);
    return address;
};

const eth_sign_personal = async function () {
    console.log("calling native app signPersonalMessage");
    const transport = await TransportU2F.create();
    const eth = new Eth(transport);
    const signed = await eth.signPersonalMessage(config.derivationPath, Buffer.from("test").toString("hex"));
    console.log("signed", signed);
    transport.close();
};

// eth_address();
// eth_sign_personal();
