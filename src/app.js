const { SES } = require('aws-sdk')
const axios = require('axios')
const ses = new SES({ region: 'ap-southeast-2' })

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

exports.lambdaHandler = async (event, context) => {
  const { data } = await axios('https://type.fit/api/quotes')
  const quote = data[getRandomInt(0, 1500)]
  const params = {
    Destination: {
      ToAddresses: ['rohinchopra1212@gmail.com']
    },
    Message: {
      Body: {
        Text: { Data: `${quote.text}\n\t-${quote.author}` }
      },

      Subject: { Data: 'Your daily inspiration' }
    },
    Source: 'rohinpython@gmail.com'
  }

  return ses.sendEmail(params).promise()
}
