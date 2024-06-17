# Encode-solidity-bootcamp
Encode-solidity-bootcamp Group5 submissions

# Group 5 

## **Team members**
* pYUvum -  @icecoldt 

* cTVkkJ - @Ab3 

* HU9kye - @Chris 

* 18IA07 - @saad.igueninni 

* Ik3gH6 - @Merc 

## Week 1
- [X]  See Folder Week1 , file report.txt

## Week 2
- [X]  See Folder Week2
- Script are on folder 'scripts'
- Report on folder 'report'
- New tests were added to /test/Ballot.ts

### Test Scenario for scripts

- npx ts-node --files ./scripts/DeployWithViem.ts "proposal1" "proposal2" "proposal3"
    --> contract deployed to 0xd9d7b77ed2dc6e3ab1cf648e0c4f20b76d63989a	 
- npx ts-node --files ./scripts/GiveRightToVote.ts "0xd9d7b77ed2dc6e3ab1cf648e0c4f20b76d63989a" "0x1d3e983aBA5c5AA500a68196d6E2e7254973C8c9" 
- npx ts-node --files ./scripts/GiveRightToVote.ts "0xd9d7b77ed2dc6e3ab1cf648e0c4f20b76d63989a" "0xB3B089134988b6CB5552e2C37CBa612eDd410f31" 
- npx ts-node --files ./scripts/DelegateVotes.ts "0xd9d7b77ed2dc6e3ab1cf648e0c4f20b76d63989a"  "0xB3B089134988b6CB5552e2C37CBa612eDd410f31" 
- npx ts-node --files ./scripts/CastVote.ts "0xd9d7b77ed2dc6e3ab1cf648e0c4f20b76d63989a" "0" 
- npx ts-node --files ./scripts/QueryingResult.ts "0xd9d7b77ed2dc6e3ab1cf648e0c4f20b76d63989a"

## Week 3
- [X] See Folder Week3/token-votes/
- Script are on folder 'scripts'
- Report on folder 'report'
- TokenizedBallot contract was completed

### Test Scenario for scripts
All script are on same file as we are using hardhat to deploy and parameters possible with deploy with Hardhat.
- npx hardhat run .\scripts\testTokens.ts --network sepolia

