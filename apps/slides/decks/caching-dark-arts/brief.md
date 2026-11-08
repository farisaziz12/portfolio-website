# Caching, payloads, and other dark arts

Current click count: 109 slides / 170 states. Two-click matching-key comparison at
route 93. Demo 3 is 94/95, recap 96, router flip 97, streaming 98. Repeated
prerender illustration removed. Duplicate initial-window takeaway
(source 61) removed; a dedicated CDN example follows the 14 KB slide instead.
Matching-key comparison uses illustrative server/client excerpts.

Status: full migration drafted on 2026-10-08; now 108 slides after the approved cuts (including Query introduction sources 98/99), consolidated client recap (sources 51–56), two-step BFF code morph (75–76), post-Demo-2 BFF recap (77–79 and 83), Query recap (102/104/105), and post-Demo-3 prefetch recap (110–112). Query code also has a before/after morph. Routes 96–97 add conceptual App Router streaming and partial prerendering, not changes to the recorded demo.

- Audience: frontend engineers familiar with React, requests and asynchronous UI.
- Duration: preserve the rapid pacing after the approved cuts; no new duration target. Rehearsal timing remains pending.
- Outcome: explain client fetching, payload shaping through a BFF, caching, and server prefetching under poor network conditions.
- Required demos: all three original embedded MP4 recordings, local playback with controls and static PDF posters.
- Source: supplied Keynote and matching PDF. Absolute paths and limitations are in sources.md.
- Constraints: approved Faris theme, editable text/code/diagrams, offline local assets, no artwork generation, no Remotion, no deployment.

The user's later full-deck request supersedes the representative checkpoint.
All retained source pages are mapped in order, including topic-labeled demo intros
49/81/113. Videos occupy the entire canvas without captions or footers,
preserving original aspect ratios. Important text keeps source-inspired color
emphasis. Smooth, short transitions and gentle entrances add no extra clicks or
forced waits, respect reduced motion and become static in export. Stop for
end-to-end feedback before refinements. Do not change the payments deck.

The narrated client-side flow is one route with twelve click states. Follow
Faris's supplied 5,000-record / 1,000-per-request scenario and explanation order.
Highlight each success-path part, the conditional Effect/state refetch bug, then
failure, ALL versus ONLY FAILED retry options, and continued loading. Finish
with the complete diagram. Keep native forward/backward controls and notes.

The user subsequently requested cumulative animated diagrams across all four
versions. BFF, Query and prefetch begin on the preceding complete architecture,
then reveal only new or changed responsibilities (5, 4 and 5 clicks). Keep
existing anchors and use bounded connector draws; move the mapping node when
its ownership changes. No change to the 122-slide sequence or existing media.

The user then approved all six explanatory motion ideas: latency, throughput,
payload shaping, parallel requests/retries, cache paths and prefetch timing.
Use the existing source positions with native click steps. Keep measured mobile
operator medians distinct from local/WAN examples and poor-network assumptions.
No avatar work, new animation library or whole-deck restyling is authorized.
