var express = require("express");
var router = express.Router();
var { CosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

const RPC_URL = "https://rpc-juno.itastakers.com";

const DRAGON_CONTRACT =
    "juno102ez6q5vqgh0a56rttvl5hwx2adp7hn2lxnhygm93exkkac6hrkstlh5mw";

const WHITELIST_ADDRESS =
    "juno1kjtwd7jqs9yyfl5sfmqvvp9rwdzzra50qs6jjsc0gudrtuah0a3sxajah5";
const MAINNET_RPC = "https://rpc.juno-1.deuslabs.fi";

let common_img =
    "https://bafybeiacxf7hsoqkyhg6fqa6ktnxvtoni32tyuqd6w2mgpk7vosxg4y2ve.ipfs.nftstorage.link/1.png";
let uncommon_img =
    "https://bafybeiacxf7hsoqkyhg6fqa6ktnxvtoni32tyuqd6w2mgpk7vosxg4y2ve.ipfs.nftstorage.link/2.png";
let rare_img =
    "https://bafybeiacxf7hsoqkyhg6fqa6ktnxvtoni32tyuqd6w2mgpk7vosxg4y2ve.ipfs.nftstorage.link/3.png";
let epic_img =
    "https://bafybeiacxf7hsoqkyhg6fqa6ktnxvtoni32tyuqd6w2mgpk7vosxg4y2ve.ipfs.nftstorage.link/4.png";
let legendary_img =
    "https://bafybeiacxf7hsoqkyhg6fqa6ktnxvtoni32tyuqd6w2mgpk7vosxg4y2ve.ipfs.nftstorage.link/5.png";

/* GET users listing. */
router.get("/:address", async function (req, res, next) {
    let owner = req.params["address"];
    let tokenRes;
    let error = false;
    let common = false;
    let uncommon = false;
    let rare = false;
    let epic = false;
    let legendary = false;

    try {
        const client = await CosmWasmClient.connect(RPC_URL);

        let res = await client.queryContractSmart(DRAGON_CONTRACT, {
            RangeUserDragons: { start_after: 0, owner: owner },
        });
        tokenRes = res;
    } catch (err) {
        error = true;
    }

    try {
        const client2 = await CosmWasmClient.connect(MAINNET_RPC);

        whitelistRes = await client2.queryContractSmart(WHITELIST_ADDRESS, {
            Tokens: { owner: owner },
        });
    } catch (err) {
        error = true;
    }

    //Get Tokens
    if (
        error ||
        !tokenRes ||
        (tokenRes.dragons.length === 0 && whitelistRes.tokens.length === 0)
    ) {
        res.send(JSON.stringify({ dragons: [] }));
    } else {
        let response = [];

        for (let i = 0; i < tokenRes.dragons.length; i++) {
            if (!tokenRes.dragons[i].is_staked) {
                let rarity = tokenRes.dragons[i].kind;

                if (rarity == "common" && !common) {
                    response.push({
                        id: tokenRes.dragons[i].token_id,
                        imageUrl: common_img,
                        rarity: rarity,
                    });
                    common = true;
                } else if (rarity == "uncommon" && !uncommon) {
                    response.push({
                        id: tokenRes.dragons[i].token_id,
                        imageUrl: uncommon_img,
                        rarity: rarity,
                    });
                    uncommon = true;
                } else if (rarity == "rare" && !rare) {
                    response.push({
                        id: tokenRes.dragons[i].token_id,
                        imageUrl: rare_img,
                        rarity: rarity,
                    });
                    rare = true;
                } else if (rarity == "epic" && !epic) {
                    response.push({
                        id: tokenRes.dragons[i].token_id,
                        imageUrl: epic_img,
                        rarity: rarity,
                    });
                    epic = true;
                } else if (rarity == "legendary" && !legendary) {
                    response.push({
                        id: tokenRes.dragons[i].token_id,
                        imageUrl: legendary_img,
                        rarity: rarity,
                    });
                    legendary = true;
                }
            }
        }
        if (whitelistRes.tokens.length !== 0) {
            response.push({
                id: whitelistRes.tokens[0],
                imageUrl: "",
                rarity: "starter",
            });
        }
        res.send(JSON.stringify({ dragons: response }));
    }
});

module.exports = router;
