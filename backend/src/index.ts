import express from 'express'
require('dotenv').config();
import app from './app'

const port = process.env.PORT || 5001

export default function start(){
  app.listen(port, ()=>{console.log(`SERVER LISTENING ON PORT ${port}`)});
}


start()