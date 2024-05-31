#!/home/sudharsan/myenv/bin/python3
import script as s
k=s.encrypt('ram')

print(s.decrypt({"email":k}))
