# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers in semiconductor, photonics, and embedded engineering who arrive to evaluate Richard Medyanto for roles or internships, often scanning rather than reading. Secondary: research and academic peers checking his III-V device work and publications, and general engineering readers who read project write-ups for their technical detail. All three audiences read in English, Traditional Chinese, or Simplified Chinese.

## Product Purpose

A personal site and blog that presents Richard Medyanto's professional record and first-hand engineering work. It makes his CV, project write-ups, and publications reachable and credible to recruiters, researchers, and readers. Success means a visitor can verify who he is and what he has built without asking, and can then contact him.

## Positioning

An evidence-dense, first-person engineering record: submicron III-V device fabrication, measurement, and simulation documented with process- and result-level detail, alongside earlier embedded and IoT projects, maintained trilingually. A generic portfolio or resume site could not truthfully reproduce this depth of real fabrication and measurement work.

## Operating Context

Visitors arrive from job applications, LinkedIn/GitHub, and search; recruiters skim the CV while readers browse posts by category and tag. The CV page links out to conference DOIs, repositories, and certificates. Content is authored in Markdown in English, then translated to zh-tw and zh-cn. The site is built with Hugo (theme "custom", named Shader) and deployed by GitHub Actions to GitHub Pages.

## Capabilities and Constraints

- Hugo static site; no server-side runtime. Build output is plain static files.
- Deployed at https://richardmedyanto.github.io/ via `.github/workflows/hugo.yml`.
- Trilingual: `en` (default, no subdirectory), `zh-tw`, and `zh-cn`; every substantive page and post is expected in all three.
- Surfaces: home post list, CV (`/curriculum-vitae/`), archives, search (JSON index), category and tag taxonomies, 404.
- Posts support images, shortcodes (e.g. video), and category/tag metadata.
- No fabricated credentials, benchmarks, or testimonials may be introduced; only verifiable artifacts already on the site may be cited.

## Brand Commitments

- Name: Richard Medyanto; voice is first-person, plainspoken, technically precise, and lightly self-aware ("engineer, builder, and chronic over-thinker").
- Identity rests on the avatar and the LinkedIn, GitHub, and email links configured in `config.yaml`; there is no logo system.

## Evidence on Hand

- CV in `content/page/cv/index.md`: education, GPA, scholarships, work experience, research, skills, certificates, TOEFL score, with links to real artifacts.
- Posts in `content/post/` for each project, with translations; external proof includes the ICEEI 2023 DOI (10.1109/ICEEI59426.2023.10346650), OPTIC 2025 presentation, and linked repositories/certificates.
- Avatar at `static/img/avatar.jpg`.
- Absent and not to be fabricated: testimonials, customer logos, employment-outcome claims, performance benchmarks beyond published results.

## Product Principles

1. Evidence over adjectives: every professional claim links to a verifiable artifact — paper, repository, certificate, or measurement.
2. Recruiters lead: the CV and proof of work are reachable within one click from anywhere on the site.
3. Trilingual parity: substantive content exists in English, Traditional Chinese, and Simplified Chinese.
4. Writing is portfolio: project posts are first-class proof of engineering depth, not filler.
5. Static and fast: additions must not require a server runtime or heavy client-side dependencies.
