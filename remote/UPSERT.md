# Upserting Data to DynamoDB
The goal of these scripts are to take a JSON and upload it to our DynamoDB database for frontend's eventual use. As long as Remote has a script that turns binaries into a JSON with the correct schema, this will upload data. 

## Dependencies
Here's what you need to install to get this to work. 
- Python3
- AWS CLI

For AWS CLI config, get the access keys from me (Erin Park) on slack. We want to use AWS CLI so we don't publish our access keys on the internet, which would  be bad security practice. 

Then configure it by running these in command line. 
```
aws configure
AWS Access Key ID: [access key]
```
```
AWS Secret Access Key: [secret access key]
Default region name: us-east-2
Default output format: json
```
Cool. You can now run postjson.py if you wanted to. Please don't before talking to me about it/what you want to test. I am terminally online so just slack me. 


