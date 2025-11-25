#!/bin/bash
# install_pqc.sh
# Automated installer for liboqs + openssl-oqs + Node.js on Raspberry Pi OS
# Tested on Raspberry Pi OS (Debian 12, arm64)

set -e

echo "==============================="
echo "  PQC INSTALLER FOR RASPBERRY PI"
echo "==============================="

sleep 1

############################################
# Update system
############################################
echo "[1/7] Updating system..."
sudo apt update && sudo apt upgrade -y

############################################
# Install dependencies
############################################
echo "[2/7] Installing dependencies..."
sudo apt install -y \
  build-essential \
  cmake \
  ninja-build \
  git \
  pkg-config \
  python3 \
  python3-pip \
  libssl-dev

############################################
# Install Node.js (LTS)
############################################
echo "[3/7] Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version:  $(npm -v)"

############################################
# Build liboqs
############################################
echo "[4/7] Cloning + building liboqs..."
cd ~
rm -rf liboqs

git clone --depth 1 https://github.com/open-quantum-safe/liboqs.git
cd liboqs
mkdir build && cd build
cmake -GNinja .. -DOQS_USE_OPENSSL=OFF -DCMAKE_INSTALL_PREFIX=/usr/local
ninja
sudo ninja install

############################################
# Build openssl-oqs
############################################
echo "[5/7] Building openssl-oqs (this may take ~20 mins)..."
cd ~
rm -rf oqs-openssl

git clone --depth 1 https://github.com/open-quantum-safe/oqs-openssl.git
cd oqs-openssl

git submodule update --init

./Configure linux-aarch64 -lm --prefix=/usr/local/oqs-openssl
make -j4
sudo make install

############################################
# Create symlink for oqs-openssl
############################################
echo "[6/7] Linking oqs-openssl binaries..."
sudo ln -sf /usr/local/oqs-openssl/bin/openssl /usr/local/bin/oqs-openssl

echo "oqs-openssl version:"
/usr/local/bin/oqs-openssl version

############################################
# Cleanup + confirmation
############################################
echo "[7/7] Installation completed successfully!"
echo "----------------------------------------"
echo "Installed:"
echo "  ✔ liboqs"
echo "  ✔ oqs-openssl (via /usr/local/bin/oqs-openssl)"
echo "  ✔ Node.js + npm"
echo "----------------------------------------"
echo "You can now run your PQC benchmarks with:"
echo "  node run-all.js"
echo "----------------------------------------"
