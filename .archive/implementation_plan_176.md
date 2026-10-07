# Implementation Plan: "Media Optimization" under Backend, Web, Apps and Cloud (Azure, AWS, Google Cloud)

## Task summary

Source: GitHub issue #176
Base branch: main

Working branch: `feature/176`

Issue [#176](https://github.com/albertoirurueta/docs/issues/176) asks for documentation on **media optimization**: images in several formats with good size and quality, thumbnails, BlurHash placeholders, video transcoding for different devices, cover images from video frames, and streaming. It is written for six places in Guides & References:

| Entry | Shape chosen | Path (`modules/ROOT/pages/…`) |
|---|---|---|
| Backend Development | sub-section, 14 pages | `backend/media-optimization/` |
| Web Development | sub-section, 8 pages | `web/media-optimization/` |
| Apps | sub-section, 9 pages | `apps/media-optimization/` |
| Cloud / AWS | sub-section, 6 pages | `cloud/aws/media-optimization/` |
| Cloud / Google Cloud | single page | `cloud/google-cloud/media-optimization.adoc` |
| Cloud / Azure | single page | `cloud/azure/media-optimization.adoc` |

The issue body is the **binding spec**. Re-fetch it with `mcp__github__issue_read` (`get`, `albertoirurueta/docs`, 176) and cover every bullet in its section. It carries the library tables, the BlurHash equations, the cloud service lists with their retirement dates, the content requirements and the acceptance criteria. This plan only fixes structure, file names and ordering so that pages written in parallel stay consistent.

### Choices made on the user's behalf (challenge them in review)

1. **Section shape.** The issue says "sub-section by default, single page if short". AWS has enough material (MediaConvert, image processing, streaming and delivery, a Video on Demand pipeline) for a sub-section. Google Cloud (Transcoder API plus storage-triggered image resizing) and Azure (Media Services retired, so self-hosted FFmpeg plus Event Grid resizing) fit one page each.
2. **Concepts live in Backend; Web, Apps and Cloud link to them.** The format, BlurHash, video-encoding, streaming and cover pages are written once in `backend/media-optimization/` and linked from everywhere else, so nothing is explained twice.
3. **Bibliography placement.** Each sub-section index ends with `[[_bibliography]]` + `== Bibliography`, and its disclaimer partial links to that anchor. The two single pages carry their own bibliography at the end.
4. **Cheat sheets for the four sub-sections** (backend, web, apps, AWS): a `cheat-sheet.adoc` plus a one-page A4 PDF each. The two single pages get none.
5. **No admonitions other than the AI disclaimer.** Deprecations, retirements, licence restrictions and maintenance status go in prose and in a "Status" column of the library tables. (Plan #270 allowed `[WARNING]` blocks for deprecations. Issue #176 does not.)
6. **Tasks are untagged.** The installed `*-code-one-task` skills (`java`, `java-springboot`, `dotnet`, `database`) don't apply to AsciiDoc, SVG or PDF work, so every task is implemented directly, as in plans #270 and #253. The Java, Python, TypeScript, C#, Rust, Kotlin, Swift and FFmpeg snippets are page content, not built code.
7. **No pinned versions without a check.** The research behind the issue could not open several official sites (FFmpeg, MDN, nextjs.org, angular.dev, the AWS, Azure and Google Cloud docs, sharp, Pillow docs). Each page task says to verify versions, flags and API names against the official page before quoting them, and to state a baseline date (2026-10-07). Anything not verifiable is described without a version.
8. **Rust/axum has no existing section**, so it is a self-contained page in Backend (task 11).
9. **Cheat-sheet PDFs use this container's tooling**, as in plan #270: an A4 HTML/CSS layout in the scratchpad, rendered with headless Chromium, page count checked with `pypdf`, previewed with `pypdfium2`. Only the PDF is committed.
10. **One pass, one PR.** Everything is implemented on `feature/176` and opened as a single draft PR.

## Current code state

- Antora component `ROOT` at the repo root. Pages in `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`, figures in `modules/ROOT/images/`, PDFs in `modules/ROOT/attachments/`, disclaimers in `modules/ROOT/partials/`. Active extensions: Mermaid and MathJax (`\( \)`, `\[ \]`). `npm run validate:mermaid` is the only script.
- Conventions come from `CLAUDE.md`:
  - Image macros on one line, alt text quoted when it contains a comma, no `images/` prefix.
  - Every SVG referenced by a page.
  - Inline code containing `->`, `=>`, `...`, `'`, `{`, `*`, `~`, `^`, `__` written as `` `+…+` `` (or `pass:c[…]` when it contains `+`).
  - Mermaid stereotypes as `&lt;&lt;…&gt;&gt;`.
- Section pattern, from `cloud/aws/index.adoc` and `cloud/azure/foundry-tools/index.adoc`: title, `:description:`, `:keywords:`, `include::partial$<name>-disclaimer.adoc[]`, intro, content, `[[_bibliography]]` + `== Bibliography`. Disclaimer partials are `[IMPORTANT]` blocks saying the content was generated with AI assistance and linking to the bibliography anchor (`partials/aws-disclaimer.adoc` is the model).
- Cheat-sheet pattern: `cheat-sheet.adoc` has an intro, a bullet list of what the PDF covers, grouped back-link paragraphs, and `xref:attachment$<name>.pdf[Download …]`. Model: `cloud/azure/foundry-tools/cheat-sheet.adoc`.
- Nav: Backend and Web list sub-sections at `***`, Apps at `***`, Cloud providers at `***` with pages at `****` (`nav.adoc` lines ~748, 290, 1259, 1424).
- Existing pages to link to, not duplicate:
  - Backend: `backend/springboot/file-storage-and-object-stores.adoc`, `backend/nestjs/file-upload-and-streaming.adoc`, `backend/nestjs/events-scheduling-and-queues.adoc`, `backend/fastapi/forms-and-file-uploads.adoc`, `backend/fastapi/settings-lifespan-and-background-tasks.adoc`, `backend/quarkus/messaging.adoc`, `backend/quarkus/scheduling-and-mail.adoc`, and the `messaging`, `scheduling`, `spring-batch`, `docker` and `kubernetes` sections.
  - Web: `web/nextjs/images-fonts-and-scripts.adoc`, `web/html-css/performance-loading.adoc`, the React and Angular sections.
  - Apps: `apps/android/image-loading-coil-and-glide.adoc`, `apps/apple/camera-media-and-photos.adoc`, `apps/react-native/images-and-icons.adoc`.
  - Cloud: `cloud/aws/s3-object-storage.adoc`, `lambda*.adoc`, `cloudfront-cdn.adoc` (the AWS Bookshelf example already has an S3-triggered `thumbnailer` Lambda and a `bookshelf-uploads-<account-id>` bucket); `cloud/azure/blob-storage.adoc`, `app-service-and-functions.adoc`, `container-apps*.adoc`, `front-door-and-cdn.adoc`; `cloud/google-cloud/cloud-run*.adoc`, `cloud-storage*.adoc`, `cloud-cdn-and-media-cdn.adoc`.
- No existing pages cover BlurHash, MediaConvert, Thumbnailator or other media tooling.
- Precedents in `.archive/`: #270 (Azure Foundry Tools: sub-section, bibliography, cheat-sheet PDF recipe), #157 (Backend Scheduling), #253 (Web Next.js).

### Shared naming (all tasks use these exact names)

- Disclaimer partials, all in `modules/ROOT/partials/`:
  `media-optimization-backend-disclaimer.adoc`, `media-optimization-web-disclaimer.adoc`, `media-optimization-apps-disclaimer.adoc`, `media-optimization-aws-disclaimer.adoc`, `media-optimization-gcp-disclaimer.adoc`, `media-optimization-azure-disclaimer.adoc`.
- Figures are `modules/ROOT/images/media-<topic>.svg`. Mermaid diagrams are inline.
- Cheat-sheet PDFs:
  `media-optimization-backend-cheat-sheet.pdf`, `media-optimization-web-cheat-sheet.pdf`, `media-optimization-apps-cheat-sheet.pdf`, `media-optimization-aws-cheat-sheet.pdf`.
- Running example: reuse **Bookshelf** (book covers uploaded to `bookshelf-uploads`, a `thumbnailer`), as the AWS, Azure and Google Cloud sections already do.

## Implementation steps

### Group 1 — Shared disclaimer partials and backend concept pages (Parallelizable: yes)

All files here are new and independent. These pages define the vocabulary, equations and figures that every later page links to.

- [x] Task 1. Create the six disclaimer partials
  - [x] Task 1.1. Create the six files named above, modelled on `partials/aws-disclaimer.adoc` (same `[IMPORTANT]` block, same wording that the content was generated with AI assistance and should be verified against the official documentation). The four sub-section partials link to `xref:<section path>/media-optimization/index.adoc#_bibliography[the section bibliography]`. The two single-page partials link to the page's own `#_bibliography`.

- [x] Task 2. `backend/media-optimization/image-formats-and-encoding.adoc`
  - [x] Task 2.1. Cover JPEG, PNG, WebP, AVIF, JPEG XL and HEIC/HEIF: lossy vs. lossless, transparency, animation, browser and device support, decode cost, and why AVIF/WebP with a JPEG fallback is the default. Link the official format references (MDN image-type guide, Google WebP, the AV1 Image File Format spec, jpeg.org JPEG XL) after confirming each URL opens.
  - [x] Task 2.2. Cover quality settings and encoder trade-offs, EXIF orientation and metadata stripping (GPS), sRGB colour profiles, chroma subsampling, and HEIC as an iOS upload format to convert on ingest.
  - [x] Task 2.3. Include a comparison table with a *Status / licence* column. Add the `libvips` CLI and `cwebp`/`avifenc` examples.

- [x] Task 3. `backend/media-optimization/responsive-images-and-thumbnails.adoc`
  - [x] Task 3.1. Cover variant strategy: width breakpoints, density variants, aspect-ratio crops, `cover`/`contain` fit, smart crop, naming and storage keys (`covers/<id>/w640.avif`), eager vs. on-the-fly generation, cache headers and CDN invalidation.
  - [x] Task 3.2. Cover `srcset`, `sizes` and `<picture>` from the server's point of view (what the backend must emit so the HTML works), with links to the MDN responsive-images pages.

- [x] Task 4. `backend/media-optimization/blurhash-algorithm.adoc`
  - [x] Task 4.1. Document the algorithm from `woltapp/blurhash` `Algorithm.md` and the reference TypeScript code, using the equations in the issue: sRGB↔linear, the component equation \(C_{ij}\), the size flag, max-AC quantisation, DC packing, AC quantisation to 19 levels and packing, base83 alphabet, string length \(4 + 2 n_x n_y\), decoding and `punch`. Verify every constant against the reference source before writing it.
  - [x] Task 4.2. Add a worked example: a 2×1 or 3×2 component hash, with the numbers shown step by step. Note the reference TypeScript decoder's `punch | 1` quirk.
  - [x] Task 4.3. Add guidance: 4×3 default, adapt to aspect ratio, encode from a downscaled image, decode at 20–32 px and scale up with the UI. Compare with ThumbHash (`evanw/thumbhash`) briefly.
  - [x] Task 4.4. Add Mermaid (encode → store → API → decode) and `images/media-blurhash-layout.svg` (the string fields) plus `images/media-blurhash-basis.svg` (the cosine basis functions). Quote alt text containing commas.
  - [x] Task 4.5. List implementations with official URLs: Java `hsch/blurhash-java`, KMP `vanniktech/blurhash`, Python `woltapp/blurhash-python` and `halcy/blurhash-python`, npm `blurhash`, Rust `blurhash` crate, .NET `Blurhash.ImageSharp`/`blurhash.net` and `BlurHashSharp`, Swift and Kotlin from the woltapp repo. Confirm each from the repo README before linking.

- [x] Task 5. `backend/media-optimization/video-encoding-fundamentals.adoc`
  - [x] Task 5.1. Cover codecs (H.264, H.265, VP9, AV1), containers (MP4, WebM, fMP4/CMAF), CRF and constant-quality vs. bitrate modes, presets, two-pass, GOP and keyframe interval, audio (AAC, Opus), and licensing and patent notes where they matter.
  - [x] Task 5.2. Give the FFmpeg commands (`libx264`, `libx265`, `libsvtav1`, `libvpx-vp9`, `-movflags +faststart`), checking each flag against the FFmpeg docs and wiki.
  - [x] Task 5.3. Include a bitrate ladder table per device class, based on the Apple HLS Authoring Specification. Open the spec page and copy only values you can read there. Mark anything else as an assumption or leave it out.
  - [x] Task 5.4. Add `images/media-abr-ladder.svg` (resolution vs. bitrate per rung).

- [x] Task 6. `backend/media-optimization/video-covers-and-thumbnails.adoc`
  - [x] Task 6.1. Cover frame extraction: `-ss` before/after `-i`, `-frames:v 1`, the `thumbnail` filter, scene detection, choosing a representative frame, sprite sheets for scrubbing previews, rotation metadata, and running a BlurHash on the cover.
  - [x] Task 6.2. Show the same operations in the cloud services (links forward to the AWS, Google Cloud and Azure pages by their fixed names).

- [x] Task 7. `backend/media-optimization/video-streaming.adoc`
  - [x] Task 7.1. Cover progressive download vs. adaptive streaming, HLS, DASH and CMAF, segment length, master and media playlists, byte-range vs. segment files, CDN delivery, signed URLs and cookies, and a short DRM note. Link the HLS and DASH specs and the FFmpeg `hls`/`dash` muxer docs.
  - [x] Task 7.2. Show FFmpeg HLS and DASH commands and the Shaka Packager and Bento4 alternatives. Add Mermaid for the playlist structure and `images/media-hls-structure.svg`.

### Group 2 — Backend implementation pages (Parallelizable: yes)

Depends on Group 1 (links to the concept pages and the BlurHash figure). All files are new and independent.

- [x] Task 8. `backend/media-optimization/java-image-and-video-libraries.adoc`
  - [x] Task 8.1. Thumbnailator (recommended default), imgscalr (**unmaintained since 2012**, legacy only), TwelveMonkeys ImageIO (WebP read-only; no AVIF or HEIC), webp-imageio, Scrimage and JVips. Each has a Maven snippet and a thumbnail example. Check each library's repo for its latest release and licence.
  - [x] Task 8.2. BlurHash in Java with `blurhash-java`, encoding from a downscaled `BufferedImage`.
  - [x] Task 8.3. Video with Jaffree (Apache-2.0) and JAVE2 (**GPL-3.0**, bundled ffmpeg binaries): transcode, extract a cover, probe. Note that both need a ffmpeg install or bundle.

- [x] Task 9. `backend/media-optimization/spring-boot-and-quarkus-pipeline.adoc`
  - [x] Task 9.1. A Spring Boot media service: multipart upload or pre-signed URL, a job queue (reference the `backend/messaging` Spring pages), a worker that produces variants, BlurHash and renditions, entity fields (`blurhash`, `variants`, `status`), a status endpoint, and Spring Batch for backfills.
  - [x] Task 9.2. The same flow in Quarkus (reference `backend/quarkus/messaging.adoc` and `scheduling-and-mail.adoc`), and what changes with native images and external binaries.
  - [x] Task 9.3. Include a Mermaid sequence diagram and `images/media-upload-pipeline.svg` (shared with Task 13).

- [x] Task 10. `backend/media-optimization/python-image-and-video-libraries.adoc`
  - [x] Task 10.1. Pillow (AVIF read/write in current wheels; check the release notes for the exact version), `pillow-heif`, `pillow-avif-plugin` as a stopgap, pyvips, BlurHash with `blurhash-python`.
  - [x] Task 10.2. ffmpeg-python (**unmaintained since 2019**), MoviePy v2 (renamed methods `with_*`, `resized`, `subclipped`; `moviepy.editor` removed), and calling `subprocess` against ffmpeg directly.
  - [x] Task 10.3. A FastAPI example: upload endpoint, `BackgroundTasks` for small work and why a real queue is needed for video (link `fastapi/settings-lifespan-and-background-tasks.adoc` and `fastapi/forms-and-file-uploads.adoc`).

- [x] Task 11. `backend/media-optimization/node-and-rust-image-and-video-libraries.adoc`
  - [x] Task 11.1. Node.js: sharp (libvips; formats; thumbnails; AVIF; metadata), Jimp (pure JS, WASM plugins for WebP and AVIF), `blurhash` encode from sharp raw pixels, fluent-ffmpeg (**archived May 2025**) and spawning ffmpeg directly. A NestJS example with BullMQ (link `nestjs/events-scheduling-and-queues.adoc` and `nestjs/file-upload-and-streaming.adoc`).
  - [x] Task 11.2. Rust with axum: the `image` crate for resize and encode, the `blurhash` crate for the hash, a `tokio::process::Command` ffmpeg call, a multipart upload handler, and `tokio::task::spawn_blocking` for CPU-bound work. Link axum's docs (`docs.rs/axum`, the repo) and note that the site has no Rust section.

- [x] Task 12. `backend/media-optimization/dotnet-image-and-video-libraries.adoc`
  - [x] Task 12.1. ImageSharp (managed code; the Six Labors Split License needs a paid licence above US$1M revenue; WebP yes, no AVIF/HEIC), SkiaSharp (MIT; JPEG/PNG/WebP encode), NetVips, BlurHash with `Blurhash.ImageSharp` or `blurhash.net`.
  - [x] Task 12.2. FFMpegCore (MIT) and Xabe.FFmpeg (**non-commercial licence unless a paid one is bought**): transcode, snapshot, probe.
  - [x] Task 12.3. An ASP.NET Core minimal API upload endpoint with `BackgroundService` plus `Channel<T>`, and a queue-backed alternative.

- [x] Task 13. `backend/media-optimization/upload-pipelines-queues-and-jobs.adoc`
  - [x] Task 13.1. The reference architecture: direct-to-storage upload with a pre-signed URL, storage event or API call, queue, idempotent workers, retries with backoff, dead-letter queues, progress and status, webhooks or notifications back to clients.
  - [x] Task 13.2. Link to `backend/messaging`, `backend/scheduling`, `backend/spring-batch`, `backend/docker` and `backend/kubernetes` (Jobs) by their existing pages, and to the cloud pages of Tasks 17–19 as managed alternatives to self-hosted workers.
  - [x] Task 13.3. Add Mermaid state diagram (`uploaded → queued → processing → ready | failed`) and a Mermaid flow diagram.

- [x] Task 14. `backend/media-optimization/security-and-operations.adoc`
  - [x] Task 14.1. Validate uploads by magic bytes rather than extension, cap size and duration, decompression bombs, strip EXIF and GPS, ffmpeg sandboxing and resource limits, patching, storage layout, cost and storage lifecycle, monitoring and metrics for queues and encode time.

### Group 3 — Web and Apps pages (Parallelizable: yes)

Depends on Group 1. Web and Apps files are independent of each other.

- [x] Task 15. Web pages in `web/media-optimization/`
  - [x] Task 15.1. `native-html-images-and-lazy-loading.adoc`: `<img>` with `srcset`, `sizes`, `width`/`height` (CLS), `decoding="async"`, `<picture>` with AVIF/WebP, `loading="lazy"` (never on the LCP image), `fetchpriority`, `<video poster preload>`. Link the MDN pages and `web/html-css/performance-loading.adoc`.
  - [x] Task 15.2. `blurhash-in-the-browser.adoc`: decode with the `blurhash` package into a canvas or a data URL, `react-blurhash` (note it is stable but quiet), `unlazy` (vanilla, Vue, Nuxt), the `punch` parameter, and the lifecycle placeholder → image. Add `images/media-placeholder-lifecycle.svg`.
  - [x] Task 15.3. `nextjs-image-component.adoc`: `next/image` with `sizes`, `fill`, `placeholder="blur"` plus `blurDataURL` (decode a BlurHash to a data URL on the server), `loader`, `remotePatterns`, `images.formats`, caching, and the Next 16 change where `priority` is deprecated in favour of `preload`/`fetchPriority`. Verify against the Next.js docs and link `web/nextjs/images-fonts-and-scripts.adoc`.
  - [x] Task 15.4. `react-image-libraries.adoc`: react-lazyload (low activity), react-image (`useImage`; no release since 2023), react-lazy-load-image-component, the native alternative with IntersectionObserver, and a recommendation table with a *Status* column.
  - [x] Task 15.5. `angular-optimized-image.adoc`: `NgOptimizedImage` (`ngSrc`, `priority`, `placeholder`, loaders for imgix, Cloudinary, ImageKit, Cloudflare, Netlify, custom `IMAGE_LOADER`), and BlurHash via the `blurhash` package into the placeholder (the Angular wrappers ng-blurhash, ngx-blurhash and angular-blurhash are unmaintained).
  - [x] Task 15.6. `video-playback-and-streaming.adoc`: `<video>`, `poster`, hls.js with native HLS on Safari, dash.js, Shaka Player, Video.js, Media Source Extensions and `ManagedMediaSource`, and ABR behaviour.
- [x] Task 16. Apps pages in `apps/media-optimization/`
  - [x] Task 16.1. `android-coil-and-glide.adoc`: Coil 3 (`AsyncImage`, memory and disk cache config, `coil-network-*` artifacts), Glide (`DiskCacheStrategy`, Compose), Fresco (brief), BlurHash decoder as a placeholder (the woltapp Kotlin file is copy-in; or `vanniktech/blurhash`). Link `apps/android/image-loading-coil-and-glide.adoc` and avoid repeating it.
  - [x] Task 16.2. `android-video-media3.adoc`: Media3 ExoPlayer (the old ExoPlayer repo is archived), HLS/DASH modules, `SimpleCache`, Media3 Transformer for on-device compression before upload, and thumbnails with `MediaMetadataRetriever`.
  - [x] Task 16.3. `ios-kingfisher-and-nuke.adoc`: Kingfisher (`KFImage`, `DownsamplingImageProcessor`), Nuke (`ImagePipeline`, `LazyImage`, `ImagePrefetcher`), SDWebImage (brief), SwiftUI `AsyncImage` limitations (no dedicated image cache, no prefetch or downsampling), and the woltapp Swift BlurHash decoder. Verify each statement against Apple's `AsyncImage` docs and the libraries' READMEs.
  - [x] Task 16.4. `ios-avfoundation-video.adoc`: `AVPlayer` with HLS, `AVAssetImageGenerator` for cover frames, `AVAssetExportSession` for compression before upload, background uploads with `URLSession`. Link `apps/apple/camera-media-and-photos.adoc`.
  - [x] Task 16.5. `react-native-and-expo-image.adoc`: `expo-image` (`placeholder` with `blurhash`/`thumbhash`, `cachePolicy`, `prefetch`), `react-native-blurhash`, `react-native-fast-image` (recently revived; check its README for New Architecture status), `react-native-video`. Link `apps/react-native/images-and-icons.adoc`.
  - [x] Task 16.6. `kotlin-multiplatform-and-flutter.adoc`: Coil 3 multiplatform `AsyncImage`, KMP BlurHash, `expect`/`actual` video players; Flutter `cached_network_image` and `flutter_blurhash` (brief).
  - [x] Task 16.7. `device-side-compression-and-uploads.adoc`: resize or transcode on the device before upload, HEIC/HEVC from iOS, background and resumable uploads, and when to leave it to the server.

### Group 4 — Cloud pages (Parallelizable: yes)

Depends on Groups 1–2 (links to concept and pattern pages). All files are independent. Every cloud claim and retirement date must be checked against the vendor's own page when reachable; otherwise say "verify" and omit the date.

- [x] Task 17. AWS pages in `cloud/aws/media-optimization/`
  - [x] Task 17.1. `mediaconvert-video-transcoding.adoc`: MediaConvert jobs, presets and job templates, output groups (File, HLS, DASH, CMAF), QVBR, Automated ABR, EventBridge job state events, CLI and SDK examples for Java, Python, Node and .NET. Note that Elastic Transcoder is discontinued.
  - [x] Task 17.2. `frame-capture-and-thumbnails.adoc`: MediaConvert frame capture for covers, and a BlurHash step in a Lambda.
  - [x] Task 17.3. `image-processing-with-s3-and-lambda.adoc`: the S3 → Lambda thumbnail tutorial (Pillow or sharp, with a Lambda layer), separate source and destination buckets, and Dynamic Image Transformation for Amazon CloudFront (formerly Serverless Image Handler) including that S3 Object Lambda is closed to new customers. Reuse the Bookshelf `thumbnailer`.
  - [x] Task 17.4. `streaming-and-delivery.adoc`: MediaPackage v2, CloudFront signed URLs and cookies, MediaLive and IVS for live (brief).
  - [x] Task 17.5. `video-on-demand-pipeline.adoc`: Step Functions + MediaConvert, EventBridge on COMPLETE, the Video on Demand on AWS guidance, plus a Mermaid diagram and `images/media-aws-vod-pipeline.svg`.
- [x] Task 18. `cloud/google-cloud/media-optimization.adoc` (single page, own `== Bibliography`)
  - [x] Task 18.1. Transcoder API (job config, templates, presets, elementary and mux streams, HLS/DASH manifests, sprite sheets), Live Stream API and Video Stitcher API (note they need enablement through the account team, if still true), Media CDN and Cloud CDN signed requests.
  - [x] Task 18.2. Storage-triggered image resizing: Cloud Storage `object.finalized` → Eventarc → Cloud Run or Cloud Run functions, Cloud Run jobs for FFmpeg, Pub/Sub notifications (at-least-once, so idempotent workers). SDK snippets in Java, Python, Node and .NET.
  - [x] Task 18.3. Link `cloud-run*.adoc`, `cloud-storage*.adoc` and `cloud-cdn-and-media-cdn.adoc`, and the backend pattern page.
- [x] Task 19. `cloud/azure/media-optimization.adoc` (single page, own `== Bibliography`)
  - [x] Task 19.1. State plainly that Azure Media Services was retired on 30 June 2024, with a link to the retirement guide. Cover Microsoft's recommended paths (Azure AI Video Indexer for analysis, not transcoding; Marketplace partners).
  - [x] Task 19.2. Self-hosted FFmpeg on Azure: Container Apps event-driven jobs with a KEDA queue scaler, and the Azure Batch FFmpeg sample. Describe them as architecture choices, not an official Microsoft replacement.
  - [x] Task 19.3. Images: Blob Storage → Event Grid → Azure Functions, based on the official resize tutorial, with a note that the sample is old and needs the isolated worker model. Azure AI Vision smart-crop thumbnails, flagged as deprecated.
  - [x] Task 19.4. Delivery: Front Door Standard/Premium, and the CDN retirements (Edgio, Akamai, Standard from Microsoft (classic)) as stated on Microsoft's pages. SDK snippets for Java, Python, Node and .NET. Link `blob-storage.adoc`, `container-apps*.adoc`, `app-service-and-functions.adoc` and `front-door-and-cdn.adoc`.

### Group 5 — Section indexes, bibliographies and cheat sheets (Parallelizable: yes)

Depends on Groups 1–4: indexes list the finished pages and bibliographies list the sources actually used. Each section's files are independent of the others.

- [x] Task 20. Backend `index.adoc` and cheat sheet
  - [x] Task 20.1. `backend/media-optimization/index.adoc`: `:description:`, `:keywords:`, the disclaimer include, an overview of the pipeline, a table of pages, `[[_bibliography]]` + `== Bibliography` listing every source used by the backend pages, each linked to its official site.
  - [x] Task 20.2. `backend/media-optimization/cheat-sheet.adoc`, following `foundry-tools/cheat-sheet.adoc`.
  - [x] Task 20.3. Build `modules/ROOT/attachments/media-optimization-backend-cheat-sheet.pdf` as one A4 page: format table, BlurHash string layout and key equations, FFmpeg command set, ladder, library picker per language with status and licence, pipeline checklist. Write the HTML/CSS in the scratchpad only. Render with `/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --no-sandbox --print-to-pdf=<out> --no-pdf-header-footer <file.html>`, check `len(reader.pages) == 1` and an A4 mediabox with `pypdf`, preview a PNG with `pypdfium2` and iterate until nothing is clipped, then copy only the PDF.
- [x] Task 21. Web `index.adoc`, cheat sheet and PDF (same shape as Task 20, files `web/media-optimization/index.adoc`, `cheat-sheet.adoc`, `media-optimization-web-cheat-sheet.pdf`)
- [x] Task 22. Apps `index.adoc`, cheat sheet and PDF (same shape, `apps/media-optimization/…`, `media-optimization-apps-cheat-sheet.pdf`)
- [x] Task 23. AWS `index.adoc`, cheat sheet and PDF (same shape, `cloud/aws/media-optimization/…`, `media-optimization-aws-cheat-sheet.pdf`)

### Group 6 — Wiring (Parallelizable: no — every task edits the shared `nav.adoc`, parent index pages or existing pages)

- [x] Task 24. `modules/ROOT/nav.adoc`
  - [x] Task 24.1. Add a "Media Optimization" block at `***` under Backend Development, Web Development, Apps and Cloud / AWS, listing every page at the level below, with the cheat sheet last as `Cheat Sheet (PDF)`. Add one `****` entry each under Cloud / Google Cloud and Cloud / Azure for the single pages.
- [x] Task 25. Parent landing pages
  - [x] Task 25.1. Add a bullet, a mention in `:description:` and `:keywords:` to `backend/index.adoc`, `web/index.adoc`, `apps/index.adoc`, `cloud/index.adoc`, `cloud/aws/index.adoc`, `cloud/azure/index.adoc` and `cloud/google-cloud/index.adoc`, and the root `index.adoc` description and keywords if the pattern of earlier sections does so.
- [x] Task 26. Back-links from existing pages (one sentence each, no duplicated content)
  - [x] Task 26.1. Backend: `springboot/file-storage-and-object-stores.adoc`, `nestjs/file-upload-and-streaming.adoc`, `fastapi/forms-and-file-uploads.adoc`, `messaging/messaging-patterns-in-practice.adoc`.
  - [x] Task 26.2. Web: `nextjs/images-fonts-and-scripts.adoc`, `html-css/performance-loading.adoc`. Apps: `android/image-loading-coil-and-glide.adoc`, `apple/camera-media-and-photos.adoc`, `react-native/images-and-icons.adoc`.
  - [x] Task 26.3. Cloud: `aws/s3-object-storage.adoc`, `aws/cloudfront-cdn.adoc`, `azure/blob-storage.adoc`, `azure/front-door-and-cdn.adoc`, `google-cloud/cloud-storage.adoc`, `google-cloud/cloud-cdn-and-media-cdn.adoc`.

### Group 7 — Verification (Parallelizable: no — one build, then fixes)

- [x] Task 27. Build and check — verified with a local-only playbook (remote content sources unreachable here); only the 85 pre-existing xref errors to remote components remain; all CLAUDE.md greps print nothing; 1247 Mermaid diagrams parse; 4 PDFs are one A4 page; no new secrets. Most external links could not be opened from the sandbox and are marked (unverified) in the bibliographies.
  - [x] Task 27.1. Delegate the Antora build to the `iru-gate-runner` agent (`Agent({description: "Build Antora site", subagent_type: "iru-gate-runner", prompt: "Invoke Skill({skill: \"iru-build-docs\"}) and report only errors and warnings, especially xref and AsciiDoc errors"})`). It must finish without `xref` or AsciiDoc errors.
  - [x] Task 27.2. Run the `CLAUDE.md` checks. Each must print nothing:
    ```bash
    grep -rnE '^image::' modules | grep -vE '\]\s*$'
    grep -rnE '(^|[^:+])image:[^:[ ]+\[[^]]*$' modules --include='*.adoc'
    grep -rn '<p>image::' build/site --include='*.html'
    grep -nE '^image::[^[]+\[[^"][^]]*,[^]=,]*(,|\]$)' <the new .adoc files>
    grep -rnE '<code>[^<]*(<(em|strong|mark|sub|sup)>|&#8594;|&#8658;|&#8656;|&#8592;|&#8230;|&#8217;|&#8203;|\{plus\})' build/site/backend/media-optimization build/site/web/media-optimization build/site/apps/media-optimization build/site/cloud/aws/media-optimization build/site/cloud/google-cloud/media-optimization.html build/site/cloud/azure/media-optimization.html --include='*.html'
    ```
  - [x] Task 27.3. Run `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`. Every diagram must be reported as parsed.
  - [x] Task 27.4. Confirm every new `images/media-*.svg` is referenced by a page, every `image::` target exists, and each new PDF is one A4 page (`pypdf`). Confirm each external link in the bibliographies was opened or marked unverified, that no admonition other than the disclaimer was added, and that MathJax renders the BlurHash equations (check the built HTML for the `\(`/`\[` delimiters outside code).
  - [x] Task 27.5. Run the `iru-check-security` skill on the new files before any push.
