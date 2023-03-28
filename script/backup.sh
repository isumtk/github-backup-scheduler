#!/bin/sh

REPO_URL="$1"
BACKUP_FREQ="$2"

cd backup

if [ -z "$1" ]; then
  echo "ERROR: Repository URL not provided."
  exit 1
fi

git clone --quiet $REPO_URL.git || {
  echo "ERROR: Failed to clone repository."
  exit 1
}

REPO_NAME=$(basename "$REPO_URL" .git)

CURRENT_TIME=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)

sleep 1

echo "Cloned the repo successfully."

echo "Making a .zip of the repo."

zip -r -q -T -m "$REPO_NAME"_"$CURRENT_TIME".zip ./$REPO_NAME/ \
&& echo "Successfully generated .zip of the repo."

if [ ! -f "$REPO_NAME"_"$CURRENT_TIME".zip ]; then
  echo "ERROR: Failed to create backup .zip file."
  exit 1
fi

echo "Backup Successful."
echo "Backup stored in backup folder."

echo "$BACKUP_FREQ ./script/backup.sh $REPO_URL" >> /etc/crontab

echo "Created Cron Job."

exit
