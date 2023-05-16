import "https://cdn.ethers.io/scripts/ethers-v3.min.js";
var distributionUrl="https://db.admint.io/address";

window.connectWallet = async function connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const accounts = await provider.listAccounts();
    console.log("account is ", accounts[0]);
    const campaignId=await window.ftd.get_value("main","distributionPage/#campaignId"); 
    console.log("campaign id is ",campaignId);

    fetch(distributionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            publicAddress: accounts[0],
            userid: "123",
            clientid: "Admint",
            campaignid: "#001"
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))

    window.ftd.set_value("distributionPage/#connectState", "Connected");
    window.ftd.set_value("distributionPage/#state", 1);
}