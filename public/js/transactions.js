const TransactionTypes = {
    0: 'NEW_ACCOUNT',
    1: 'APPROVE_NODE_OWNER',
    2: 'DISAPPROVE_NODE_OWNER',
    3: 'TRANSFER',
    4: 'COMMENT',
    5: 'VOTE',
    6: 'USER_JSON',
    7: 'FOLLOW',
    8: 'UNFOLLOW',
    10: 'NEW_KEY',
    11: 'REMOVE_KEY',
    12: 'CHANGE_PASSWORD',
    13: 'PROMOTED_COMMENT',
    14: 'TRANSFER_VT',
    15: 'TRANSFER_BW',
    16: 'LIMIT_VT',
    17: 'CLAIM_REWARD',
    18: 'ENABLE_NODE',
    19: 'TIPPED_VOTE'
}

function txCardsHtml(blocks) {
    let result = ''
    for (let i = 0; i < blocks.length; i++)
        for (let j = 0; j < blocks[i].txs.length; j++) {
            result += '<div class="card dblocks-card"><p class="dblocks-card-content">' + DOMPurify.sanitize(txToHtml(blocks[i].txs[j]))
            result += ' <a href="#/tx/' + blocks[i].txs[j].hash + '" class="badge badge-pill badge-secondary">'
            result += blocks[i].txs[j].hash.substr(0,6)
            result += '</a></p></div>'
        }
    return result
}

function txToHtml(tx) {
    let result = aUser(tx.sender)
    switch (tx.type) {
        case 0:
            return result + ' created new account ' + aUser(tx.data.name)
        case 1:
            return result + ' approved witness ' + aUser(tx.data.target)
        case 2:
            return result + ' disapproved witness ' + aUser(tx.data.target)
        case 3:
            result = result + ' transferred ' + tx.data.amount / 100 + ' DTC to ' + aUser(tx.data.receiver)
            if (tx.data.memo)
                result += ', memo: ' + tx.data.memo
            return result
        case 4:
            if (tx.data.pa && tx.data.pp)
                result += ' commented on ' + aContent(tx.data.pa + '/' + tx.data.pp)
            else
                result += ' posted a new video ' + aContent(tx.sender + '/' + tx.data.link)
            return result
        case 5:
            if (tx.data.vt > 0)
                result += ' upvoted '
            else
                result += ' downvoted '
            result += aContent(tx.data.author + '/' + tx.data.link) + ' with ' + tx.data.vt + ' VP'
            if (tx.data.tag)
                result += ' and tagged it with ' + tx.data.tag
            return result
        case 6:
            return result + ' update profile'
        case 7:
            return result + ' subscribed to ' + aUser(tx.data.target)
        case 8:
            return result + ' unsubscribed to ' + aUser(tx.data.target)
        case 10:
            return result + ' created a custom key with id ' + tx.data.id
        case 11:
            return result + ' removed a custom key with id ' + tx.data.id
        case 12:
            return result + ' changed the master key'
        case 13:
            if (tx.data.pa && tx.data.pp)
                result += ' commented on ' + aContent(tx.data.pa + '/' + tx.data.pp)
            else
                result += ' posted a new video ' + aContent(tx.sender + '/' + tx.data.link)
            result += ' and burnt ' + (tx.data.burn / 100) + ' DTC '
            return result
        case 14:
            return result + ' transferred ' + tx.data.amount + ' VP to ' + aUser(tx.data.receiver)
        case 15:
            return result + ' transferred ' + tx.data.amount + ' bytes to ' + aUser(tx.data.receiver)
        case 16:
            return result + ' set a limit on account voting power to ' + tx.data.amount + ' VP'
        case 17:
            return result + ' claimed curation rewards on ' + aContent(tx.data.author + '/' + tx.data.link)
        case 18:
            return result + ' updated witness key for block production'
        case 19:
            if (tx.data.vt > 0)
                result += ' upvoted '
            else
                result += ' downvoted '
            result += aContent(tx.data.author + '/' + tx.data.link) + ' with ' + tx.data.vt + ' VP'
            if (tx.data.tag)
                result += ' and tagged it with ' + tx.data.tag
            result += ' (' + tx.data.tip + '% author tip)'
            return result
        default:
            return 'Unknown transaction type ' + tx.type
    }
}

function aUser(user) {
    return '<a href="#/@'+user+'">'+user+'</a>'
}

function aContent(content) {
    return '<a href="#/content/'+content+'">@'+content+'</a>'
}
