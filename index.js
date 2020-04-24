const { sources, workspace } = require("coc.nvim");
const { nvim } = workspace;

async function completions(input) {
  return nvim.lua("return require('conjure.eval')['completions-sync'](...)", input)
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
