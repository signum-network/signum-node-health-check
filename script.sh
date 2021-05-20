#!/bin/bash
echo "$1" | mail -s "Signum Health Check Failure" development@signum.network
