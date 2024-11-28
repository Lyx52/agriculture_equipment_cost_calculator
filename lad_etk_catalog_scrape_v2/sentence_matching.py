# coding: utf-8

# ## IPython Notebook for [Bommarito Consulting](http://bommaritollc.com/) Blog Post
# 
# ### **Link**: [Fuzzy sentence matching in Python](http://bommaritollc.com/2014/06/fuzzy-match-sentences-in-python): http://bommaritollc.com/2014/06/fuzzy-match-sentences-in-python
# 
# **Author**: [Michael J. Bommarito II](https://www.linkedin.com/in/bommarito/)

# In[159]:

# Imports
import difflib
import nltk


# In[160]:
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger_eng')
target_sentence = "MUTLI 4120"
sentences = [
                "4120 Multi",
                "4130 Multi",
                "4120 Profi CVT"
            ]


# # ## Example 1 - Exact Match

# # In[161]:

# def is_exact_match(a, b):
#     """Check if a and b are matches."""
#     return (a == b)

# for sentence in sentences:
#     print(is_exact_match(target_sentence, sentence), sentence)


# # ## Example 2 - Exact Case-Insensitive Token Match after Stopwording

# # In[162]:

# # Imports
# import nltk.corpus
# import nltk.tokenize.punkt
# import string

# # Get default English stopwords and extend with punctuation
# stopwords = nltk.corpus.stopwords.words('english')
# stopwords.extend(string.punctuation)

# # Create tokenizer
# tokenizer = nltk.tokenize.PunktSentenceTokenizer()

# def is_ci_token_stopword_match(a, b):
#     """Check if a and b are matches."""
#     tokens_a = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(a)                     if token.lower().strip(string.punctuation) not in stopwords]
#     tokens_b = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(b)                     if token.lower().strip(string.punctuation) not in stopwords]

#     return (tokens_a == tokens_b)

# for sentence in sentences:
#     print(is_ci_token_stopword_match(target_sentence, sentence), sentence)


# # ## Example 3 - Exact Token Match after Stopwording and Stemming

# # In[163]:

# # Imports
# import nltk.corpus
# import nltk.tokenize.punkt
# import nltk.stem.snowball
# import string

# # Get default English stopwords and extend with punctuation
# stopwords = nltk.corpus.stopwords.words('english')
# stopwords.extend(string.punctuation)

# # Create tokenizer and stemmer
# tokenizer = nltk.tokenize.PunktSentenceTokenizer()
# stemmer = nltk.stem.snowball.SnowballStemmer('english')

# def is_ci_token_stopword_stem_match(a, b):
#     """Check if a and b are matches."""
#     tokens_a = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(a)                     if token.lower().strip(string.punctuation) not in stopwords]
#     tokens_b = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(b)                     if token.lower().strip(string.punctuation) not in stopwords]
#     stems_a = [stemmer.stem(token) for token in tokens_a if len(token) > 0]
#     stems_b = [stemmer.stem(token) for token in tokens_b if len(token) > 0]

#     return (stems_a == stems_b)

# for sentence in sentences:
#     print(is_ci_token_stopword_stem_match(target_sentence, sentence), sentence)


# # ## Example 4 - Exact Token Match after Stopwording and Lemmatizing

# # In[164]:

# # Imports
# import nltk.corpus
# import nltk.tokenize.punkt
# import nltk.stem.snowball
# import string

# # Get default English stopwords and extend with punctuation
# stopwords = nltk.corpus.stopwords.words('english')
# stopwords.extend(string.punctuation)

# # Create tokenizer and stemmer
# tokenizer = nltk.tokenize.PunktSentenceTokenizer()
# lemmatizer = nltk.stem.WordNetLemmatizer()

# def is_ci_token_stopword_lemma_match(a, b):
#     """Check if a and b are matches."""
#     tokens_a = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(a)                     if token.lower().strip(string.punctuation) not in stopwords]
#     tokens_b = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(b)                     if token.lower().strip(string.punctuation) not in stopwords]
#     stems_a = [lemmatizer.lemmatize(token) for token in tokens_a if len(token) > 0]
#     stems_b = [lemmatizer.lemmatize(token) for token in tokens_b if len(token) > 0]

#     return (stems_a == stems_b)

# for sentence in sentences:
#     print(is_ci_token_stopword_lemma_match(target_sentence, sentence), sentence)


# ## Example 5 - Partial Sequence Match after Stopwording and Lemmatizing

# In[166]:

# Imports
import nltk.corpus
import nltk.tokenize.punkt
import nltk.stem.snowball
import string

# Get default English stopwords and extend with punctuation
stopwords = nltk.corpus.stopwords.words('english')
stopwords.extend(string.punctuation)

# Create tokenizer and stemmer
tokenizer = nltk.tokenize.PunktSentenceTokenizer()
lemmatizer = nltk.stem.WordNetLemmatizer()

def is_ci_partial_seq_token_stopword_lemma_match(a, b):
    """Check if a and b are matches."""
    tokens_a = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(a)                     if token.lower().strip(string.punctuation) not in stopwords]
    tokens_b = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(b)                     if token.lower().strip(string.punctuation) not in stopwords]
    stems_a = [lemmatizer.lemmatize(token) for token in tokens_a if len(token) > 0]
    stems_b = [lemmatizer.lemmatize(token) for token in tokens_b if len(token) > 0]

    # Create sequence matcher
    s = difflib.SequenceMatcher(None, stems_a, stems_b)
    return (s.ratio() > 0.66)

for sentence in sentences:
    print(is_ci_partial_seq_token_stopword_lemma_match(target_sentence, sentence), sentence)


# # ## Example 6 - Partial Set Match after Stopwording and Lemmatizing

# # In[167]:

# # Imports
# import nltk.corpus
# import nltk.tokenize.punkt
# import nltk.stem.snowball
# import string

# # Get default English stopwords and extend with punctuation
# stopwords = nltk.corpus.stopwords.words('english')
# stopwords.extend(string.punctuation)

# # Create tokenizer and stemmer
# tokenizer = nltk.tokenize.PunktSentenceTokenizer()
# lemmatizer = nltk.stem.WordNetLemmatizer()

# def is_ci_partial_set_token_stopword_lemma_match(a, b):
#     """Check if a and b are matches."""
#     tokens_a = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(a)                     if token.lower().strip(string.punctuation) not in stopwords]
#     tokens_b = [token.lower().strip(string.punctuation) for token in tokenizer.tokenize(b)                     if token.lower().strip(string.punctuation) not in stopwords]
#     stems_a = [lemmatizer.lemmatize(token) for token in tokens_a if len(token) > 0]
#     stems_b = [lemmatizer.lemmatize(token) for token in tokens_b if len(token) > 0]

#     # Calculate Jaccard similarity
#     ratio = len(set(stems_a).intersection(stems_b)) / float(len(set(stems_a).union(stems_b)))
#     return (ratio > 0.66)

# for sentence in sentences:
#     print(is_ci_partial_set_token_stopword_lemma_match(target_sentence, sentence), sentence)