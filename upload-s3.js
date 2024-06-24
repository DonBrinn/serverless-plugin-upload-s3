'use strict';

const fs = require('fs');

class UploadFiles {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = serverless.getProvider('aws');
    this.region = this.serverless.service.provider.region;

    this.commands = {
      ['s3-upload']: {
        usage: 'Upload files to S3',
        lifecycleEvents: ['s3-upload'],
        commands: {
          upload: {
            usage: 'Publish the files',
            lifecycleEvents: ['upload']
          }
        }
      }
    };

    this.hooks = {
      'deploy:deploy': () => this.uploadFiles(),
      's3-upload:upload:upload': () => this.uploadFiles(),
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
