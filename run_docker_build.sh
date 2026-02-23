#!/bin/bash
CURRENT_UID=$(id -u) CURRENT_GID=$(id -g) docker compose up builder
