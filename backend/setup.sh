#!/bin/bash

# Setup script for NeuroMind AI backend
# This script installs dependencies and trains the ML model

set -e

echo "[v0] Setting up NeuroMind AI backend..."

# Check Python version
python_version=$(python3 --version | awk '{print $2}')
echo "[v0] Python version: $python_version"

# Install dependencies using uv (recommended) or pip
if command -v uv &> /dev/null; then
    echo "[v0] Installing dependencies with uv..."
    uv pip install -e .
else
    echo "[v0] Installing dependencies with pip..."
    pip install -e .
fi

# Generate training data
echo "[v0] Generating training dataset..."
python3 generate_data.py

# Train the model
echo "[v0] Training ML model..."
python3 train_model.py

echo "[v0] Setup complete! You can now run: python3 main.py"
