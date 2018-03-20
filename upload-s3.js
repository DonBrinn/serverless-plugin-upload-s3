'use strict';

const fs = require('fs');

class UploadFiles {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = serverless.getProvider('aws');
    this.region = this.serverless.service.provider.region;

    this.hooks = {
      'deploy:deploy': () => this.uploadFiles()
    };
  }

  uploadFiles() {
    if(this.options.noDeploy) {
       return;
    }
    if(!this.serverless.service.custom.filesToUpload) {
      console.log('No files to upload...');
      return;
    }
    return Promise.all(this.serverless.service.custom.filesToUpload.map(file => {
      console.log(`Uploading ${file.localPath} to ${file.s3Bucket}/${file.fileName}`);
      return this.provider.request('S3', 'upload', {
        Bucket: file.s3Bucket,
        Key: file.fileName,
        Body: fs.createReadStream(file.localPath)
      }, this.options.stage, this.region);
    }));
  }

}

module.exports = UploadFiles;
