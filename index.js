const { sources, workspace } = require("coc.nvim");
const { nvim } = workspace;

async function lua(mod, f, arg) {
  return nvim.executeLua("return require('" + mod + "')['" + f + "'](...)", [arg]);
}

async function snooze(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

async function completions(input) {
  const p = await lua("conjure.eval", "completions-promise", input);

  while (!(await lua("conjure.promise", "done?", p))) {
    await snooze(20);
  }

  return lua("conjure.promise", "close", p);
}

function fixWhitespace(str, c) {
  return str.split(c).map((s) => s.trim()).filter((s) => s);
}

function formatDocstring({word, info, menu}) {
  if (typeof info === "string") {
    return fixWhitespace(info, "\n").join("\n")
  }
  if (typeof menu === "string") {
    const splits = fixWhitespace(menu, " ");
    const namespace = splits[0];
    const params = splits.slice(1).join(" ");
    return `${namespace}/${word}\n(${params})`
  }
}

exports.activate = async (context) => {
  context.logger.info("CoC conjure enabled!");

  context.subscriptions.push(
    sources.createSource({
      name: "conjure",
      triggerCharacters: [".", "/", ":"],
      doComplete: async function (opt) {
        const input = opt.input;
        if (!input) return null;
        const res = await completions(input);
        if (!res || res.length === 0) return null;
        return {
          items: res.map((item) => ({
            word: item.word,
            kind: item.kind?.toLowerCase(),
            info: formatDocstring(item),
          })),
        };
      },
    })
  );
};
