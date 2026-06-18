/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
const fs = require('fs');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  try {
    console.log("Downloading bgm.ogg...");
    await downloadFile("https://upload.wikimedia.org/wikipedia/commons/d/df/Happy_Birthday_To_You_%28M._J._Hill%2C_P._S._Hill%29.ogg", "public/bgm.ogg");
    console.log("Downloading pop.ogg...");
    await downloadFile("https://upload.wikimedia.org/wikipedia/commons/4/4b/Pop_sound_effect.ogg", "public/pop.ogg");
    console.log("Downloads complete!");
  } catch(e) {
    console.error(e);
  }
})();
