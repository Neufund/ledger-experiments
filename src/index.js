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

const dp = document.getElementById("derivation-path");
dp.value = config.derivationPath;
dp.onchange = handleChange;

const useRp = document.getElementById("use-ropsten");
useRp.checked = config.useRopsten;
useRp.onchange = handleChange;

// address button
document.getElementById("get-address").onclick = async () => {
    try {
        const ledgerAddress = await ethGetAddress();
        document.getElementById("address-field").value = ledgerAddress.address
    } catch (error) {
        document.getElementById("address-error").innerHTML = error;
        throw error
    }
};

// config button
document.getElementById("get-configuration").onclick = async () => {
    try {
        const appConfiguration = await ethGetAppConfiguration();
        document.getElementById("configuration-field").innerHTML = JSON.stringify(appConfiguration, null, 2)
    } catch (error) {
        document.getElementById("configuration-error").innerHTML = error;
        throw error
    }
};

// sign tx button
document.getElementById("sign-tx").onclick = async () => {
    try {
        const signtx = await ethSignTransaction();
        document.getElementById("sign-tx-field").innerHTML = JSON.stringify(signtx, null, 2)
    } catch (error) {
        document.getElementById("sign-tx-error").innerHTML = error;
        throw error
    }
};

// sign button
document.getElementById("sign").onclick = async () => {
    try {
        const sign = await ethSignPersonal();
        document.getElementById("sign-field").innerHTML = JSON.stringify(sign, null, 2)
    } catch (error) {
        document.getElementById("sign-error").innerHTML = error;
        throw error
    }
};

// web3-getAccounts button
document.getElementById("web3-getAccounts").onclick = async () => {
    web3GetAccounts();
};

// web3 send eth button
document.getElementById("web3-send-eth-button").onclick = async () => {
    web3SendEth();
};

// web3 send tx button
document.getElementById("web3-send-tx-button").onclick = async () => {
    web3SendTx();
};

document.getElementById("web3-sign").onclick = async () => {
    web3sign();
};

const web3Callback = function (error, result) {
    if (!error)
        console.log(JSON.stringify(result));
    else
        console.error(error);
};

const web3GetAccounts = function () {
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
    console.log("web3 getAccounts");

    web3.eth.getAccounts(function (error, result) {
        if (!error) {
            document.getElementById("web3-getAccounts-field").value = result[0];
        } else {
            document.getElementById("web3-getAccounts-error").innerHTML = error;
            console.error(error);
        }
        engine.stop()
    });
};

const web3SendEth = function () {
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
    console.log("web3 sendTransaction. Only eth transfer");
    const tx = {
        from: document.getElementById("web3-getAccounts-field").value,
        to: document.getElementById("web3-send-eth-to").value,
        value: 1000000000000,
        gas: 21000,
        gasPrice: 1000000000,
    };

    web3.eth.sendTransaction(tx, function (error, result) {
        if (!error) {
            document.getElementById("web3-send-eth-hash").value = result;
        } else {
            document.getElementById("web3-send-eth-error").innerHTML = error;
            console.error(error);
        }
        engine.stop()
    });
};

const web3SendTx = function () {
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
    console.log("web3 sendTransaction with contract data");

    const address = "0xF15090C01BEc877a122b567E5552504E5Fd22b79";
    const abi = [{
        "constant": true,
        "inputs": [],
        "name": "getCount",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"name": "_count", "type": "uint256"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }];

    const txData = {
        from: document.getElementById("web3-getAccounts-field").value,
        value: 0,
        gas: 210000,
        gasPrice: 1000000000,
    };

    const counter = web3.eth.contract(abi).at(address);
    counter.increment.sendTransaction(txData, function (error, result) {
        if (!error) {
            document.getElementById("web3-send-tx-hash").value = result;
        } else {
            document.getElementById("web3-send-tx-error").innerHTML = error;
            console.error(error);
        }
        engine.stop()
    });
};

const web3sign = function () {
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
    console.log("trying to sign");

    const address = document.getElementById("web3-getAccounts-field").value;
    const thingToSign = web3.sha3("signing something");
    // const thingToSign = "0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49";

    web3.eth.sign(address, thingToSign, function (error, result) {
        if (!error) {
            document.getElementById("web3-sign-field").innerHTML = result;
        } else {
            document.getElementById("web3-sign-error").innerHTML = error;
            console.error(error);
        }
        engine.stop()
    });
};

const ethGetAppConfiguration = async function () {
    console.log("calling native app getAppConfiguration");
    const transport = await TransportU2F.create();
    const eth = new Eth(transport);
    const appConfiguration = await eth.getAppConfiguration();
    transport.close();
    console.log("appConfiguration", appConfiguration);
    return appConfiguration;
};

const ethGetAddress = async function () {
    console.log("calling native app getAddress");
    const transport = await TransportU2F.create();
    const eth = new Eth(transport);
    const address = await eth.getAddress(config.derivationPath);
    transport.close();
    console.log("address", address);
    return address;
};

const ethSignTransaction = async function () {
    console.log("calling native app signTransaction");
    const transport = await TransportU2F.create();
    const eth = new Eth(transport);
    const txBin = "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080";
    const signedTx = await eth.signTransaction(config.derivationPath, txBin);
    console.log("signed tx", signedTx);
    transport.close();
    return signedTx;
};

const ethSignPersonal = async function () {
    console.log("calling native app signPersonalMessage");
    const transport = await TransportU2F.create();
    const eth = new Eth(transport);
    const signed = await eth.signPersonalMessage(config.derivationPath, Buffer.from("test").toString("hex"));
    console.log("signed", signed);
    transport.close();
    return signed;
};
