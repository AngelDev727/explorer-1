import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.blockNum = parseInt(window.location.hash.substr(4))
        this.setTitle('Block #' + this.blockNum)
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="blk-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading block...</span>
                </div>
            </div>
            <div id="blk-notfound">
                <h2>Block not found</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="blk-error">
                <h2>Something went wrong when retrieving block</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="blk-container">
                <div class="row blk-head">
                    <h1 class="col-12 col-sm-9"id="">Block Information</h1>
                    <div style="display: flex;font-size: large; margin-left: 20px">
                      <img style="fill: lightgreen;width: 24px;height: 24px;margin-right: 10px"  src="icons/signal.svg">
                      <p style="font-weight: bold">Block</p>
                      <p style="color: lightgreen;margin-left: 5px">|</p>
                      <p style="margin-left: 5px" id="topHash blk-num"></p>
                    </div>
                    <div style="display: flex; justify-content: flex-end;width: 80vw" ><div class="btn-group blk-btn-prevnext" role="group">
                        <a style="border-bottom: 1px solid skyblue" id="blk-btn-prev">Previous block</a>
                        <a style="border-bottom: 1px solid skyblue;margin-left: 10px" id="blk-btn-next">Next block</a>
                    </div></div>
                </div><br>
                <div class="blocks">
                  <div style="border-left: 5px solid lightgreen" class="block">
                    <p style="font-size: small">Block Number</p>
                    <p style="line-height: 0.5;font-weight: 600" id="blk-num"></p>
                  </div>
                  <div class="block">
                    <p style="font-size: small">Transactions</p>
                    <p style="line-height: 0.5;font-weight: 600" id="blk-txs-heading">0</p>
                  </div>
                  <div class="block">
                    <p style="font-size: small">Hash</p>
                    <p style="width: 100%;font-weight: 600;word-wrap: break-word;" id="blk-det-hash"></p>
                  </div>
                </div>
                <div class="blocks">
                  <div style="border-left: 5px solid lightgreen" class="block">
                    <p style="font-size: small">Timestamp</p>
                    <p style="line-height: 0.5;font-weight: 600" id="blk-det-ts"></p>
                  </div>
                  <div class="block">
                    <p style="font-size: small">Miner</p>
                    <p style="line-height: 0.5;font-weight: 600" id="blk-det-miner"></p>
                  </div>
                  <div class="block">
                    <p style="font-size: small">Phash</p>
                    <p style="width: 100%;font-weight: 600;word-wrap: break-word;" id="blk-det-phash"></p>
                  </div>
                </div>
                <div class="blocks">
                  <div style="border-left: 5px solid lightgreen" class="block">
                    <p style="font-size: small">Dist</p>
                    <p style="line-height: 0.5;font-weight: 600" id="blk-det-dist"></p>
                  </div>
                  <div class="block">
                    <p style="font-size: small">Burn</p>
                    <p style="line-height: 0.5;font-weight: 600" id="blk-det-burn"></p>
                  </div>
                  <div class="block">
                    <p style="font-size: small">Signature</p>
                    <p style="width: 100%;font-weight: 600;word-wrap: break-word;" id="blk-det-sig"></p>
                  </div>
              </div>
              <div id="blk-txs">
                  <h5 id="blk-txs-heading">0 transactions in this block</h5>
              </div>
              
              <div style="height: 100px"></div>
        `
    }

    init() {
        if (isNaN(this.blockNum)) {
            $('#blk-loading').hide()
            $('.spinner-border').hide()
            $('#blk-notfound').show()
            return
        }
        axios.get(config.api + '/block/' + this.blockNum).then((blk) => {
            $('#blk-num').text('Block #'+thousandSeperator(this.blockNum))
            $('#blk-det-phash').text(blk.data.phash)
            $('#blk-det-ts').text(blk.data.timestamp)
            $('#blk-det-ts').append(' <span class="badge badge-pill badge-info">' + new Date(blk.data.timestamp).toLocaleString() + '</span>')
            $('#blk-det-miner').text(blk.data.miner)
    
            if (blk.data.missedBy)
                $('#blk-det-miss').text(blk.data.missedBy)
            else
                $('#blk-fld-miss').hide()
    
            $('#blk-det-dist').text(blk.data.dist || '0')
            $('#blk-det-burn').text(blk.data.burn || '0')
            $('#blk-det-hash').text(blk.data.hash)
            $('#blk-det-sig').text(blk.data.signature)
    
            // Prepare previous and next buttons
            $('#blk-btn-prev').attr('href','/b/' + (this.blockNum-1))
            $('#blk-btn-next').attr('href','/b/' + (this.blockNum+1))
    
            // Genesis and hardfork badge
            if (this.blockNum == 0) {
                $('#blk-btn-prev').hide()
                $('#blk-btn-next').css('border-top-left-radius','0.25rem')
                $('#blk-btn-next').css('border-bottom-left-radius','0.25rem')
                $('#blk-num').append(' <span class="badge badge-secondary">Genesis</span>')
            }
    
            // List transactions
            if (blk.data.txs.length > 0) {
                if (isPuralArr(blk.data.txs))
                    $('#blk-txs-heading').text(blk.data.txs.length + ' transactions in this block')
                else
                    $('#blk-txs-heading').text('1 transaction in this block')
                $('#blk-txs').append(txCardsHtml([blk.data]))
            }
    
            addAnchorClickListener()
            $('#blk-loading').hide()
            $('.spinner-border').hide()
            $('#blk-container').show()
        }).catch((e) => {
            $('#blk-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404') {
                $('#blk-notfound').show()
            } else $('#blk-error').show()
        })
    }
}
