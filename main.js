const SHA256 = require('crypto-js/sha256');

class block{
    constructor(timestamp, report, previoushash = ''){
            //this.index = index;
            this.timestamp = timestamp;
            this.report = report;
            this.previoushash = previoushash;
            this.hash = this.calculatehash();
            this.nonce=0;
    }

    calculatehash(){
        return SHA256(this.timestamp + this.report + this.previoushash + this.nonce);
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
          this.nonce++;
          this.hash = this.calculateHash();
        }

    }
}
class blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
      }

    
    createGenesisBlock() {
        return new Block(Date.parse('2017-01-01'), [], '0');
      }
    
    getlatestblock(){
        return this.chain[this.chain.length - 1];
    }

    
}