const express    = require('express'),
      bodyParser = require('body-parser'),
      ejs        = require('ejs'),
      socketio   = require('socket.io'),
      Vonage     = require('@vonage/server-sdk'),
      app        = express();

const vonage = new Vonage({
    apiKey: 'yourApiKey',
    apiSecret: 'yourSecretKey'
}, { debug: true });

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    const number = req.body.number;
    const text = req.body.text;
    const from = 'fromNumber';

    vonage.message.sendSms(from, number, text, { type: 'unicode' }, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            console.dir(responseData);
            const data = {
                id: responseData.messages[0]['message-id'],
                number: responseData.messages[0]['to']
            }

            io.emit('smsStatus', data);
        }
    });    
});

const PORT = 3000;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    });
});