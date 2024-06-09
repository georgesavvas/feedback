# ETC Asset Library

[![build status](http://gitlab.etc.com/et-pipeline/asset_library/badges/master/build.svg)](http://gitlab.etc.com/et-pipeline/asset_library/commits/master)
[![coverage report](http://gitlab.etc.com/et-pipeline/asset_library/badges/master/coverage.svg)](http://gitlab.etc.com/et-pipeline/asset_library/commits/master)

## On first checkout

### clone the project

```bash
git clone git@gitlab.etc.com:et-pipeline/asset_library.git
```

### setup development environment

setup the commit message

```bash
cd asset_library
git config commit.template ci/commit-msg-template
```

setup your dev virtual env and dev tooling. We install these packages in a virtual env to avoid polluting your system packages.

```bash
# create virtual env
cd asset_library
python3 -m venv env

# install dev tools
source env/bin/activate
(env) pip install -r requirements_dev.txt
(env) pre-commit install
```

The pre-commit hooks will run the following tests on your code before getting to commit message:

- Validate that there is no trailing white spaces.
- Make sure that there are no merge conflicts left and any files.
- Verify that the Json and Yaml files are formatted correctly.
- Run a flake8 with our settings against the file.
