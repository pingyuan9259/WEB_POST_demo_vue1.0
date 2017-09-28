import Vue from 'vue'
import _ from 'lodash'

const win = window;
const doc = document;
const body = document.body;
const comboId = 'loaderJsCombo';

let scriptContent = '';

let getScript = async function (src) {
  return await Vue.resource(src).get({});
};

let insertScript = function (script, content) {
  script.appendChild(doc.createTextNode(content));
  body.appendChild(script);
};

let loadScript = async function (d, isContent) {
  let script = doc.createElement('script');
  script.type = 'text/javascript';
  script.id = comboId;

  if (isContent) {
    scriptContent += (';' + d);
    insertScript(script, scriptContent);
    return;
  }

  let responce = await getScript(d);
  scriptContent += (';' + responce.data);
};

export default {
  params: ['scripts', 'start', 'listener'],

  bind: async function () {
    let params = this.params;

    if (!params.scripts || !params.start) {
      throw 'need scripts & start params!';
      return;
    }

    let firstLoad = !!doc.getElementById(comboId),
      scripts = params.scripts.split(','),
      start = params.start;

    scriptContent = '';

    if (!firstLoad) {
      for (let i = 0, len = scripts.length; i < len; i++) {
        await loadScript(_.trim(scripts[i]));
      }
    } else {
      doc.getElementById(comboId).remove();
    }

    await loadScript(_.trim(start), true);
  },

  update: function (newValue) {},

  unbind: function () {}
}