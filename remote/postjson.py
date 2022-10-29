import boto3 # for aws sdk

# testjson = open('items.json')

# Takes in a singular session (dict) and uploads to DynamoDB table.
# Undefined behavior if duplicates occur
def UploadData():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('SampleSchemaTest')
    response = table.put_item(
        Item = {
            'ID': 1,
            'Session Name': 'Test Session2',
        }
    )
    status_code = response['ResponseMetadata']['HTTPStatusCode']
    print(status_code)

    response = table.get_item(
        Key={
            'Session Name': 'Test Session2'
        }
    )
    item = response['Item']
    print(item)

print('is it running?')
UploadData()
    



