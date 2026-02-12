import stringSimilarity from "./posts/string-similarity-at-scale.js";
import beyondEditDistance from "./posts/beyond-edit-distance.js";
import dataDrift from "./posts/data-drift-silent-killer.js";
import automatedCodegen from "./posts/automated-code-generation-clean-pipelines.js";
import infoContamination from "./posts/information-contamination-target-leakage.js";
import typeInference from "./posts/heuristics-type-inference-engine.js";
import interactionAnalysis from "./posts/multidimensional-interaction-analysis.js";
import denoising from "./posts/denoising-via-probability.js";
import compression from "./posts/entropy-vs-dictionary-compression.js";
import binaryProtocols from "./posts/binary-protocols-length-prefixing.js";
import monteCarlo from "./posts/estimating-pi-monte-carlo.js";

export const blogs = [
  {
    slug: "estimating-pi-monte-carlo",
    title: "Estimating Pi with Chaos: Monte Carlo as a Gateway to Probabilistic Computing",
    date: "2025-06-15",
    category: "MCPI",
    excerpt: "Using random sampling to solve deterministic problems and the importance of high-quality PRNGs.",
    content: monteCarlo,
  },
  {
    slug: "binary-protocols-length-prefixing",
    title: "Binary Protocols: Why Length-Prefixing Beats Delimiters",
    date: "2025-06-01",
    category: "TokenWise",
    excerpt: "Designing high-throughput systems by avoiding the escaping overhead of JSON and CSV.",
    content: binaryProtocols,
  },
  {
    slug: "entropy-vs-dictionary-compression",
    title: "Entropy vs. Dictionary: Navigating the Landscape of Modern Compression",
    date: "2025-05-15",
    category: "Comprexx",
    excerpt: "A comparative analysis of Huffman Coding, LZ77, and the modern Zstandard approach.",
    content: compression,
  },
  {
    slug: "denoising-via-probability",
    title: "Denoising via Probability: Leveraging the Central Limit Theorem",
    date: "2025-05-01",
    category: "Noise2Normal",
    excerpt: "How averaging N noisy samples converges to the ground truth without training a neural network.",
    content: denoising,
  },
  {
    slug: "multidimensional-interaction-analysis",
    title: "Multidimensional Interaction Analysis: Beyond Pearson's Correlation",
    date: "2025-04-15",
    category: "HashPrep",
    excerpt: "Discovering non-linear dependencies between variables using entropy-based metrics.",
    content: interactionAnalysis,
  },
  {
    slug: "heuristics-type-inference-engine",
    title: "Heuristics in the Wild: Designing an Extensible Type Inference Engine",
    date: "2025-04-01",
    category: "HashPrep",
    excerpt: "Beyond simple dtypes: how to reliably classify raw CSV data into semantic categories.",
    content: typeInference,
  },
  {
    slug: "information-contamination-target-leakage",
    title: "Information Contamination: Detecting Target Leakage in Feature Pipelines",
    date: "2025-03-15",
    category: "HashPrep",
    excerpt: "Automating the discovery of features that cheat by encoding information about the target variable.",
    content: infoContamination,
  },
  {
    slug: "automated-code-generation-clean-pipelines",
    title: "Automated Code Generation for Clean Pipelines",
    date: "2025-03-01",
    category: "HashPrep",
    excerpt: "Moving from interactive notebooks to production-ready Python modules via hashprep.codegen.",
    content: automatedCodegen,
  },
  {
    slug: "data-drift-silent-killer",
    title: "Data Drift: The Silent Killer of Production ML Models",
    date: "2025-02-15",
    category: "HashPrep",
    excerpt: "Detecting covariate shift using Kolmogorov-Smirnov and Chi-Square tests in automated pipelines.",
    content: dataDrift,
  },
  {
    slug: "beyond-edit-distance",
    title: "Beyond Edit Distance: The Math of Token-Based Similarity",
    date: "2025-02-01",
    category: "FuzzyBunny",
    excerpt: "Why Levenshtein is insufficient for multi-word search and how Token Sort and Jaccard bridge the gap.",
    content: beyondEditDistance,
  },
  {
    slug: "string-similarity-at-scale",
    title: "String Similarity at Scale: Optimizing Levenshtein in C++ for Python Runtimes",
    date: "2025-01-15",
    category: "FuzzyBunny",
    excerpt: "Moving beyond O(NM) complexity in Python by leveraging C++ SIMD and Pybind11.",
    content: stringSimilarity,
  },
];
