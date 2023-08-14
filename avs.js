const targetResolutions = ["854x480", "640x360", "426x240"];
const targetRootFolder = "./out";
const targetVideoPath = "./assets/Video_1080p.mp4";
const targetAspectRatio = "16:9";
const { spawn } = require("child_process");
const fs = require("fs/promises");
const path = require("path");

async function ensureDir(path) {
  await fs.mkdir(path, { recursive: true });
}

async function spawnDirectories(resolutions = []) {
  for (res in resolutions) {
    const dirpath = path.resolve(
      __dirname,
      targetRootFolder,
      `${resolutions[res]}`
    );
    await ensureDir(dirpath);
  }
}

function runCMD(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log("[Running]", command, args);
    const cmd = spawn(command, args);

    cmd.on("error", (err) => {
      reject(err);
    });

    cmd.on("close", (code) => {
      resolve(code);
    });
  });
}

async function main() {
  await spawnDirectories(targetResolutions);
  for (t_res in targetResolutions) {
    const dirpath = path.resolve(
      __dirname,
      targetRootFolder,
      `${targetResolutions[t_res]}`
    );
    console.log(dirpath);
    const command =
      `ffmpeg -i ${targetVideoPath} -c:a aac -strict experimental -c:v libx264 -s ${targetResolutions[t_res]} -aspect ${targetAspectRatio} -f hls -hls_list_size 1000000 -hls_time 10 ${dirpath}/${targetResolutions[t_res]}_out.m3u8`.split(
        " "
      );

    // console.log(command.split(" "));
    if (command[0] == "ffmpeg") command.shift();

    await runCMD("ffmpeg", command);
  }
}

main();
