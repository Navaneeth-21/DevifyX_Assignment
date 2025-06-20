const archiver = require('archiver');
const fs = require('fs');

exports.createArchive = (data, outputPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(outputPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.append(JSON.stringify(data, null, 2), { name: 'user_data.json' });
    archive.finalize();
  });
};