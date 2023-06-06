const express = require('express')
const config = require('config')
const cors = require('cors')
const path = require('path')
const webPush = require('web-push')

const PORT = process.env.PORT || config.get('port') || 80
const VAPID_PUBLIC_KEY = config.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = config.get('VAPID_PRIVATE_KEY');
const PUSH_HOSTNAME = config.get('PUSH_HOSTNAME');

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}

webPush.setVapidDetails(
  PUSH_HOSTNAME,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.static(path.resolve(__dirname, 'static')))

app.get('/', (req, res) => {
  res.status(200).json({message: 'Hi!'})
})

app.get('/vapidPublicKey', (req, res) => {
  res.status(200).json({message: VAPID_PUBLIC_KEY})
})

app.post('/registerPush', (req, res) => {
  res.status(201);
})

app.post('/sendPush', (req, res) => {
  const subscription = req.body.subscription;
  const payload = req.body.payload;
  const options = {
    TTL: req.body.ttl,
  };

  setTimeout(function () {
    webPush
      .sendNotification(subscription, payload, options)
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        console.log(error);
        res.sendStatus(500);
      });
  }, req.body.delay * 1000);
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))