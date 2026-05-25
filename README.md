# Waitlist Display Screen

The customer-facing companion to the 
[Waiting-List](https://github.com/aakeohane/Waiting-List) management 
system. This application runs on a screen visible to clients, showing 
the live queue so they can see their place in line in real time.

## How It Works

As front desk staff add clients to the queue using the management 
interface, this display updates automatically — no refresh required. 
Clients waiting their turn can watch the screen to track their position 
as the queue moves.

## Features

- Live queue display powered by Google Firestore
- Automatically updates as staff add or remove entries
- Designed to run on a dedicated customer-facing screen
- Firebase integration handled via a dedicated firebase.js module

## Tech Stack

- JavaScript (vanilla)
- HTML / CSS
- Google Firebase / Firestore

## Related Repositories

This project is part of a two-part waitlist system built for a spa client:

| Repo | Purpose |
|------|---------|
| [Waiting-List](https://github.com/aakeohane/Waiting-List) | Staff-facing interface to manage and add clients to the queue |
| [screenreader-waitlist](https://github.com/aakeohane/screenreader-waitlist) | Customer-facing screen showing live queue position |

## Background

Built as a freelance client project in 2023. The goal was to give clients 
a transparent, real-time view of the queue so they could relax knowing 
exactly where they stood — no need to check in repeatedly at the front desk.
