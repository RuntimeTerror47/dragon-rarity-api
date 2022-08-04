var express = require("express");
var router = express.Router();
var { CosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

const CONTRACT_ADDRESS =
    "juno100dkyna0r52pawt229xdsfzr29rxr9wf2f4xgapzn72aqcm905rqc93xgw";
const RPC_URL = "https://rpc.uni.juno.deuslabs.fi";

const WHITELIST_ADDRESS =
    "juno1kjtwd7jqs9yyfl5sfmqvvp9rwdzzra50qs6jjsc0gudrtuah0a3sxajah5";
const MAINNET_RPC = "https://rpc.juno-1.deuslabs.fi";

const getDragonType = (id) => {
    let type = Number(id) % 5;
    if (type === 0) return "Legendary";
    if (type === 2) return "Uncommon";
    if (type === 3) return "Rare";
    if (type === 4) return "Epic";
    else return "Common";
};

/* GET users listing. */
router.get("/:address", async function (req, res, next) {
    let owner = req.params["address"];
    let tokenRes;
    let error = false;
    const client = await CosmWasmClient.connect(RPC_URL);
    try {
        tokenRes = await client.queryContractSmart(CONTRACT_ADDRESS, {
            Tokens: { owner: owner },
        });
    } catch (err) {
        error = true;
    }

    const client2 = await CosmWasmClient.connect(MAINNET_RPC);
    try {
        whitelistRes = await client2.queryContractSmart(WHITELIST_ADDRESS, {
            Tokens: { owner: owner },
        });
        console.log(whitelistRes);
    } catch (err) {
        error = true;
    }

    //Get Tokens
    if (error || !tokenRes || tokenRes.tokens.length === 0) {
        res.send(JSON.stringify({ dragons: [] }));
    } else {
        let response = [];
        for (let i = 0; i < tokenRes.tokens.length; i++) {
            // let type = await client.queryContractSmart(CONTRACT_ADDRESS, {
            //     DragonInfo: { id: tokenRes.tokens[i] },
            // });
            // console.log(type);
            response.push({
                id: tokenRes.tokens[i],
                imageUrl: "...",
                rarity: getDragonType(tokenRes.tokens[i]),
            });
        }
        if (whitelistRes.length !== 0) {
            response.push({
                id: whitelistRes.tokens[0].id,
                imageUrl: "...",
                rarity: "starter",
            });
        }
        res.send(JSON.stringify({ dragons: response }));
    }
});

module.exports = router;
