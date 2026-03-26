# African Pest Detector

## Summary

This project is a low-cost AI system for detecting agricultural pests affecting small-scale farmers in Africa, starting with Nigeria. The goal is practical rather than academic: help farmers identify crop diseases and pests quickly, provide clear and actionable advice, and make the system work on low-end phones with intermittent connectivity.

## Context

Small-scale farmers often face a simple but costly problem: pests and crop diseases are misidentified, treatments are guessed, and valuable yield is lost. Most AI systems that could help are built with stronger infrastructure assumptions than these users actually have, including stable internet, newer devices, and interfaces that assume high literacy.

This project reframes the problem as one of practical deployment. The aim is to create a mobile-first workflow that can operate in low-resource environments while still delivering useful diagnosis and recommendations.

## Challenge

Farmers often misidentify pests, apply the wrong treatment, and lose crops unnecessarily, while most AI tools assume strong connectivity, newer phones, and users comfortable with technical interfaces.

The product is defined by constraints:

- low connectivity
- low-end Android devices
- limited memory, battery, and processing power
- low literacy and potential need for local-language support
- very limited development time for the MVP

## What I Built

- Defined a mobile-first crop diagnosis workflow based on photo capture and simple advice output.
- Designed the system around lightweight image classifiers such as MobileNet or EfficientNet.
- Added a local LLM layer to translate predictions into plain-language recommendations.
- Chose React Native for a simple mobile interface with camera-based input.
- Kept the MVP intentionally narrow to prioritize a working prototype over feature sprawl.

## Discovery

The project was framed around a real agricultural problem in underserved environments: farmers need faster, clearer decisions, but available datasets, interfaces, and deployment assumptions rarely reflect African field conditions.

## Build

The technical strategy combines lightweight vision models such as MobileNet or EfficientNet with a local LLM layer that converts predictions into simple explanations and step-by-step actions for non-expert users.

## Launch

The MVP stays deliberately narrow: capture or upload an image, classify the pest or disease, map the result to a label, and return concise farmer-friendly advice without over-engineering the system.

## Body

The product concept is straightforward. A farmer takes a photo of a crop, the system detects a likely pest or disease condition, and the app returns a diagnosis, a simple explanation, and recommended actions. What makes the project meaningful is not just the classification step, but the effort to turn raw machine learning output into usable farming decisions.

The image recognition layer is built around transfer learning with lightweight models such as MobileNet or EfficientNet. These are practical choices because they are more compatible with mobile deployment, lower bandwidth usage, and edge inference than heavier alternatives. The input is a plant image and the output is a pest or disease classification label.

On top of that sits a lightweight knowledge or reasoning layer using a local LLM, potentially based on LLaMA-style open-source models. Its role is to convert prediction output into plain language explanations and short action steps. The emphasis is on clarity over technical depth. A farmer does not need an abstract model explanation. They need to know what the issue likely is and what to try next.

The initial data strategy uses PlantVillage as a starting point, while acknowledging a real weakness: it is not Africa specific. That means the system can reach MVP quickly, but long-term performance will depend on more region-specific pest imagery and localized agricultural knowledge. Localization is not a minor improvement here. It is a core requirement if the tool is meant to work in real conditions.

The frontend is designed as a React Native app because the experience needs to be mobile first, fast, and accessible. Camera input should be immediate, the interface should avoid unnecessary complexity, and the output should be easy to understand even for users with limited literacy. This opens the door to future voice output or local-language support if the project expands.

The most important design decision is scope discipline. With roughly one hour per week available for development, the MVP cannot afford complexity. There is no need initially for large backend systems, real-time pipelines, or an attempt to solve every agricultural problem at once. The essential loop is enough: photo to detection to advice.

What makes the concept strong is its constraint-driven design. It combines computer vision, local language generation, and human-centered deployment thinking in service of a real use case. The strongest opportunities are practical impact and accessibility. The hardest challenges are equally visible: dataset localization, field accuracy, and getting the tool into farmers' hands.

## Outcome

The MVP defines a realistic path to a mobile-first workflow where a farmer captures a crop image, receives a pest or disease diagnosis, and gets short, usable advice designed for low-literacy and low-connectivity conditions.

## Stack

MobileNet, EfficientNet, transfer learning, React Native, local LLMs, edge AI, agricultural computer vision, low-cost infrastructure, farmer support workflows

## Q&A

### What is this project?

It is a mobile-first AI system for helping small-scale farmers in Africa identify crop pests and diseases, starting with Nigeria, and receive clear recommendations on what to do next.

### What problem does it solve?

It addresses a practical farming problem: pests and diseases are often misidentified, which leads to incorrect treatments, unnecessary crop loss, and slower decisions in the field.

### How does the MVP work?

A farmer captures or uploads an image, a lightweight vision model classifies the likely pest or disease, and the system returns a short explanation plus simple action steps generated through a local reasoning layer.

### Why use lightweight models like MobileNet or EfficientNet?

They are better suited to low-end Android phones, edge deployment, and offline or low-bandwidth scenarios than heavier models that require more memory, power, and connectivity.

### Why include an LLM at all?

The LLM is there to turn model predictions into usable advice. The goal is not advanced reasoning for its own sake, but clearer explanations and more actionable recommendations for non-expert users.

### What are the biggest risks in the project?

The main risks are dataset localization, real-world field accuracy, and distribution. PlantVillage is a useful start, but it does not fully represent African farming conditions or region-specific pest patterns.
