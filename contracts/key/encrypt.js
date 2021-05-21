const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const data = {
  catalogItemId: "sjdfhgfhrefrf",
  printSettingsIds: "hdahdjsahdsjde",
  clientId: "ac.lopez",
}

const encrypt = (text, pkPath) => {
  return new Promise((resolve, reject) => {
    const absPkPath = path.resolve(pkPath)
    fs.readFile(absPkPath, 'utf8', (err, pk) => {
      if (err) {
        return reject(err)
      }
      const buffer = Buffer.from(JSON.stringify(text))
      const encrypted = crypto.publicEncrypt(pk, buffer)
      resolve(encrypted.toString('base64'))
    })
  })
}


encrypt(data, "public.key.pem")
  .then(str => console.log(str))
  .catch(err => console.log(err))