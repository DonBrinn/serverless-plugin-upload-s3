# serverless-plugin-upload-s3
Serverless plugin to upload files to s3.


## Usage Example

`serverless.yml`
```yaml
service: sample

plugins:
  - serverless-plugin-upload-s3

custom:
  filesToUpload:
    - fileName: foo.jar
      localPath: target/foo.jar
      s3Bucket: bucket1
    - fileName: bar-readme.md
      localPath: docs/readme.md
      s3Bucket: bucket2
```

The above example will result in `target/foo.jar` being uploaded to `s3://bucket1/foo.jar` and `docs/readme.md` uploaded to `s3://bucket2/bar-readme.md`.

## NoDeploy
If the `--noDeploy` command-line option is specified, this plugin does not attempt to upload anything to S3.