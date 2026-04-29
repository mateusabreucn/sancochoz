# HandBrake preset for Showcase videos

Use this preset before uploading videos to Cloudflare R2.

## Settings

- Format: MP4
- Web Optimized: enabled
- Resolution: 720 x 1280
- Anamorphic: None
- Crop: Custom, keep vertical 9:16 framing
- Framerate: Same as source, Constant
- Video codec: H.264 (x264)
- Quality: RF 23
- Audio codec: AAC
- Audio bitrate: 96 kbps
- Audio mixdown: Stereo

Expected final size: roughly 2-4 MB for short vertical videos.

## Naming

Use a numeric prefix to control ordering:

```text
01-Boat-Party.mp4
02-Alameda.mp4
03-Rio-Samba.mp4
```

Upload files into these R2 folders:

```text
showcase/videomaking/
showcase/webdesign/
showcase/socialmedia/
```
