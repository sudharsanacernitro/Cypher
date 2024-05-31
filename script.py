#!/home/sudharsan/myenv/bin/python3
from pymongo import MongoClient 
import sys
import csv
import json
from cryptography.fernet import Fernet
user = []
user1 = []
x = 0
a = sys.argv[1:]
key=None
#print(a)
def db(a1):
    client = MongoClient("localhost",27017)
    db = client.users
    collection = db.mycollection
    #document_to_insert = {"name": "John", "age": 30, "city": "New York"}
    collection.insert_one(a1)
    #collection.delete_many({"name":"john"})
    documents = collection.find()
    for document in documents:
        user1.append(decrypt(document))
    client.close()

def pass_key():
    with open('passkey.text', 'rb') as f:  
        reader = f.read().replace(b'\n', b'') 
        #print(reader)
        key=reader
    return key
    
def encrypt(a1):
    data = a1.encode('utf-8')
    encrypted_data = cipher.encrypt(data)

    #print("Encrypted data:", encrypted_data)
    return encrypted_data

def decrypt(a1):
    decrypted_data = cipher.decrypt(a1['name'])
    return(decrypted_data.decode())
    #user1.append(decrypted_data.decode())
    #json_list = json.dumps(user1)

#print(json_list)
cipher = Fernet(pass_key())

x1=encrypt(a[0])
#x2=encrypt(a[1])
#db({"name":x1,"email":x2})
db({"name":x1})
json_list = json.dumps(user1)
print(json_list)




'''
if(x==0):        
    with open('user.csv','a',newline='') as fp:
        writer=csv.writer(fp)
        for i in sys.argv[1:]:
            user.append(i)
            writer.writerow(user)
    with open('user.csv','r',newline='') as f:
        reader=csv.reader(f)
        for row in reader:
            user1.append(row[0])
    json_list = json.dumps(user1)
    print(json_list)'''
