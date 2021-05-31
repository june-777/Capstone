
//80번 포트에 대한 웹서버를 띄우는 서버

import express from 'express'

const app = express()

app.get('', (req, res, next) => {
  res.send(200)
})

app.listen(80, () => {
  console.log('listening...')
})
