var express = require("express");
var router = express.Router();
var { CosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

const CONTRACT_ADDRESS =
    "juno1segt88gmnpj4fc30h8jczetjw5zz58qlqgk6tty2kamdg7kn3x0sfv3j9x";
const RPC_URL = "https://rpc.juno.giansalex.dev";

/* GET users listing. */
router.get("/:address", async function (req, res, next) {
    let owner = req.params["address"];
    let tokenRes;
    let error = false;
    try {
        const client = await CosmWasmClient.connect(RPC_URL);
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
            response.push({
                id: tokenRes.tokens[i],
                imageUrl: "...",
                rarity: "Common",
            });
        }
        res.send(JSON.stringify({ dragons: response }));
    }
});

module.exports = router;
