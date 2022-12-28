(async () => {
  const execa = await import("execa");
  const ci = require("miniprogram-ci");
  const projectJson = require("./project.config.json");
  const version = require("./version");

  const res = execa.execaCommandSync(`git status`);
  if (!res.stdout.includes("nothing to commit")) {
    console.log("\x1b[43m%s\x1b[0m", "请将代码提交至本地仓库");
    return;
  }

  function getGitBranch() {
    const res = execa.execaCommandSync("git rev-parse --abbrev-ref HEAD");
    return res.stdout;
  }

  function getGitLastMsg() {
    const res = execa.execaCommandSync(
      "git log --pretty=format:“%an/%cd/%s” -1"
    );
    return res.stdout;
  }
  const curbranch = getGitBranch();
  if (curbranch == "main" || curbranch !== "master") {
    console.log("\x1b[41m%s\x1b[0m", "请在主分支发布");
  }

  console.log("process.argv", process.argv.slice(2)[0]);

  const project = new ci.Project({
    appid: projectJson.appid,
    type: "miniProgram",
    projectPath: projectJson.miniprogramRoot,
    privateKeyPath: "private.mini.key",
    ignores: ["node_modules/**/*"],
    robot: 1
  });
  const uploadResult = await ci.upload({
    project,
    version: version.getVersion(),
    desc: process.argv.slice(2)[0] || getGitLastMsg(),
    setting: {
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
      minify: true
    },
    onProgressUpdate: console.log
  });
  if (uploadResult) {
    version.updateVersion();
    const res = execa.execaCommandSync("git push");
    console.log(2222, res);
  }
  console.log(1111, uploadResult);
})();
