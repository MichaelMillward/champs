import sys

with open(sys.argv[1]) as f:
    line = f.readline() 
    while (line):
        print '+"'+line.replace('"', '').replace("\n",'')+'"'
        line = f.readline()
