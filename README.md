This repo is a copy of Angular's Karma examples, enhanced for innovation activities, best practices and information sharing. ![cypress version](https://img.shields.io/badge/cypress-7.2.0-brightgreen)

Originally the repository was Siemens internal and used  GitLab. It got migrated to Github and CircleCI, but the gitlab files have been left-in for a reference. Technically, this repo can be dropped in at gitlab.com and it would work, granted the runner tags are modified.

Improvements over the base application include:

* Migration from Karma to Spectator & Jest, showcasing patterns of unit testing in Angular
* PWA migration
* Cypress setup
* CI setup
* Combined coverage with Jest and Cypress, including CI
* Linters and pre-commit hooks: Eslint, Prettier, Js-beautify, Husky
* The app has been deployed to AWS S3 as a static website, e2e tests can run against this deployment


Clone, cd in.

```bash
npm i       # installs 
npm start   # serves 

# on another tab

npm run test  # runs unit tests
npm run lint  # lints & fixes ts, css, html
npm run cypress:open       # starts cypress test runner against served app at localhost:4200
npm run cypress:run        # runs cypress tests headed against served app
npm run cypress:open-dev   # starts cypress test runner against deployed s3 static site at https://d1kaucldkbcik4.cloudfront.net
```

### Links
[CircleCI Pipelines](https://app.circleci.com/pipelines/github/muratkeremozcan/angular-playground)

[Cypress Dashboard](https://dashboard.cypress.io/projects/4mhoqq/runs?branches=%5B%5D&committers=%5B%5D&flaky=%5B%5D&page=1&status=%5B%5D&tags=%5B%5D&timeRange=%7B%22startDate%22%3A%221970-01-01%22%2C%22endDate%22%3A%222038-01-19%22%7D) 

[Combined coverage blog post](https://dev.to/muratkeremozcan/combined-unit-e2e-code-coverage-case-study-on-a-real-life-system-using-angular-jest-cypress-gitlab-35nk)


<br></br>


The original Karma example repo can be found [here](https://github.com/muratkeremozcan/books/tree/master/Angular_with_Typescript/angular-unit-testing-with-Karma). 
<details><summary>Migrating from Karma to Jest</summary>


[Why use Jest](https://slides.com/msz_technology/deck)?


You can do it [manually](https://dev.to/alfredoperez/angular-10-setting-up-jest-2m0l), or automatically with [Angular Jest Schematic from Briebug](https://github.com/briebug/jest-schematic)

To get started:



```bash
npm install jest @types/jest jest-preset-angular --save-dev

npm uninstall karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter @types/jasmine @types/jasminewd2 jasmine-core jasmine-spec-reporter

ng add @briebug/jest-schematic
```

The schematic will do these:
```bash
DELETE karma.conf.js
DELETE src/test.ts
CREATE jest.config.js (180 bytes)
CREATE setup-jest.ts (860 bytes)
CREATE test-config.helper.ts (611 bytes)
UPDATE package.json (1322 bytes)
UPDATE angular.json (3592 bytes)
UPDATE tsconfig.spec.json (330 bytes)
```

Instead of `jest.config.js`, move the settings to package.json. I like to add to package.json the settings in the [manual instructions](https://dev.to/alfredoperez/angular-10-setting-up-jest-2m0l). Enhance this as you need it. Here is what I have in `package.json`:

```json
  "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": [
      "<rootDir>/setup-jest.ts"
    ],
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/"
    ],
    "globals": {
      "ts-jest": {
        "tsconfig": "<rootDir>/tsconfig.spec.json",
        "stringifyContentPathRegex": "\\.html$"
      }
    },
    "moduleNameMapper": {
      "@core/(.*)": "<rootDir>/src/app/core/$1"
    }
  }
```

I also like to replace default test script in `package.json` and add some new ones:

```json
"scripts": {
  ...
  "test": "jest",
  "test:coverage": "jest --collectCoverage",
  "test:watch": "jest --watch",
}
```

In `setup-jest.js`, change the first line from `import 'jest-preset-angular';` to `import 'jest-preset-angular/setup-jest`. This will get rid of the Jest warning when running tests. In a future version of briebug schematic, this may be taken care of.

Spying and mocking is different in Jest. You will have to change these manually.


If using Spectator, `npm i -D @ngneat/spectator`. In the spec files change `import from '@ngneat/spectator'` to  `import from '@ngneat/spectator/jest'`.


</details>

<br></br>

<details><summary>PWA migration</summary>



## PWA

A [Service Worker](https://angular.io/guide/service-worker-intro) is a script that runs in the web browser and manages caching for an application. Using a service worker to reduce dependency on the network can significantly improve the user experience.

<br> </br>
### Add the service worker to the project

`ng add @angular/pwa --project angular-unit-testing`

<br> </br>

### Verify the changes

* `ngsw-config.json` should get created. This file indicates glob patterns for what gets cached, and is configurable.

  <details><summary>There are 2 important properties here: </summary>

  1. `installMode` determines how the resources are initially cached, that is, when the user first visits the application and the service worker is registered for the first time.

  2. `updateMode` works for resources already in the cache.

  These properties can have 2 values– `prefetch` and `lazy`. 

  `prefetch` means that the service worker will go ahead and download all resources in the group as soon as possible and put them into the cache.
  This uses more data initially but ensures that resources are already in the cache, even when the application goes offline later. 

  `lazy` means that the service worker will only download the resources when they are requested.

  </details>



*  `angular.json` build section gets updated. 

    If you want to enable service workers in deployments, double check that it is also copied to other config sections (dev, int, preview etc.).
    ```json
      "serviceWorker": true,
      "ngswConfigPath": "ngsw-config.json"
    ```

* `app-module.ts` gets updated:

  ```typescript
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ```

<br>

### Test that it works

Build in prod mode and locally test utilizing [`http-server`](https://www.npmjs.com/package/http-server) package.
> Service workers are only available in Prod mode.

**Arrange:** 

  ```bash
  ng build --prod

  npm i -g http-server

  http-server -p 8080 -c-1 dist/angular-unit-testing    ## -c-1 disables caching
  ```

  Nav to `http://127.0.0.1:8080` , use incognito.
  

**Act:**

Using Devtools > Network tab,  turn the network off and refresh the app. 


**Assert:** 

The app should work as normal and the browser should not show disconnected page `There is no Internet connection`.

Devtools > Network tab > Size column should show value `(Service Worker)` for the network resources.

**Additional test**
Devtools > Application tab > and choose Service Workers on the left. You should see that the service worker is enabled.

</details>


<br></br>

<details><summary>Setup Cypress</summary>


### [Migrate from Protractor to Cypress](https://blog.briebug.com/blog/switching-to-cypress-from-protractor-in-less-than-30-seconds)

This will replace Protractor with Cypress and update your dependencies and project files.

```bash
npm install -g @briebug/cypress-schematic
ng add @briebug/cypress-schematic
```

You can optionally leave the changes it makes to `angular.json`, and `package.json` they do not do harm.
Personally I do not utilize them. So I remove the "e2e", "cypress-run" and "cypress-open" properties from `angular.json`. I also remove the `briebug/cypress-schematic` package from `package.json`. 

```json
  "e2e": { ...
  },
  "cypress-run": { ...
  },
  "cypress-open": { ...
  }
```

### Core recommended settings

* Use *`index.js` instead of `index.ts` under `cypress/support`, because it works better with Cypress plugins that may not support TypeScript.

* Recommended settings for `cypress.json`.

  ```json
  {
    "baseUrl": "http://localhost:4200",
    "videoUploadOnPasses": false, // will be cost effective in CI
    "retries": {
      "runMode": 2,  // retries in CI, or locally running with cypress:run
      "openMode": 0
    },
    "chromeWebSecurity": false, // will help with x-origin
    "$schema": "https://on.cypress.io/cypress.schema.json",  // will safeguard against misconfiguration of cypress.json 
  }
  ```

* Use config files

  A good pattern for testing different deployments (development, staging, production etc.) is using config files. 

  I like to use `@bahmutov/cypress-extends` to have the custom config files I create under `cypress/config` folder inherit from the base `cypress.json` file. This is not yet included in the base Cypress install. Refer to `plugins/index.js` `cypress/config/` folder to sample the setup.

  ```json
  //  cypress/config/dev.json
  {
    "extends": "../../cypress.json",
    "baseUrl": "https://your-deployed-app.com"
  }
  ```

* Add 2 scripts to package.json, to open Cypress with test runner and to run Cypress headed. The `--config-file cypress/config/local.json` is optional, but needed to utilize config files.
* 
  ```json
  "cypress:open": "cypress open --config-file cypress/config/local.json",
  "cypress:run": "cypress run --config-file cypress/config/local.json"
  ```

### Start Cypress

Serve your app with `npm run start` and on another tab start Cypress with `npm run cypress:open`. 

To execute the tests in CI or without the test runner UI locally, use `npm run cypress:run`. 

</details>

<br></br>

<details><summary>Setup CI</summary>

## CI

* Make Cypress an optional dependency instead of a dev dependency. If for any reason CI fails to install Cypress, it does not matter, because we will be using the Cypress included docker image in e2e stage. This approach will also speed up the build stage by a factor.

  ```json
  "optionalDependencies": {
    "cypress": "7.2.0"
  },
  ```

* `npm i -D star-server-and-test` . [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) makes it easy to spin a localhost in CI and run e2e against it. 
  
  Locally try out the script `npm run easy` to see it serve localhost and then open cypress.

  In CI we use a version of it:

  ```yml
  # spins up a local UI server, waits for it to start, executes Cypress tests against localhost, stops the server
    script:
      - >
          npm run server-test start http://localhost:4200
          'cypress run --record --parallel --browser chrome --group local --tag 'branch' --config-file cypress/config/local.json'

  ```
* GitLab provides a few optimizations: Caching, Acyclic patterns, Parallelization, Resource groups. These are all applicable to Cypress CI setup as well. Have a look at the yml files from master for details.


* Parallelization: when you open Cypress runner, you default to the Tests tab. Check out the Runs tab. This is where you begin with [Cypress Dashboard](https://www.cypress.io/dashboard/). It has 500 test executions for free monthly, and they are willing to give unlimited free trial if you ask for it, so do not worry.

  * On the upper right use Login to login the dashboard https://dashboard.cypress.io/login . I use GitHub.
  * Connect to Dashboard and create a project.
  * From here on, Cypress docs are excellent. But, effectively all you need is to set the projectId in `cypress.json` and/or the config files (`"projectId": "4mhoqq"`) and use the record key.
  * Test a recording locally `npx cypress run --record --key 29b708ae-6839-4446-8d68-d93ad6ca81f9`
  * [As advised in the docs](https://docs.cypress.io/guides/guides/command-line#cypress-run) set the key as an environment variable in CI (already done in CI, but not in your local environment, obviously). If you set this env var locally, you can omit the key parameter: `npx cypress run --record ` 
  * You can view all the runs at the [dashboard](https://dashboard.cypress.io/projects/4mhoqq/runs?branches=%5B%5D&committers=%5B%5D&flaky=%5B%5D&page=1&status=%5B%5D&tags=%5B%5D&timeRange=%7B%22startDate%22%3A%221970-01-01%22%2C%22endDate%22%3A%222038-01-19%22%7D) since this is a public project.

</details>

<br></br>

<details><summary> Setup Combined Coverage</summary>

Follow the [blog post](https://dev.to/muratkeremozcan/combined-unit-e2e-code-coverage-case-study-on-a-real-life-system-using-angular-jest-cypress-gitlab-35nk) for a detailed walk-through of combined code coverage setup.
</details>

<br></br>


<details><summary>Setup lint</summary>

### Setup eslint

> Tip: to create a new Angular project with eslint 
>```bash
>ng new --collection=@angular-eslint/schematics
>```

* Angular still creates new projects with tslint as of version 11. To migrate to eslint:

  ```bash
  ng add @angular-eslint/schematics
  # generates a new ESLint file based on the contents of your project’s existing TSLint config. Mileage can vary.
  ng g @angular-eslint/schematics:convert-tslint-to-eslint
  # get some of the recommended plugins
  npm i -D eslint-plugin-import eslint-plugin-jsdoc eslint-plugin-prefer-arrow eslint-plugin-cypress eslint-plugin-jest
  # remove tslint   
  npm remove codelyzer
  npm remove tslint # if it's still in package.json
  # remove tslint.json file 
  ```

  `angular.json` "lint" property should be as below. If not, make it so.

  ```json
  "lint": {
    "builder": "@angular-eslint/builder:lint",
    "options": {
      "lintFilePatterns": [
        "src/**/*.ts",
        "src/**/*.html"
      ]
    }
  }
  ```

  `.eslintignore` (empty by default) `.eslintrc.json` should be created.

  <details><summary>If not, here is the default .eslintrc.json</summary>

  ```json
  {
    "root": true,
    "ignorePatterns": [
      "projects/**/*"
    ],
    "overrides": [
      {
        "files": [
          "*.ts"
        ],
        "parserOptions": {
          "project": [
            "tsconfig.json",
            "e2e/tsconfig.json"
          ],
          "createDefaultProgram": true
        },
        "extends": [
          "plugin:@angular-eslint/ng-cli-compat",
          "plugin:@angular-eslint/ng-cli-compat--formatting-add-on",
          "plugin:@angular-eslint/template/process-inline-templates"
        ],
        "rules": {
          "@angular-eslint/component-selector": [
            "error",
            {
              "type": "element",
              "prefix": "app",
              "style": "kebab-case"
            }
          ],
          "@angular-eslint/directive-selector": [
            "error",
            {
              "type": "attribute",
              "prefix": "app",
              "style": "camelCase"
            }
          ]
        }
      },
      {
        "files": [
          "*.html"
        ],
        "extends": [
          "plugin:@angular-eslint/template/recommended"
        ],
        "rules": {}
      }
    ]
  }
  ```
  </details>


* Add a `.eslintrc.json` file for cypress folder:

  ```json
  {
    "extends": [
      "plugin:cypress/recommended"
    ]
  }
  ```

* Install the [eslint vscode extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)


* You can be stricter with linting. Check out [blog post](https://dev.to/gsarciotto/migrating-and-configuring-eslint-with-angular-11-3fg1).

  ```json
  "extends": [
    "plugin:@angular-eslint/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@angular-eslint/template/process-inline-templates"
  ],
  ```

### Setup [prettier](https://www.npmjs.com/package/prettier) code formatter

`npm i -D prettier eslint-config-prettier eslint-plugin-prettier`

You can find recommended configurations for  `.prettierrc.js`, `prettierignore` and `.vscode/settings.json` files in the final version of the repository.

Get the [vs code extension](esbenp.prettier-vscode).

Add prettier rule to `.eslintrc.json`.

```json
"extends": [
  "plugin:prettier/recommended",
  "plugin:@angular-eslint/ng-cli-compat",
  "plugin:@angular-eslint/ng-cli-compat--formatting-add-on",
  "plugin:@angular-eslint/template/process-inline-templates",
  "plugin:jest/recommended",
  "plugin:jest/style",
],
```

Now if we run ESLint with --fix flag, it will use Prettier to auto format code, solving both stylistic and semantic problems.

### Setup [js-beautify](https://www.npmjs.com/package/js-beautify) for css and or html

`npm i -D js-beautify`

Create a `.jsbeautifyrc` file. You can find recommended configurations for the file in the final version of the repository.

Get the [vscode extension](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify).

Enhance package.json `"lint": "ng lint --fix && npx js-beautify src/**/*.css"`


### Setup [stylelint](https://stylelint.io/) for css (optional)

>  The findings were too many to fix in this project, best to start with stylelint and not do it later.

Helps you avoid errors and enforce conventions in your styles.

`npm i -D stylelint stylelint-config-standard`

* Create a `.stylelintrc.json` configuration file in the root of your project:
  ```json
  {
    "extends": "stylelint-config-standard"
  }
  ```

* Optionally enhance the package.json lint script as: `"lint": "ng lint --fix && npx stylelint **.css`.

### Setup husky pre-commit hook

Can execute lint and unit test prior to git push.

> To skip pre-commit hooks, use -n / --no-verify commit message modifier.

`npm i -D husky`

Add to package.json the pre-commit hook

```json
"husky": {
  "hooks": {
    "pre-commit": "npm run lint && npm run test"
  }
}
```

If husky is not working on commit:

```bash
rm -rf .git/hooks/
npm remove husky
npm i -D husky
```

If still does not work, use an older version of husky, like the one in this repo's package.json.


</details>

<br></br>

<details><summary>Deploy the Angular single page app to AWS S3 as a static website</summary>

```                    +----+     +------------+
Compiled angular -> | S3 | <-> | CloudFront |  <--> Internet
  (/dist folder)    +----+     +------------+
```
[(*source*)](https://medium.com/@peatiscoding/here-is-how-easy-it-is-to-deploy-an-angular-spa-single-page-app-as-a-static-website-using-s3-and-6aa446db38ef)

*"You can use Amazon S3 to host a static website. On a static website, individual webpages include static content, in contrast to a dynamic website which relies on server-side processing."*

1. Locally, run `ng build --prod` to populate your app's dist folder; ex: `dist/angular-unit-testing`.

2. Log in to your AWS account and nav to [S3 console](https://s3.console.aws.amazon.com/s3/home).

3. Create a bucket. Enter a bucket name (ex: `angular-cypress-jest-playground`), and select an AWS Region (ex: `us-east-1`).

4. Unblock all public access. The default is Block *all* public access. The other settings are optional, in this repo's workflow they have been skipped.

5. At your bucket default view (Amazon S3 > angular-cypress-jest-playground > Objects) click upload, Add files, and select the files at your app's dist folder (i.e. `dist/angular-unit-testing`).

6. Under Permissions, choose *Grant public-read access*. All the other settings are optional. Hit Upload and wait a few seconds. Then you can Close the view and get back to Amazon S3 > angular-cypress-jest-playground > Objects.

7. Nav to Properties tab (Amazon S3 > angular-cypress-jest-playground > Properties). At the bottom, Edit **Static website hosting** and Enable it. For both **Index document** and **Error document** enter `index.html`.

You should be able to access your site at `http://<bucket-name>.s3-website-<region>.amazonaws.com` , or namely http://angular-cypress-jest-playground.s3-website-us-east-1.amazonaws.com

### Important note about setting **Error document** to `index.html`
Choosing `index.html` for **Error document** is a hacky way of getting around errors that would happen when using Angular's routing mechanism. For example, do not set **Error Document**, go to the url, and then copy paste a route to the browser (ex: http://angular-cypress-jest-playground.s3-website-us-east-1.amazonaws.com/heroes/15). You will get a 403 forbidden error, which you would not see if you were locally serving your application.


### Make it better by using CloudFront

CloudFront is a content delivery network. *"When a user requests content that you're serving with CloudFront the request is routed to the edge location that provides the lowest latency (time delay), so that content is delivered with the best possible performance"*.

We can configure CloudFrount so that whenever S3 replies with 403 or 404, we return content from `index.html` and respond with status 200.


1. Go to CloudFront Console > Create new Distribution > Get Started. You should be at *Create Distribution form*.

2. Origin Domain name: select the s3 bucket we created `angular-cypress-jest-playground.s3.amazonaws.com`

3. Default Cache Behavior Settings > Allowed HTTP Methods: select Redirect HTTP to HTTPS

4. (optional) Distribution Settings > Alternate Domain Names : you can pick a name here for example just `angular-cypress-jest-playground`, but you would have to use AWS Route 53 to register that domain name for $12/year. (Did not do this for this example).

5. Default Root Object: enter `index.html`.You can leave everything else default and save.

6. You should be at CloudFront Distributions. Put a check mark on the distribution and go to Distribution Settings > Error Pages > Create Custom Error Response.

7. You will create 2 custom error responses for 403 and 404. Each should have **Response Page Path**: `/index.html` and **HTTP Response Code**: `200: OK`.  


Our alternate url is https://d1kaucldkbcik4.cloudfront.net. 

You can now make 3 changes to the test architecture, so that master pipeline runs against this new url.

1. set `cypress/config/dev.json` file's `baseUrl` as `https://d1kaucldkbcik4.cloudfront.net`.
2. add a script to `package.json` to run tests againt the dev deployment: `"cypress:open-dev": "cypress open --config-file cypress/config/dev.json"`
3. create a master pipeline / dev deployment e2e test job. Refer to `cypress/.gitla-ci-tests.yml` `.dev_template: &dev` job for details.

> Note: in the real world you would have infra as code, and the deployments would be targeting S3 automatically, without us having to manually deploy the app. This process is not a part of the repo here.

</details>
