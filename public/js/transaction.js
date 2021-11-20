import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Transaction')
        this.txhashChars = /^[a-f0-9]*$/
        this.txhash = window.location.hash.substr(5)
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="txn-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading transaction...</span>
                </div>
            </div>
            <div id="txn-notfound">
                <h2>Transaction not found</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="txn-error">
                <h2>Something went wrong when retrieving transaction</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="txn-container">
                <h2 class="text-truncate">Transaction<small style="font-size: small" class="col-12 col-sm-9 text-muted" id="txn-id"></small></h2>
                <p class="lead" id="includedInBlock"></p>
                <div class="card dblocks-card" id="txn-card"></div><br>
                <div class="acc_transactionpage_rows">
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Type</p>
                     <p id="txn-det-type"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Sender</p>
                     <p id="txn-det-sender"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Timestamp</p>
                     <p id="txn-det-ts"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Hash</p>
                     <p id="txn-det-hash"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Signature</p>
                     <p style="max-width: 50vw;overflow: hidden" id="txn-det-sig"></p>
                   </div>
                </div><br>
                <h5>Transaction data</h5>
                <div style="background-color: white" id="txn-det-data"></div>
            </div><br>
        `
    }

    init() {
        if (this.txhash.length !== 64 || !this.txhashChars.test(this.txhash)) {
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            $('#txn-notfound').show()
            return
        }
    
        axios.get(config.api + '/tx/' + this.txhash).then((txn) => {
            $('#txn-id').text(txn.data.hash)
            $('#includedInBlock').text('Included in block #' + thousandSeperator(txn.data.includedInBlock))
            $('#txn-card').html('<p class="dblocks-card-content">'+txToHtml(txn.data)+'</p>')
            $('#txn-det-type').text(txn.data.type)
            $('#txn-det-type').append(' <span class="badge badge-pill badge-info">' + TransactionTypes[txn.data.type] + '</span>')
            $('#txn-det-sender').text(txn.data.sender)
            $('#txn-det-ts').text(txn.data.ts)
            $('#txn-det-ts').append(' <span class="badge badge-pill badge-info">' + new Date(txn.data.ts).toLocaleString() + '</span>')
            $('#txn-det-hash').text(txn.data.hash)
            $('#txn-det-sig').text(txn.data.signature)
    
            $('#txn-det-data').append(jsonToTableRecursive(txn.data.data))
    
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            $('#txn-container').show()
        }).catch((e) => {
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404')
                $('#txn-notfound').show()
            else
                $('#txn-error').show()
        })
    }
}
