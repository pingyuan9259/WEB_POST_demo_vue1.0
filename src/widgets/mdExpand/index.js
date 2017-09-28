/* eslint-disable */
'use strict';

module.exports = function sample_plugin(md) {
  var i = 0; // 定义一个变量用于取匹配到的语义词
  function sample(state, startLine, endLine, silent) {
    var marker, len, params, nextLine, mem, token, markup, kind, semantics, semLen,
        haveEndMarker = false,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    if (pos + 3 > max) { return false; }

    marker = state.src.charCodeAt(pos);

    if (marker !== 0x3A/* : */) {
      return false;
    }
    // 审查标识符长度
    mem = pos;
    pos = state.skipChars(pos, marker);
    len = pos - mem;

    if (len < 3) { return false; }

    markup = state.src.slice(mem, pos);
    params = state.src.slice(pos, max);

    if (params.indexOf(':') >= 0) { return false; }

    // 若已定义过  直接报告成功
    if (silent) { return true; }

    // 查找块结尾
    nextLine = startLine;
    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }

      pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - :::
        //  test
        break;
      }

      if (state.src.charCodeAt(pos) !== marker) { continue; }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue;
      }

      pos = state.skipChars(pos, marker);

      // closing sample fence must be at least as long as the opening one
      if (pos - mem < len) { continue; }

      // make sure tail has spaces only
      pos = state.skipSpaces(pos);

      if (pos < max) { continue; }

      haveEndMarker = true;
      // found!
      break;
    }
    switch (params) {
      case '':
        kind = 'default';
        break;
      case 'success':
        kind = 'success';
        break;
      case 'info':
        kind = 'info';
        break;
      case 'warning':
        kind = 'warning';
        break;
      case 'danger':
        kind = 'danger';
        break;
      default:
        kind = 'default';
    }

    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];

    state.line = nextLine + (haveEndMarker ? 1 : 0);

    token         = state.push('sample', 'rem', 0);
    token.info    = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup  = markup;
    token.map     = [ startLine, state.line ];
    token.kind     = kind;
    i++;

    return true;
  };
  md.block.ruler.before('fence', 'sample', sample, { alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]})

  md.renderer.rules.sample = (tokens, idx, options, env, self) => {
    var token = tokens[idx]
    return '<pre class="' + token.kind + '"><' + token.tag + self.renderAttrs(token) + '>' + md.utils.escapeHtml(token.content) + '</' + token.tag + '></pre>\n'
  }
}
/* eslint-disable */