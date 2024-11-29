import json
import urllib.parse
import boto3
import os
import subprocess

print('Loading function')

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Extract bucket name and key from S3 event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    parts = key.split('/')
    if len(parts) < 3:
        raise ValueError("Invalid S3 key structure. Expected format is 'uuid/extension/resolution/filename'")

    download_tmp_path = f'/tmp/{os.path.basename(key)}'
    target_file_extension = parts[1]
    target_file_resolution = parts[2]
    output_path = f'/tmp/output.{target_file_extension}'
    dest_bucket = os.getenv('DESTINATION_BUCKET', None)

    print(f"Bucket name {bucket}")
    print(f"Key {key}")
    print(f"Destination bucket {dest_bucket}")

    if not dest_bucket:
        raise Error("Destination bucket not defined, please add variable")

    try:
        # check if object exists
        response = s3.get_object(Bucket=bucket, Key=key)
        
        # print http code for get request object
        print(f"HTTP response from getObject {response['ResponseMetadata']['HTTPStatusCode']}")

        # download the video file from s3 to download_tmp_path
        s3.download_file(bucket, key, download_tmp_path)

        # try ffmpeg video conversion
        try:
            convert_video(target_file_resolution, target_file_extension, download_tmp_path, output_path)
        except Exception as e:
            print('Unable to convert video file using ffmpeg')
            print(e)
            return

        # if conversion succeeds, upload the file to target bucket
        s3.upload_file(output_path, dest_bucket, os.path.splitext(key)[0] + "." + target_file_extension)
        print("Converted file uploaded successfully")
        return
    except Exception as e:
        print('Error executing Lambda')
        print(e)
        raise e


def convert_video(tgt_res, target_format, input_file_path, output_file_path):
    #ffmpeg tgt res command
    resolution = f"scale=-2:{tgt_res}"

    #codec command
    if target_format == "mp4":
        codec = ["-c:v", "libx264", "-preset", "slow", "-crf", "23", "-c:a", "aac"]
        file_extension = "mp4"
    elif target_format == "mkv":
        codec = ["-c:v", "libx264", "-preset", "slow", "-crf", "23", "-c:a", "aac"]
        file_extension = "mkv"
    elif target_format == "webm":
        codec = ["-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-b:a" ,"128k", "-c:a", "libopus"]
        file_extension = "webm"
    else:
        raise ValueError("Unsupported target format")


    try:
        # start the subprocess from the lambda layer
        subprocess.run([
            "/opt/bin/ffmpeg", "-y", "-i", input_file_path,
            "-vf", resolution,
            *codec,
            output_file_path
        ], check=True)
    except subprocess.CalledProcessError as e:
        print('FFmpeg conversion failed')
        print(f"Return code: {e.returncode}")
        print(f"Error output: {e.output}")
        raise e  