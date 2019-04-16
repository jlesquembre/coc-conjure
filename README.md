# coc-conjure

[Conjure][] completion support for [coc.nvim][].

[![NPM version](https://img.shields.io/npm/v/coc-conjure.svg?style=for-the-badge)](https://www.npmjs.com/package/coc-conjure)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

## Install

In your `init.nvim`, add it to your list of coc extensions:

```viml
let g:coc_global_extensions = ['coc-conjure']
```

Alternatively, in your vim/neovim, run command:

```viml
:CocInstall coc-conjure
```

## Development

Link the package to the CoC project:

1. In `coc-conjure` directoy run `yarn link`
1. In CoC extensions directory (`~/.config/coc/extensions` by default) run `yarn link "coc-conjure"`
1. For debugging and auto-reload, add to your `init.vim`:

   ```viml
   let g:coc_node_args = ['--nolazy', '--inspect-brk=6045']
   let g:coc_watch_extensions = ['coc-conjure']
   ```

For debugging, open `chrome://inspect/` in chrome


[conjure]: https://github.com/Olical/conjure
[coc.nvim]: https://github.com/neoclide/coc.nvim
