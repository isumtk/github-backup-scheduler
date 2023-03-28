# Getting Started

# cd inside the github-backup-scheduler :

RUN ```docker build -t github-backup-scheduler .``` 
to build the docker image 
Once the build is finished.

RUN ```docker run -p 3000:3000 github-backup-scheduler```

This should start the docker image at http://localhost:3000
