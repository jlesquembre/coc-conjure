const { sources, workspace } = require("coc.nvim");
const { nvim } = workspace;

async function lua(mod, f, arg) {
  return nvim.lua("return require('" + mod + "')['" + f + "'](...)", arg);
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
          items: res.map((word) => ({
            ...word,
            menu: this.menu,
          })),
        };
      },
    })
  );
};
