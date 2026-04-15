"""
Train the mental health classification model.
Uses TF-IDF vectorization and Logistic Regression.
"""

import json
import pickle
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
)


def load_data(data_file='training_data.json'):
    """Load training data."""
    data_path = Path(__file__).parent / data_file
    with open(data_path, 'r') as f:
        data = json.load(f)
    return data


def train_model(data_file='training_data.json', model_dir='models'):
    """Train and save the model and vectorizer."""
    # Load data
    data = load_data(data_file)
    texts = [item['text'] for item in data]
    labels = [item['label'] for item in data]
    
    # Create model directory
    model_path = Path(__file__).parent / model_dir
    model_path.mkdir(exist_ok=True)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    print(f"Class distribution in training: {dict((label, y_train.count(label)) for label in set(y_train))}")
    
    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(
        max_features=500,
        min_df=1,
        max_df=0.9,
        ngram_range=(1, 2),
        stop_words='english',
        lowercase=True,
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    print(f"Feature matrix shape: {X_train_vec.shape}")
    
    # Train Logistic Regression model
    model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight='balanced',  # Handle class imbalance
        solver='lbfgs',
    )
    
    model.fit(X_train_vec, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nAccuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Save model and vectorizer
    model_file = model_path / 'model.pkl'
    vectorizer_file = model_path / 'vectorizer.pkl'
    
    with open(model_file, 'wb') as f:
        pickle.dump(model, f)
    
    with open(vectorizer_file, 'wb') as f:
        pickle.dump(vectorizer, f)
    
    print(f"\nModel saved to {model_file}")
    print(f"Vectorizer saved to {vectorizer_file}")
    
    return model, vectorizer


if __name__ == '__main__':
    train_model()
