// Copyright (c)2023 Quinn Michaels
// Github Deva
const Deva = require('@indra.ai/deva');
const fs = require('fs');
const path = require('path');
const { Octokit } = require("@octokit/rest");
const package = require('./package.json');
const info = {
  id: package.id,
  name: package.name,
  version: package.version,
  author: package.author,
  describe: package.description,
  dir: __dirname,
  url: package.homepage,
  git: package.repository.url,
  bugs: package.bugs.url,
  license: package.license,
  copyright: package.copyright
};

const data_path = path.join(__dirname, 'data.json');
const {agent,vars} = require(data_path).DATA;

const GITHUB = new Deva({
  info,
  agent: {
    id: agent.id,
    key: agent.key,
    prompt: agent.prompt,
    voice: agent.voice,
    profile: agent.profile,
    translate(input) {
      return input.trim();
    },
    parse(input) {
      return input.trim();
    },
    process(input) {
      return input.trim();
    },
  },
  vars,
  listeners: {},
  modules: {
    octokit: false,
  },
  devas: {},
  func: {
    issue(opts) {
      const {personal} = this.services();
      const repo = personal.repos[opts.agent.key];
      // const { data } = await this.modules.octokit.request("/user");
      return new Promise((resolve, reject) => {
        this.modules.octokit.issues.create({
          owner: personal.owner,
          assignee: personal.owner,
          repo,
          title: opts.text,
        }).then(issue => {
          return resolve({
            id: issue.data.id,
            node_id: issue.data.node_id,
            number: issue.data.number,
            api_url: issue.data.url,
            html_url: issue.data.html_url,
            title: issue.data.title,
            created: issue.data.created_at,
          });
        }).catch(reject);
      });
    },
  },
  methods: {
    /**************
    func: issue
    params: packet
    describe: create a github issue for a repo
    ***************/
    create_issue(packet) {
      this.context('issue');
      return new Promise((resolve, reject) => {
        const data = {};
        this.func.issue(packet.q).then(issue => {
          console.log('ISSUE DATA', issue);
          const text = [
            `## Issue`,
            `id: ${issue.id}`,
            `number: ${issue.number}`,
            `title: ${issue.title}`,
            `link: ${issue.html_url}`,
            `created: ${this.formatDate(issue.created, 'long', true)}`,
          ].join('\n');
          data.issue = issue;
          return this.question(`#feecting parse ${text}`);
        }).then(feecting => {
          data.feecting = feecting.a.data;
          return resolve({
            text: feecting.a.text,
            html: feecting.a.html,
            data,
          });
        }).catch(err => {
          return this.error(err, packet, reject);
        })
      });
    },
  },
  async onDone(config) {
    const security = this.security();
    this.modules.octokit = new Octokit({
      auth: security.personal.auth,
    });
    return Promise.resolve(config);
  }
});
module.exports = GITHUB
