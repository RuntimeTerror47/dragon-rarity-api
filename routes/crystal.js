var express = require("express");
var router = express.Router();
var { CosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

const RPC_URL = "https://rpc-juno.mib.tech";

const CRYSTAL_CONTRACT =
    "juno1xkqyafslv3ym40ew8utxf0qm4d7kvm0wu6f4w6unfmc5d2jvk2nqxa5t5p";

const COSMIC_CONTRACT =
    "juno1yxglckfvnzx4utgkk9u8z4mu8yz2vwz7g2uqpxna4e577fxfjc4q3c6acf";

router.get("/:address", async function (req, res) {
    let owner = req.params["address"];
    let error = false;
    let response = [];

    try {
        const client = await CosmWasmClient.connect(RPC_URL);

        let res = await client.queryContractSmart(CRYSTAL_CONTRACT, {
            Tokens: { owner: owner, limit: 100 },
        });
        let limit = res.tokens.length;
        let res2;
        for (let i = 0; i < limit; i++) {
            res2 = await client.queryContractSmart(CRYSTAL_CONTRACT, {
                NftInfo: { token_id: res.tokens[i] },
            });

            if (res2) {
                switch (res2.extension.attributes[0].value) {
                    case "ice":
                        ice = true;
                        response.push({
                            rarity: "ice",
                        });
                        break;

                    case "storm":
                        storm = true;
                        response.push({
                            rarity: "storm",
                        });
                        break;

                    case "udin":
                        udin = true;
                        response.push({
                            rarity: "udin",
                        });
                        break;

                    case "divine":
                        divine = true;
                        response.push({
                            rarity: "divine",
                        });
                        break;
                    case "fire":
                        fire = true;
                        response.push({
                            rarity: "fire",
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    } catch (err) {
        console.log(err);
        error = true;
    }

    try {
        const cosmicClient = await CosmWasmClient.connect(RPC_URL);

        let res = await cosmicClient.queryContractSmart(COSMIC_CONTRACT, {
            RangeUserCosmics: {
                start_after: null,
                limit: null,
                owner,
            },
        });
        for (let i = 0; i <= res.cosmics.length; i++) {
            let cosmic = res.cosmics[i];
            if (cosmic && !cosmic.is_staked) {
                response.push({
                    rarity: "cosmic",
                });
            }
        }
    } catch (err) {
        console.log(err);
        error = true;
    }

    if (error) {
        res.send(JSON.stringify({ crystals: [] }));
    } else {
        res.send(JSON.stringify({ crystals: response }));
    }
});

module.exports = router;
