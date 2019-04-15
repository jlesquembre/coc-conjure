const { sources, workspace } = require("coc.nvim");
const { Socket } = require("net");


function sendMessage(client, message) {
  return new Promise((resolve, reject) => {
    client.write(message);

    client.on("data", data => {
      resolve(data);
    });

    client.on("error", err => {
      reject(err);
    });
  });
}


exports.activate = async context => {
  const { nvim } = workspace;
  let client = null;

  async function newClient() {
    const client = new Socket();
    const port = await nvim.eval("conjure#get_rpc_port()");
    client.connect(port, "127.0.0.1");
    return client;
  }

  async function conjureCompletions(input) {
    if (client == null) {
      client = await newClient();
    }
    // See
    // https://github.com/Olical/conjure/blob/master/rplugin/python3/deoplete/sources/conjure.py
    const req = [0, 1, "completions", [input]];

    const response = await sendMessage(client, JSON.stringify(req));
    return JSON.parse(response)[3];
  }

  context.subscriptions.push(
    sources.createSource({
      name: "conjure",
      triggerCharacters: [],
      doComplete: async function(opt) {
        const input = opt.input;
        if (!input) return null;

        const res = await conjureCompletions(input);

        if (!res || res.length === 0) return null;
        return { items: res };
      }
    })
  );
};
