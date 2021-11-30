import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('witness')
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="witness-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading witness...</span>
                </div>
            </div>
            <div id="witness-error">
                <h2>Something went wrong when retrieving witness</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="witness-container">
                <h2>witness</h2>
                <p>DTube is a self-governed platform, where a limited number of witness (currently 13) are elected and are in charge of producing new blocks and securing the infrastructure. Here you may find the statistics of the top 100 witness. Only witness with their signing key activated are listed here.</p>
                <table style="color: white" class="table table-sm table-striped" id="witness-table">
                    <thead><tr>
                        <th scope="col">Rank</th>
                        <th scope="col">Account</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Approval</th>
                        <th scope="col">Voters</th>
                        <th scope="col">Produced</th>
                        <th scope="col">Missed</th>
                        <th scope="col">Subscribers</th>
                        <th scope="col">Subscribed</th>
                    </tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        `
    }

    init() {
        axios.get(config.api + '/rank/witnesses').then((witness) => {
            let htmlresult = ''
            for (let i = 0; i < witness.data.length; i++) {
                htmlresult += '<tr><th scope="row">' + (i+1) + '</th>'
                htmlresult += '<td>' + witness.data[i].name + '</td>'
                htmlresult += '<td>' + thousandSeperator((witness.data[i].balance / 100).toFixed(2)) + ' DTC</td>'
                htmlresult += '<td>' + thousandSeperator((witness.data[i].node_appr / 100).toFixed(2)) + ' DTC</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].voters) + '</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].produced) + '</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].missed) + '</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].subs) + '</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].subbed) + '</td>'
                htmlresult += '</tr>'
            }
            $('#witness-table tbody').append(htmlresult)
            $('#witness-loading').hide()
            $('.spinner-border').hide()
            $('#witness-container').show()
        }).catch(() => {
            $('#witness-loading').hide()
            $('.spinner-border').hide()
            $('#witness-error').show()
        })
    }
}


//setInterval(() => { if($('#newblockslst').children().length > 10) {$('#newblockslst').children().last().remove()}}, 2500)
        