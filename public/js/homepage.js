import view from './view.js'
import BlockStreamer from './blockStreamer.js'

export default class extends view {
    count = 0;
    ids = [];
    miners = [];
    txss = [];
    dists = [];
    burns = [];
    constructor() {
        super()
        this.setTitle();
    }

    getHtml() {
        return `
            <div class="row">
                <div style="margin-bottom:50px"><center><img src="https://i.postimg.cc/FF83HCvZ/breeze-logo.png" width="40%"></center></div>

               <div class="homepage_top">
                <div style="border-left: 5px solid #84a0e2" class="homepageTop_comp">
                  <p>Total Supply</p>
                  <p id="totalSupply" style="font-size: xx-large"></p>
                  <div onclick="window.location.href = '#/richlist'">
                    <p>View rich list</p>
                    <img style="align-self: center;" src="icons/arrowRight.svg">
                  </div>
                </div>
                <div class="homepageTop_comp">
                  <p>Last block</p>
                  <p id="lastBlock" style="font-size: xx-large"></p>
                  <div>
                    <p>View all blocks</p>
                    <img style="align-self: center;" src="icons/arrowRight.svg">
                  </div>
                </div>
                <div class="homepageTop_comp">
                    <p>Total witness</p>
                    <p id="totalwitness" style="font-size: xx-large"></p>
                    <div onclick="window.location.href = '#/witness'">
                    <p>View all witness</p>
                    <img style="align-self: center;" src="icons/arrowRight.svg">
                    </div>
                </div>
               </div>
                <div style="color: white; margin-top: 40px" class="col-12 col-md">
                    <h3>Latest Blocks</h3>
                    <div class="latestBlock_header">
                      <p class="p1">Block</p>
                      <p class="p2">Witness</p>
                      <p class="p3">Transaction</p>
                      <p class="p4">Time</p>
                    </div>
                    <div id="newblockslst"></div>
                </div>
            </div>
        `
    }

    init() {
        // Load supply and reward pool, and update every 10 seconds
        //this.updateChainInfo()
        let blkStreamer = new BlockStreamer()
        blkStreamer.streamBlocks((newBlock) => $('#newblockslst').prepend(this.newBlockCardHtml(newBlock)))
        intervals.push(setInterval(this.updateChainInfo,10000))
    }

    updateChainInfo() {
        // axios.get(config.api + '/supply').then((supplyRes) => {
        //     $('#supply-circulating').text(thousandSeperator(supplyRes.data.circulating / 100) + ' DTC')
        //     $('#supply-unclaimed').text(thousandSeperator(Math.ceil(supplyRes.data.unclaimed) / 100) + ' DTC')
        //     $('#supply-total').text(thousandSeperator(Math.ceil(supplyRes.data.total) / 100) + ' DTC')
        // })
    
        // axios.get(config.api + '/rewardPool').then((rpRes) => {
        //     $('#rp-theo').text(thousandSeperator(rpRes.data.theo / 100) + ' DTC')
        //     $('#rp-dist').text(thousandSeperator(Math.ceil(rpRes.data.dist) / 100) + ' DTC')
        //     $('#rp-avail').text(thousandSeperator(Math.ceil(rpRes.data.avail) / 100) + ' DTC')
        //     $('#rp-burn').text(thousandSeperator(Math.ceil(rpRes.data.burn) / 100) + ' DTC')
        //     $('#rp-votes').text(thousandSeperator(Math.ceil(rpRes.data.votes)) + ' VP')
        // })
    }

    newBlockCardHtml(block) {
            let blockCardHtml = '<div class="card dblocks-card" style="flex-direction:initial;width: 80vw">'
            blockCardHtml += '<a class="p1" href="#/b/'+block._id+'">#'+block._id+'</a>'
            // blockCardHtml += '&nbsp;by&nbsp;'
            blockCardHtml += '<a class="p2" href="#/@'+block.miner+'">'+block.miner+'</a>'
            // blockCardHtml += '&nbsp;-&nbsp;'
            blockCardHtml += '<p class="p3">'+block.txs.length+'</p>'
        
            // if (isPuralArr(block.txs))
            //     blockCardHtml += ' tx(s), '
            // else
            //     blockCardHtml += ' tx, dist: '
            
            blockCardHtml += '<p id="blk-det-ts" class="p4"></p>'
            // blockCardHtml += ' DTC'
        
            if (block.burn) {
                // blockCardHtml += ', burned: '
                blockCardHtml += '<p id="blk-det-ts" class="p4"></p>'
                // blockCardHtml += ' DTC'
            }
            axios.get(config.api + '/block/' + block._id).then((blk) => {
                $('#blk-det-ts').text(new Date(blk.data.timestamp).toLocaleString())
            });
            axios.get(config.api + '/supply').then((supplyRes) => {
                $('#totalSupply').text(thousandSeperator(supplyRes.data.circulating / 1000000) + ' TOKM')
            })
            axios.get(config.api + '/rank/witnesses').then((witness) => {
            $('#totalwitness').text(witness.data.length)    
            })
            $('#lastBlock').text(block._id)
            blockCardHtml += '</div>'
            this.count = this.count + 1;
            return blockCardHtml
    }
    
}
