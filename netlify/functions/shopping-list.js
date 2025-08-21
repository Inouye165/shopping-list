const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'shopping-list.json');

function readList(userId) {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  return data[userId] || [];
}

function writeList(userId, list) {
  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  data[userId] = list;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

exports.handler = async function(event, context) {
  const userId = event.queryStringParameters.userId;
  if (!userId) {
    return {
      statusCode: 400,
      body: 'Missing userId',
    };
  }

  if (event.httpMethod === 'GET') {
    const list = readList(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(list),
    };
  }

  if (event.httpMethod === 'POST') {
    const { list } = JSON.parse(event.body);
    writeList(userId, list);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed',
  };
};
