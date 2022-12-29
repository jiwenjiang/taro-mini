(async () => {
  const execa = await import("execa");
  const inquirer = await import("inquirer");
  const ci = require("miniprogram-ci");
  const projectJson = require("./project.config.json");
  const version = require("./version");

  let comment = getGitLastMsg("%an/%cd/%s");

  //   const answer = await inquirer.default.prompt([
  //     {
  //       type: "string",
  //       name: "comment",
  //       message: `请输入新版本项目描述，默认为（${comment}）`,
  //       default: comment
  //     }
  //   ]);
  //   console.log("🚀 ~ file: miniprogram-ci.js:12 ~ answer", answer);

  // check in main branch
  const curbranch = getGitBranch();
  if (curbranch !== "main" && curbranch !== "master") {
    console.log("\x1b[41m%s\x1b[0m", "请在主分支发布");
    return;
  }

  // check the code enters the repository
  const res = execa.execaCommandSync(`git status`);
  if (!res.stdout.includes("nothing to commit")) {
    const lastComment = getGitLastMsg("%s");
    const a = execa.execaCommandSync(`git add .`);
    const res2 = execa.execaSync("git", ["commit", "-m", lastComment]);
    console.log("🚀 ~ file: miniprogram-ci.js:23 ~ res", res2, lastComment);
    console.log("\x1b[43m%s\x1b[0m", "代码提交至本地仓库");
    return;
  }

  function getGitBranch() {
    const res = execa.execaCommandSync("git rev-parse --abbrev-ref HEAD");
    return res.stdout;
  }

  function getGitLastMsg(format) {
    const res = execa.execaCommandSync(`git log --pretty=format:${format} -1`);
    return res.stdout;
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
    desc: comment,
    setting: {
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
      minify: true
    },
    onProgressUpdate: () => {
      console.log("building...");
    }
  });
  if (uploadResult) {
    version.updateVersion();
    const res = execa.execaCommandSync("git push");
    console.log(2222, res);
  }
  console.log(1111, uploadResult);
})();
