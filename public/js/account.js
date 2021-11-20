import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.url = new URL(window.location.href)
        this.account = window.location.hash.split('/')[1].substr(1)
        this.accountlastupdate = 0
        this.accountdata = null
        this.accountnotfound = false
        this.accountHistoryPage = parseInt(window.location.hash.split('/')[2]) || 1
        this.witnessLastUpdate = 0
        this.historyLoaded = false
        this.setTitle('@' + this.account)
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="acc-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading account...</span>
                </div>
            </div>
            <div id="acc-notfound">
                <h2>Account not found</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="acc-error">
                <h2>Something went wrong when retrieving account</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="acc-container">
                <h1 id="acc-name"></h1>
                <!-- Left panel - Account details -->
                <p>Address | <span id="acc-witness-key"></span></p>

                <div class="acc_rows">
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Balance</p>
                     <p id="acc-meta-bal"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Bandwidth</p>
                     <p id="acc-meta-bw"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Voting Power</p>
                     <p id="acc-meta-vp"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Subscribes</p>
                     <p id="acc-meta-subs"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Subscribed To</p>
                     <p id="acc-meta-subbed"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Pending Rewards</p>
                     <p id="acc-meta-pending"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Claimable Rewards</p>
                     <p id="acc-meta-claimable"></p>
                   </div>
                   <div class="acc_row">
                     <p style="font-size: larger;font-weight: bold">Claimed Rewards</p>
                     <p id="acc-meta-claimed"></p>
                   </div>
                </div>
                <div class="row">
                    <div style="margin-top: 20px" class="col-12 col-lg-4">
                        <table class="table table-sm">
                        <a type="button" target="_blank" class="btn btn-primary btn-block" id="acc-profile-dtube"><img src="icons/DTube_White.png">View channel on DTube</a>
                        <a type="button" target="_blank" class="btn btn-primary btn-block" id="acc-profile-hive"><img src="icons/Hive_White.png">View profile on PeakD</a>
                        <a type="button" target="_blank" class="btn btn-primary btn-block" id="acc-profile-steem"><img src="icons/Steem_White.png">View profile on SteemPeak</a>
                        <h6><br></h6>
                        <div id="acc-profile-metadata">
                            <h4>Metadata</h4>
                            <div id="acc-profile-json"></div>
                        </div>
                        <h4>Public Keys</h4>
                        <div class="accordion" id="acc-customkey">
                            <div class="card">
                            <div class="card-header" id="acc-masterkey-card">
                                <h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#acc-masterkey-collapse" aria-expanded="true" aria-controls="acc-masterkey-collapse"><strong>Master</strong></button></h5>
                            </div>
                            <div id="acc-masterkey-collapse" class="collapse" aria-labelledby="acc-masterkey-card" data-parent="#acc-customkey">
                                <div class="card-body" id="acc-masterkey-det"></div>
                            </div>
                            </div>
                        </div>
                        <br>
                        <div style="margin-top: 20px" id="acc-witness"><h4>witness Details</h4>
                        <div class="acc_rows">
                            <div class="acc_row1">
                               <p style="font-size: larger;font-weight: bold">Peer</p>
                               <p id="acc-witness-ws"></p>
                            </div>
                            <div class="acc_row1">
                               <p style="font-size: larger;font-weight: bold">Approval</p>
                               <p id="acc-witness-appr"></p>
                            </div>
                            <div class="acc_row1">
                               <p style="font-size: larger;font-weight: bold">Voters</p>
                               <p id="acc-witness-voters"></p>
                            </div>
                            <div class="acc_row1">
                               <p style="font-size: larger;font-weight: bold">Produced</p>
                               <p id="acc-witness-produced"></p>
                            </div>
                            <div class="acc_row1">
                               <p style="font-size: larger;font-weight: bold">Missed</p>
                               <p id="acc-witness-miss"></p>
                            </div>
                        </div>    
                        </div>
                        <h4 style="margin-top: 40px">witness Votes</h4>
                        <div style=""margin-top: 0px"" class="acc_rows">
                            <div class="acc_row1">
                               <p style="font-size: larger;font-weight: bold" id="acc-meta-approves"></p>
                            </div>
                        <div>    
                        <table class="table table-sm"></table>
                        <p id="acc-meta-created"></p>
                    </div>
                    <!-- Right panel - Account history -->
                    <div class="col-12 col-lg" id="acc-history">
                        <div id="acc-history-itms"></div>
                        <nav><ul class="pagination">
                            <li class="page-item" id="acc-history-page-prev"><a class="page-link" tabindex="-1">Previous</a></li>
                            <li class="page-item" id="acc-history-page-1"><a class="page-link">1</a></li>
                            <li class="page-item" id="acc-history-page-2"><a class="page-link">2</a></li>
                            <li class="page-item" id="acc-history-page-3"><a class="page-link">3</a></li>
                            <li class="page-item" id="acc-history-page-4"><a class="page-link">4</a></li>
                            <li class="page-item" id="acc-history-page-5"><a class="page-link">5</a></li>
                            <li class="page-item" id="acc-history-page-next"><a class="page-link">Next</a></li>
                        </ul></nav>
                    </div>
                </div>
            </div>
        `
    }

    init() {
        axios.get(config.api + '/account/' + this.account).then((acc) => {
            this.accountdata = acc.data
            this.accountlastupdate = new Date().getTime()

            // Fill account details
            // $('#acc-name').text('@' + acc.data.name)
            $('#acc-name').text('Address Information')
            $('#acc-masterkey-det').html(this.formatPubKeys({
                pub: acc.data.pub,
                types: []
            }))
            $('#acc-customkey').append(this.customKeyHtml(acc.data.keys))
            $('#acc-profile-dtube').attr('href','https://d.tube/#!/c/' + acc.data.name)

            if (acc.data.json && acc.data.json.profile && acc.data.json.profile.hive) {
                $('#acc-profile-hive').show()
                $('#acc-profile-hive').attr('href','https://peakd.com/@' + acc.data.json.profile.hive)
            }

            if (acc.data.json && acc.data.json.profile && acc.data.json.profile.steem) {
                $('#acc-profile-steem').show()
                $('#acc-profile-steem').attr('href','https://steempeak.com/@' + acc.data.json.profile.steem)
            }

            let accCreatedStr = 'Created by '
            if (acc.data.created) {
                accCreatedStr += acc.data.created.by
                accCreatedStr += ' on '
                accCreatedStr += new Date(acc.data.created.ts).toLocaleString()
            } else {
                accCreatedStr += 'dtube on ' + new Date(1593350655283).toLocaleString() // timestamp of block #1 on testnet v2
            }
            $('#acc-meta-created').text(accCreatedStr)

            if (acc.data.json)
                $('#acc-profile-json').html(jsonToTableRecursive(acc.data.json))
            else
                $('#acc-profile-metadata').hide()

            

            
            
            this.updateAccount(acc.data)
            this.display()
            intervals.push(setInterval(()=>this.reloadAccount((newacc)=>this.updateAccount(newacc)),10000))
        }).catch((e) => {
            $('#acc-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404') {
                this.accountnotfound = true
                $('#acc-notfound').show()
            } else
                $('#acc-error').show()
        })

        let accountHistoryUrl = config.api + '/history/' + this.account + '/0'
        if (isNaN(this.accountHistoryPage))
            this.accountHistoryPage = 1
        accountHistoryUrl += '/' + ((this.accountHistoryPage - 1) * 50)

        axios.get(accountHistoryUrl).then((history) => {
            // Render account history cards
            $('#acc-history-itms').html(txCardsHtml(history.data))

            // Render account history pagination
            $('#acc-history-page-next a').attr('href','#/@' + this.account + '/' + (this.accountHistoryPage+1))
            if (this.accountHistoryPage == 1)
                $('#acc-history-page-prev').addClass('disabled')
            else
                $('#acc-history-page-prev a').attr('href','#/@' + this.account + '/' + (this.accountHistoryPage-1))
            if (this.accountHistoryPage >= 3) {
                $('#acc-history-page-3').addClass('active')
                for (let i = 0; i < 5; i++) {
                    $('#acc-history-page-' + (i+1) + ' a').text(this.accountHistoryPage-2+i)
                    $('#acc-history-page-' + (i+1) + ' a').attr('href','#/@' + this.account + '/' + (this.accountHistoryPage-2+i))
                }
            } else {
                $('#acc-history-page-' + this.accountHistoryPage).addClass('active')
                for (let i = 0; i < 5; i++)
                    $('#acc-history-page-' + (i+1) + ' a').attr('href','#/@' + this.account + '/' + (i+1))
            }

            if (history.data.length < 50) {
                $('#acc-history-page-next').addClass('disabled')
                if (this.accountHistoryPage < 3) for (let i = this.accountHistoryPage; i < 5; i++) {
                    $('#acc-history-page-' + (i+1)).hide()
                } else {
                    $('#acc-history-page-4').hide()
                    $('#acc-history-page-5').hide()
                }
            }

            this.historyLoaded = true
            this.display()
        })
    }

    reloadAccount(cb) {
        if (new Date().getTime() - this.accountlastupdate < 60000) return cb(this.accountdata)
        axios.get(config.api + '/account/' + this.account).then((acc) => {
            this.accountdata = acc.data
            cb(acc.data)
        }).catch(() => cb(this.accountdata))
    }

    updateAccount(acc) {
        $('#acc-meta-bal').text(thousandSeperator(acc.balance / 100) + ' DTC')
        $('#acc-meta-bw').text(thousandSeperator(bandwidth(acc)) + ' bytes')
        $('#acc-meta-vp').text(thousandSeperator(votingPower(acc)) + ' VP')
        $('#acc-meta-subs').text(thousandSeperator(acc.followers.length))
        $('#acc-meta-subbed').text(thousandSeperator(acc.follows.length))
        $('#acc-meta-approves').html(this.witnessVotesHtml(acc.approves))
    
        if (acc.pub_witness) {
            this.updatewitnesstats()
            $('#acc-witness').show()
            $('#acc-witness-key').text(acc.pub_witness)
            $('#acc-witness-appr').text(thousandSeperator(acc.node_appr / 100) + ' DTC')
    
            if (acc.json && acc.json.node && acc.json.node.ws)
                $('#acc-witness-ws').text(DOMPurify.sanitize(acc.json.node.ws))
            else
                $('#acc-witness-ws').text('N/A')
        }
        addAnchorClickListener()
    }

    display() {
        if (this.account && this.historyLoaded && !this.accountnotfound) {
            $('#acc-loading').hide()
            $('.spinner-border').hide()
            $('#acc-container').show()
            addAnchorClickListener()
        }
    }

    customKeyHtml(keys) {
        let result = ''
        for (let i = 0; i < keys.length; i++) {
            let sanitizedId = DOMPurify.sanitize(keys[i].id)
            result += '<div class="card"><div class="card-header" id="acc-customkey-card-' + i + '">'
            result += '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#acc-customkey-collapse-' + i + '" aria-expanded="true" aria-controls="acc-customkey-collapse-' + i + '">' + sanitizedId + '</button></h5></div>'
            result += '<div id="acc-customkey-collapse-' + i + '" class="collapse" aria-labelledby="acc-customkey-card-' + i + '" data-parent="#acc-customkey">'
            result += '<div class="card-body">' + this.formatPubKeys(keys[i]) + '</div></div></div>'
        }
        return result
    }

    formatPubKeys(key) {
        let result = '<strong>Public Key: </strong>' + key.pub + '<br><br><strong>Permissions: </strong>'
        if (key.types.length == 0)
            result += 'ALL'
        else {
            let typesStringArr = []
            for (let i = 0; i < key.types.length; i++) {
                typesStringArr.push(TransactionTypes[key.types[i]])
            }
            result += typesStringArr.join(', ')
        }
        return result
    }
    
    witnessVotesHtml(approves) {
        let result = ''
        if (!approves) return 'Not voting for witness'
        for (let i = 0; i < approves.length; i++)
            result += '<tr><td><a href="#/@' + approves[i] + '">' + approves[i] + '</a></td></tr>'
        return result
    }

    updatewitnesstats() {
        if (new Date().getTime() - this.witnessLastUpdate < 120000) return
        axios.get(config.api + '/witness/' + this.account).then((witness) => {
            this.witnessLastUpdate = new Date().getTime()
            $('#acc-witness-voters').text(thousandSeperator(witness.data.voters))
            $('#acc-witness-produced').text(thousandSeperator(witness.data.produced))
            $('#acc-witness-miss').text(thousandSeperator(witness.data.missed))
        }).catch(()=>{})
    }
}
