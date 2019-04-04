const { sources, workspace } = require("coc.nvim");

exports.activate = async context => {
  const { nvim } = workspace;

  context.subscriptions.push(
    sources.createSource({
      name: "conjure",
      triggerCharacters: [],
      doComplete: async function(opt) {
        if (!opt.input) return null;
        const res = await nvim.eval(`conjure#completions("${opt.input}")`);
        if (!res || res.length === 0) return null;
        return { items: res };
      }
    })
  );
};
