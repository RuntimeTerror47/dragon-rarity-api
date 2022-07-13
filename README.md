# API consist of a single endpoint.
### GET request /dragons/{wallet_address} returns a list of available dragons for user to play with (excluding listed and staked ones)
```
dragons: [ 
  {
    "id": "string", 
    "imageUrl": "string",
    "rarity": "string",
  }
]
Also, a secret key field can be added to request header to improve security
```
