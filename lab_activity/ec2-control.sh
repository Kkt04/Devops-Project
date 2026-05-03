#!/bin/bash

# ===== CONFIG =====
INSTANCE_ID="i-0e5200f794f0f3b4d"

# ===== INPUT =====
ACTION=$1

if [ -z "$ACTION" ]; then
  echo "[ERROR] Usage: $0 {start|stop}"
  exit 1
fi

if [ "$ACTION" == "start" ]; then
  echo "[INFO] Requesting START for $INSTANCE_ID..."
  aws ec2 start-instances --instance-ids "i-0705b439599d746f3"

elif [ "$ACTION" == "stop" ]; then
  echo "[INFO] Requesting STOP for $INSTANCE_ID..."
  aws ec2 stop-instances --instance-ids "i-0705b439599d746f3"
fi