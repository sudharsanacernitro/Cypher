import os
command="node /home/sudharsan/projects/gui-webchat/demo.js 1"
password = "Tatakae-nitro"
sudo_command = f"echo {password} | sudo -S {command}"
os.system(sudo_command)
