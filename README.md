# not-your-keys

#### erc20 token
 - entity contract address (erc721 of players and npcs)
 - mapping for addresses that can mint
  + these are expected to be npcs
 - mapping for addresses that can transfer without approval
  + these are expected to be players, although might be interesting to have npcs attack players and other npcs later

#### erc721 entity
 - on creation, registers with token
 - exploit() function allows players to mint tokens to themselves
 - 



### jan 3 demo
 - Not Your Keys is an On-Chain PvP Hacking Sandbox
 - find deployed targets
 - examine their locks
 - and exploit them
 - ...but be warned, anything you can do to them, they can do to you

 - use the loot to upgrade your abilities and defenses
 - explore increasingly complex and hostile systems and locks
 - write automation to defend yourself
 
 wishlist (maybe):
 - use real exploit techniques to crack advanced locks
 - write your own locks


#### find deployed targets
 <!-- - targets will be deployed from a specific address
 - honestly, it'd be nice if this address was a GameManager contract, but i dont have time for that today, so it'll just need to be a Goerli burner wallet
 - ok, i need a GameManager so I have a contract to monitor for deploy events
 - seadrch for contract creation events? -->

 - I'm an idiot. Targets are Mint events.

#### examine their locks
 - this should be simple public functions that return friendly data.  json?
 - getLocks, getKeylist
  + { "0": "Color", "1": "Prime", etc };
  + [ 0x1234, 0x5678, etc ]
  + key must be a string. https://www.json.org/json-en.html

#### an exploit them
 - cast send 0x1234 "exploit(bytes32[])" [0x5678, 0x9012]