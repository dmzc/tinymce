import { RealKeys } from '@ephox/agar';
import { before, context, describe, it } from '@ephox/bedrock-client';
import { TinyAssertions, TinyHooks, TinySelections } from '@ephox/mcagar';
import { PlatformDetection } from '@ephox/sand';

import Editor from 'tinymce/core/api/Editor';
import Theme from 'tinymce/themes/silver/Theme';

describe('webdriver.tinymce.core.keyboard.PageUpDownKeyTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    add_unload_trigger: false,
    base_url: '/project/tinymce/js/tinymce',
    indent: false
  }, [ Theme ], true);
  const platform = PlatformDetection.detect();
  const supportsPageUpDown = !(platform.os.isOSX() || platform.os.isWindows() && platform.browser.isFirefox());

  // It necessary to skip tests for Mac and windows Firefox they don't move the selection when pressing page up/down
  context('Page Up', () => {
    before(function () {
      if (!supportsPageUpDown) {
        this.skip();
      }
    });

    it('TINY-4612: caret should be placed at the start of the line', async () => {
      const editor = hook.editor();
      editor.setContent('<p><a href="google.com">link</a>text</p>');
      TinySelections.setCursor(editor, [ 0, 1 ], 2);
      await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.combo({}, 'PageUp') ]);

      TinyAssertions.assertCursor(editor, [ 0 ], 0);
    });

    it('TINY-4612: caret should be placed out of the line element', async () => {
      const editor = hook.editor();
      editor.setContent('<p><a href="google.com">link</a></p>');
      TinySelections.setCursor(editor, [ 0, 0, 0 ], 2);
      await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.combo({}, 'PageUp') ]);

      TinyAssertions.assertCursor(editor, [ 0 ], 0);
    });
  });

  context('Page Down', () => {
    before(function () {
      if (!supportsPageUpDown) {
        this.skip();
      }
    });

    it('TINY-4612: caret should be placed at the end of the line', async () => {
      const editor = hook.editor();
      editor.setContent('<p>text<a href="google.com">link</a></p>');
      TinySelections.setCursor(editor, [ 0, 0 ], 0);
      await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.combo({}, 'PageDown') ]);

      TinyAssertions.assertCursor(editor, [ 0 ], 2);
    });

    it('TINY-4612: caret should be placed out of the line element', async () => {
      const editor = hook.editor();
      editor.setContent('<p><a href="google.com">link</a></p>');
      TinySelections.setCursor(editor, [ 0, 0, 0 ], 2);
      await RealKeys.pSendKeysOn('iframe => body', [ RealKeys.combo({}, 'PageDown') ]);

      TinyAssertions.assertCursor(editor, [ 0 ], 1);
    });
  });
});
