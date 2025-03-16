import sys
import paramiko

def list_converter(path):
   location_path = []
   for i in path:
      if i == '1':
         location_path.append('Leeds')
      elif i == '2':
         location_path.append('Stormont-Dundas')
      elif i == '3':
         location_path.append('ResidenceCommons')
      elif i == '4':
         location_path.append('Lennox-Addington')
      elif i == '5':
         location_path.append('Prescott/Renfrew')
      elif i == '6':
         location_path.append('Frontenac')
      elif i == '7':
         location_path.append('Minto')
      elif i == '8':
         location_path.append('Nicol')
      elif i == '9':
         location_path.append('ArchitectureBldg')
   return location_path

def main():
    path = sys.argv[1:]  # Data passed from subprocess
    path = list_converter(path)
    print(f"Received path data: {path}")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('172.20.10.8',username='qnxuser',password='qnxuser', timeout=10)
    
    command = f"echo {path} > /data/home/qnxuser/homepage/Project/config.txt"
    client.exec_command(command)
    command = "cd /data/home/qnxuser/homepage/Project"
    client.exec_command(command)
    command = "chmod +x god_mode"
    client.exec_command(command)
    command = "./god_mode"
    command = ""
    client.exec_command(command)

    print(f"config updated to {path}")
    client.close()
    # Add your logic here

if __name__ == "__main__":
    main()
