# Overview
Documentation aggregation of all repositories in the account

- 📘 [Documentation](http://albertoirurueta.github.io/docs)

# How to manually generate documentation
Documentation is generated using Antora.
To manually generate documentation follow steps below:

## Prerequisites
To run Antora, node needs to be installed first.
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

6. Install Antora: https://docs.antora.org/antora/latest/install-and-run-quickstart/
Antora needs to be installed on the folder where documentation files will be contained. In this repository this is the root folder, but in other repositories, documentation is contained in `docs` folder
```
npm i -D -E antora
```

## Documentation generation
Once node and Antora is installed, we need to set the current working directory to the one where Antora playbook file is located (in this repository this is the root directory), and then run:
```
npx antora antora-playbook.yml
```

Documentation will be generated in the `build/site` directory as a static website.