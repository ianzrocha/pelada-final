import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())

app.get('/api/health', (req, res) => res.json({ok:true}))

app.listen(port, ()=>{
  console.log(`Server listening on http://localhost:${port}`)
})
