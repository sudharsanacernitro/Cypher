import sys
import csv
import json
user=[]
user1=[]
a=len(sys.argv)
'''with open('user.csv','w') as f:
    pass
f.close()'''
with open('user.csv','a',newline='') as f:
    writer=csv.writer(f)
    for i in sys.argv[1:]:
        user.append(i)
        writer.writerow(user)
with open('user.csv','r',newline='') as f:
    reader=csv.reader(f)
    for row in reader:
        user1.append(row[0])
json_list = json.dumps(user1)
print(json_list)
