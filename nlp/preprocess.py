"""
preprocess.py
--------------------------
Text preprocessing utilities for complaint verification.
"""

import re
import string

from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

# ---------------------------------------
# Stop Words
# ---------------------------------------

STOP_WORDS = set(ENGLISH_STOP_WORDS)

# ---------------------------------------
# Remove URLs
# ---------------------------------------

def remove_urls(text: str) -> str:
    """
    Remove website URLs.
    """
    return re.sub(r"http\S+|www\S+|https\S+", "", text)


# ---------------------------------------
# Remove Email IDs
# ---------------------------------------

def remove_emails(text: str) -> str:
    """
    Remove email addresses.
    """
    return re.sub(r'\S+@\S+', '', text)


# ---------------------------------------
# Remove Numbers
# ---------------------------------------

def remove_numbers(text: str) -> str:
    """
    Remove digits.
    """
    return re.sub(r"\d+", "", text)


# ---------------------------------------
# Remove Punctuation
# ---------------------------------------

def remove_punctuation(text: str) -> str:
    """
    Remove punctuation characters.
    """
    return text.translate(
        str.maketrans("", "", string.punctuation)
    )


# ---------------------------------------
# Remove Extra Spaces
# ---------------------------------------

def remove_extra_spaces(text: str) -> str:
    """
    Replace multiple spaces with one space.
    """
    return re.sub(r"\s+", " ", text).strip()


# ---------------------------------------
# Lowercase
# ---------------------------------------

def lowercase(text: str) -> str:
    """
    Convert text to lowercase.
    """
    return text.lower()


# ---------------------------------------
# Tokenization
# ---------------------------------------

def tokenize(text: str):
    """
    Split sentence into words.
    """
    return text.split()


# ---------------------------------------
# Stop Word Removal
# ---------------------------------------

def remove_stopwords(tokens):
    """
    Remove common English stop words.
    """
    return [
        word
        for word in tokens
        if word not in STOP_WORDS
    ]


# ---------------------------------------
# Rejoin Tokens
# ---------------------------------------

def detokenize(tokens):
    """
    Join words into a sentence.
    """
    return " ".join(tokens)


# ---------------------------------------
# Complete Cleaning Pipeline
# ---------------------------------------

def preprocess(text: str) -> str:

    if not isinstance(text, str):
        return ""

    text = lowercase(text)

    text = remove_urls(text)

    text = remove_emails(text)

    text = remove_numbers(text)

    text = remove_punctuation(text)

    text = remove_extra_spaces(text)

    tokens = tokenize(text)

    tokens = remove_stopwords(tokens)

    text = detokenize(tokens)

    return text


# ---------------------------------------
# Test
# ---------------------------------------

if __name__ == "__main__":

    sample = """
    Garbage is overflowing near the bus stand.
    Visit https://abc.com
    Contact test@gmail.com
    """

    print(preprocess(sample))