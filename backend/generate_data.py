"""
Generate synthetic mental health dataset for model training.
Uses publicly available mental health text and creates a balanced dataset.
"""

import json
from pathlib import Path

# Synthetic mental health texts for training
# These are representative of patterns found in mental health forums and assessments
MENTAL_HEALTH_TEXTS = {
    'low': [
        "I'm feeling good today. Had a great day at work and spent time with friends.",
        "My mood is stable. I'm managing my daily tasks well and feeling accomplished.",
        "Life is going well. I'm enjoying my hobbies and feeling connected to people I care about.",
        "I feel motivated and energized. My work is going well and I'm taking care of myself.",
        "Things are looking up. I've been exercising regularly and sleeping well.",
        "I'm in a good place mentally. My relationships are healthy and I feel supported.",
        "Feeling optimistic about the future. I'm making progress on my goals.",
        "I'm doing well. My stress levels are manageable and I'm coping effectively.",
        "Life feels balanced. I'm able to enjoy activities and maintain my responsibilities.",
        "I feel positive and hopeful. My mental health is stable and I'm growing.",
        "Everything feels manageable. I'm handling challenges with confidence.",
        "I'm feeling peaceful and content. My daily routine is working well for me.",
        "My mood has been great. I'm productive and enjoying life.",
        "I feel mentally strong. I'm able to handle stress effectively.",
        "Life is good right now. I feel connected and supported by those around me.",
    ],
    'moderate': [
        "I've been feeling stressed lately. Work has been overwhelming but I'm trying to manage.",
        "Some days are harder than others. I'm experiencing mood fluctuations.",
        "I feel anxious sometimes. It's affecting my sleep and concentration.",
        "My confidence is wavering. I'm second-guessing myself at work.",
        "I've been withdrawn from friends. It's hard to reach out when I'm feeling down.",
        "I'm struggling with motivation. Getting out of bed feels difficult some days.",
        "My thoughts are racing. I can't seem to quiet my mind.",
        "I feel overwhelmed by responsibilities. I'm struggling to keep up.",
        "My mood is low. Things that usually interest me don't feel engaging.",
        "I'm experiencing mild depression. Some days are better than others.",
        "I feel restless and irritable. Small things are setting me off.",
        "I've been isolating myself. Social interaction feels exhausting.",
        "My anxiety has been increasing. I worry about things constantly.",
        "I feel stuck. I don't see a clear path forward right now.",
        "I'm struggling with self-doubt. My inner critic is very loud.",
    ],
    'high': [
        "I can't handle this anymore. Everything feels hopeless and unbearable.",
        "I'm having thoughts of harming myself. The pain is too much.",
        "I feel completely broken. I don't see any reason to keep going.",
        "I'm in constant emotional pain. I don't know how much longer I can survive this.",
        "I feel utterly alone. No one understands what I'm going through.",
        "I'm having panic attacks regularly. I can't function anymore.",
        "My depression has consumed me. I can't get out of bed for days.",
        "I'm losing control. My mind is spiraling and I can't stop it.",
        "I feel like a burden to everyone. It would be better if I wasn't here.",
        "I can't cope with this reality anymore. The pain is unbearable.",
        "I'm experiencing suicidal thoughts. I'm seriously considering it.",
        "Everything feels dark and hopeless. I don't see a future for myself.",
        "I'm having a mental breakdown. I can't manage basic self-care.",
        "The emptiness inside is consuming me. I feel numb and hollow.",
        "I'm hearing voices in my head. Reality feels uncertain and scary.",
    ],
}

def generate_dataset(output_file='training_data.json'):
    """Generate balanced training dataset."""
    dataset = []
    
    for risk_level, texts in MENTAL_HEALTH_TEXTS.items():
        for text in texts:
            dataset.append({
                'text': text,
                'label': risk_level
            })
    
    # Save to file
    output_path = Path(__file__).parent / output_file
    with open(output_path, 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print(f"Generated {len(dataset)} training samples")
    print(f"Dataset saved to {output_path}")
    print(f"Distribution: {sum(1 for d in dataset if d['label'] == 'low')} low, "
          f"{sum(1 for d in dataset if d['label'] == 'moderate')} moderate, "
          f"{sum(1 for d in dataset if d['label'] == 'high')} high")
    
    return dataset

if __name__ == '__main__':
    generate_dataset()
