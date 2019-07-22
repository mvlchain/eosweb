/*
   Created by eoswebnetbp1
*/

const async = require('async');
const Bluebird = require('bluebird');
const configName    = (process.env.CONFIG) ? process.env.CONFIG : 'config';
const config        = require(`../../${configName}`);
const MongoDatabase = require('../database/db.mongo.connect');
let customFunctions = {};

customFunctions.getLastBlocks = async (eos, elements, callback) => { //modify
    let resultArr = [];
    try {
        const result = await eos.getInfo({})
        if (!result.head_block_num) {

            return callback('Cannot get info from blockChain!')
        }
        const database = await MongoDatabase.getConnection();
        const db = database.db('EOS');
        try {
            await Bluebird.each(elements, async (elem) => {
                let query = {
                    block_num: parseInt(result.head_block_num - elem, 10)
                }
                try {
                    const block = await db
                        .collection('blocks')
                        .findOne(query)
                    resultArr.push([block])
                } catch (e) {
                    console.error('customFunctions get Block Error - ', e)
                }
            });
            resultArr.sort((a, b) => b.block_num - a.block_num)
            callback(null, resultArr)
        } catch (e) {
            callback(e)
        }

    } catch (e) {
        console.error("getInfo Err", e);
        callback(e)
    }
};

function getBlockOffset(){
	  eos.getBlock({ block_num_or_id: result.head_block_num })
	     .then(block => {
	     	    if (block.transactions && block.transactions.length > 0 && block.transactions.length < config.offsetElementsOnMainpage){
					resultArr.push(block.transactions);
	     	    } else if (block.transactions.length > config.offsetElementsOnMainpage){
	     	    	block.transactions.slice(0, config.offsetElementsOnMainpage);
	     	    }
	     		
	     })
	     .catch(err => {
	     		console.error('customFunctions getBlock error - ', err);
	     });
}

module.exports = customFunctions;
