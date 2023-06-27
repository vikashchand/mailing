var assert = require('assert'),
    net = require('net'),
    Imap = require('../lib/Connection');

let result, body = '', bodyInfo;

const CRLF = '\r\n';

const RESPONSES = [
  // ['* OK Gimap ready for requests from 34.223.41.17 h98mb854172451pjb',
  //  ''
  // ].join(CRLF),
  ['* CAPABILITY IMAP4rev1 UNSELECT IDLE NAMESPACE QUOTA ID XLIST CHILDREN X-GM-EXT-1 XYZZY SASL-IR AUTH=XOAUTH2 AUTH=PLAIN AUTH=PLAIN-CLIENTTOKEN AUTH=OAUTHBEARER AUTH=XOAUTH',
   'A0 OK Thats all she wrote! h98mb854172451pjb',
   ''
  ].join(CRLF),
  ['* NO [WEBALERT https://accounts.google.com/signin/continue?sarp=1&scc=1&plt=AKgnsbtti_XzDRUj8UQA070yD4HsFYGWI5l13l92X9_49kVYnLBKFB4aJ_nccAO29gqYqzWJO6GdJnZVGKVgKED4OUN6Y2wqoU2tZSs1zMix9Lo7oxUOhpTgDV64TJEPUoE8XvVzA0Zm] Web login required.',
  'A1 NO [ALERT] Please log in via your web browser: https://support.google.com/mail/accounts/answer/78754 (Failure)',
   ''
  ].join(CRLF),
];
const EXPECTED = [
  'A0 CAPABILITY',
  'A1 LOGIN "foo" "bar"',
];

let exp = -1,
    res = -1,
    sentCont = false;

const srv = net.createServer(function(sock) {
  sock.write('* OK asdf\r\n');
  let buf = '', lines;

  sock.on('error', function(err) {
    console.log('Got error: ', err);
  });

  sock.on('data', function(data) {
    // console.log('Got data from IMAP Client:', data.toString());
    buf += data.toString('utf8');
    if (buf.indexOf(CRLF) > -1) {
      lines = buf.split(CRLF);
      buf = lines.pop();
      lines.forEach(function(l) {
        assert(l === EXPECTED[++exp], 'Unexpected client request: ' + l);
        assert(RESPONSES[++res], 'No response for client request: ' + l);
        // console.log('IMAP Server Returned: ', RESPONSES[res]);
        sock.write(RESPONSES[res]);
      });
    }
  });
});

srv.addListener('error', (err) => {
  console.log('Got error', err);
})

srv.listen(0, '127.0.0.1', function() {
  var port = srv.address().port;

  try {
    const imap = new Imap({
      user: 'foo',
      password: 'bar',
      host: '127.0.0.1',
      port: port,
      keepalive: true
    });

    imap.on('error', function(err) {
      // console.log('Got error', err);
      imap.end();
      srv.close();
    })

    imap.on('ready', function() {
      srv.close();
      console.log('On Ready');
    });
  
    imap.on('webalert', (text) => {
      // console.log('Got WebAlert: ', text);
      result = text;
    })

    imap.connect();
  } catch (e) {
    console.log('Got Error: ', e);
  }
})


process.once('exit', function() {
  // console.log('Result', {result, body, bodyInfo});
  assert.deepEqual(result, {
    message: 'Web login required.',
    url: 'https://accounts.google.com/signin/continue?sarp=1&scc=1&plt=AKgnsbtti_XzDRUj8UQA070yD4HsFYGWI5l13l92X9_49kVYnLBKFB4aJ_nccAO29gqYqzWJO6GdJnZVGKVgKED4OUN6Y2wqoU2tZSs1zMix9Lo7oxUOhpTgDV64TJEPUoE8XvVzA0Zm'
  });
  // assert.equal(body, 'IMAP is terrible');
  // assert.deepEqual(bodyInfo, {
  //   seqno: 1,
  //   which: 'TEXT',
  //   size: 16
  // });
});