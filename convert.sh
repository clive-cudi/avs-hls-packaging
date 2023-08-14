#!/bin/bash
#
echo "all good"

if [ -z "$1" ]
  then
    echo "Please pass the target video file."
    exit 1
fi

ffmpeg -i $1 \
-filter_complex \
"[0:v]split=4[v1][v2][v3][v4]; \
[v1]copy[v1out]; [v2]scale=w=1280:h=720[v2out]; [v3]scale=w=854:h=480[v3out]; [v4]scale=w=640:h=360[v4out];" \
-map "[v1out]" -c:v:0 libx264 -b:v:0 5M -maxrate:v:0 5M -minrate:v:0 5M -bufsize:v:0 10M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
-map "[v2out]" -c:v:1 libx264 -b:v:1 3M -maxrate:v:1 3M -minrate:v:1 3M -bufsize:v:1 3M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
-map "[v3out]" -c:v:2 libx264 -b:v:2 2M -maxrate:v:2 2M -minrate:v:2 2M -bufsize:v:2 2M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
-map "[v4out]" -c:v:3 libx264 -b:v:3 2M -maxrate:v:3 2M -minrate:v:3 2M -bufsize:v:3 2M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
-map a:0 -c:a:0 aac -b:a:0 96k -ac 2 \
-map a:0 -c:a:1 aac -b:a:1 96k -ac 2 \
-map a:0 -c:a:2 aac -b:a:2 48k -ac 2 \
-map a:0 -c:a:3 aac -b:a:3 48k -ac 2 \
-f hls \
-hls_time 40 \
-hls_playlist_type vod \
-hls_flags independent_segments \
-hls_segment_type mpegts \
-hls_segment_filename out/stream_%v/data%02d.ts \
-master_pl_name master.m3u8 \
-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3" out/stream_%v.m3u8
