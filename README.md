# Overview
Documentation aggregation of all repositories in the account

- 📘 [Documentation](http://albertoirurueta.github.io/docs)

# How to manually generate documentation
Documentation is generated using Antora.
To manually generate documentation follow steps below:

## Prerequisites
To run Antora, Node.js 20 or newer needs to be installed first (CI uses 24).
Available node versions can be found [here](https://nodejs.org/en/download)

For instance, the following steps could be followed to install node 24:
1. Download and install nvm (if not already installed)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```

2Restart the shell or run:
```bash
\. "$HOME/.nvm/nvm.sh"
```

3. Use nvm to download and install node
```bash
nvm install 24
```

4. Verify the Node.js version:
```bash
node -v
```
Should print "v24.16.0".
   
5. Verify npm version:
```bash
npm -v
```
Should print "11.13.0".

6. Install the dependencies: Antora and its extensions are pinned to exact versions in `package.json` (antora 3.2.2, `@antora/collector-extension` 1.0.3, `@sntke/antora-mermaid-extension` 0.0.13, `@djencks/asciidoctor-mathjax` 0.0.9, pagefind 1.6.0). Run from the root folder (in other repositories documentation is contained in the `docs` folder):
```
npm ci
```

## Documentation generation
Once node and Antora is installed, we need to set the current working directory to the one where Antora playbook file is located (in this repository this is the root directory), and then run:
```
npx antora antora-playbook.yml
```
If your want to updated already downloaded repository branches, use the following command instead:
```
npx antora --fetch antora-playbook.yml  
```

Documentation will be generated in the `build/site` directory as a static website.

### Search index
The site search uses [Pagefind](https://pagefind.app). After `antora` has built the site, build the search index (it is written to `build/site/pagefind/`):
```
npm run search:index
```
This runs `npx pagefind --site build/site`, so the same step can be used directly. Run it after every Antora build; without it the search box finds nothing.
