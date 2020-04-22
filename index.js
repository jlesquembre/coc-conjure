const { sources, workspace } = require("coc.nvim");
const { nvim } = workspace;

async function completions(input) {
  const p = await nvim.lua("return require('conjure.eval')['completions-promise'](...)", input)
  await nvim.lua("require('conjure.promise').await(...)", p)
  return nvim.lua("return require('conjure.promise').close(...)", p)
}

exports.activate = async context => {
  context.subscriptions.push(
    sources.createSource({
      name: "conjure",
      triggerCharacters: [".", "/", ":"],
      doComplete: async function(opt) {
        const input = opt.input;
        if (!input) return null;
        const res = await completions(input);
        if (!res || res.length === 0) return null;
        return { items: res };
      }
    })
  );
};
