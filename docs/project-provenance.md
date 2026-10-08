# Project content provenance

Updated for the owner's planetary-portfolio brief, 8 October 2026.

## Displayed development records

| Record | Basis | Published scope |
| --- | --- | --- |
| 9e9App | Owner explicitly selected it as development work. Repository-name and source-text searches found no matching implementation in the connected account. | Project name and a minimal development description; no invented feature set, tech stack, date, deployment, or source link. |
| NextCard — Payment | Owner explicitly selected it and identified its payment focus. No matching repository or source text was found. | Name, payment category, and development involvement; no claim of card issuance, licensed services, settlement, or a live product. |
| NodePay | Owner explicitly selected it as development work. An older portfolio asset mentions the name, but that does not establish the identity of a company or a specific role. | Minimal owner-supplied development record; no external company URL, logo, network-size claims, token claims, founding claim, or invented feature set. |
| NextFly | Owner-confirmed NexOne → NextFly project; actual README and public configuration inspected. | Market-intelligence interface with price/liquidity/activity. Public domain is owner-supplied. Private source remains private. |

The three records without identified source are not represented as independently verified shipped products. `kind: development` identifies the owner's stated involvement; `status: Development` does not promise current availability. Placement under Robinhood / Ethereum follows the owner's requested grouping rather than a claim that a particular contract is deployed.

NextFly's `Development record · Sep 2026` comes from confirmed repository activity, including commit `c6274e5b51b2c7839d5d3f4a527ed88a63f19a30` dated 27 September 2026. It is not a founding date or launch date. No other project date is fabricated.

## Research scope

- Inspected the actual production portfolio and its shared data before revising content.
- Checked both available repository pages in the connected KiZakiXD account. The connector's offset 1 returned the later page; offset 100 returned empty despite its documented offset semantics.
- Checked repository-name lookups and source-text searches for 9e9App, NextCard, and NodePay.
- Kept existing NextFly evidence from its README and public configuration; did not copy private implementation code, credentials, deployment administration URLs, or private repository URLs into the portfolio.
- Did not turn `BaseAPI` into a Base-chain project: its inspected source is an Express API starter, and its name does not establish a blockchain connection.
- Repositories with ambiguous trading-related names were not assigned to an ecosystem without confirming evidence.

## Explicit ideas

At the owner's request, Base and Solana include a small set of new portfolio concepts:

| Ecosystem | Working title | Proposed direction |
| --- | --- | --- |
| Base | Stillledger | Readable payment receipts for independent work |
| Base | Threadwake | Wallet-event notifications |
| Solana | Tidefolio | Wallet activity journal |
| Solana | Softmint Studio | Creator payment page |

These are working titles, not references to existing products. Each record has `kind: concept`, `status: Concept`, an explicit concept description, and no dates, launch claims, customer claims, source links, or deployed contract addresses. UI should keep the Concept label visible.

## Shared data contract

`data/projects.ts` remains the single project-content source. Existing fields are preserved for compatibility; `system`, `kind`, and `shortTag` support the orbital interface, and optional `date` includes its own precise label. `description` is derived from `summary` so the overview and detail interfaces cannot drift into separate copy.
