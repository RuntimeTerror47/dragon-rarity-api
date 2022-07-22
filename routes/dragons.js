var express = require("express");
var router = express.Router();
var { CosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

const CONTRACT_ADDRESS =
    "juno100dkyna0r52pawt229xdsfzr29rxr9wf2f4xgapzn72aqcm905rqc93xgw";
const RPC_URL = "https://rpc.juno.giansalex.dev";

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
            dragonType = response.push({
                id: tokenRes.tokens[i],
                imageUrl: "...",
                rarity: getDragonType(tokenRes.tokens[i]),
            });
        }
        res.send(JSON.stringify({ dragons: response }));
    }
});

module.exports = router;
