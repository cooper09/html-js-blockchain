class Transaction {
    constructor (fromAddress, toAddress, amount ){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

    }//end constructor

}//end Transaction

class Block {
    constructor (timestamp, transactions, previousHash ='') {
        //this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.createHash();
        //add nonce for mining
        this.nonce = 0;
    }
    //getPreviousHash

    //getNewHash
    createHash() {
        //return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
        return CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+ this.nonce ).toString()
    }//end createHash

    //Set up Proof of Work
    mineBlock(difficulty ) {
        console.log("Whistle while you work!");
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.createHash();
        }//end while 
        console.log("New Block has been mined: ", this.hash );
    }//end mineBlock

}//end Block

class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    //create genesis block
    createGenesisBlock () {
        const time = new Date().getTime();
        return new Block( time ,'Genesis Block' , '0' );
    }
    //get last block
    getLatestBlock() {
        //console.log("getLatestBlock: ", this.chain[this.chain.length-1] );
        return this.chain[this.chain.length - 1];
    }
    // create new block
   /*addBlock(newBlock) {
        //console.log("newBlock: ", this.getLatestBlock().hash);
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.createHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    } */

    //Instead of mining block by block, queue them up as transactions and go from there...
    minePendingTransactions (miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Transaction block successfully mined.");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress,this.miningReward )
        ]
    }//end minePendingTransactions

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }//end createTransaction

    getBalanceOfAddress (address) {
        console.log("Address balance: ", address )
        let balance = 0;
        for (const block of this.chain ) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }//end if
                
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }//end if
            }//end for
        }//end for
        return balance;
    }//end getBalanceOf

    // validate block
    validate() {
        for (let i=1 ; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            
            //console.log("validate = currentBlock: ", this.chain[i] );
            if ( currentBlock.hash !== currentBlock.createHash()) {
                return false;
            }//end iffy

            if (currentBlock.previousHash !== previousBlock.hash ) {
                return false;
            }

        }//end for

        // if we reach here, the chain is valid
        return true;
    }//end validate

}//end Blockchain
