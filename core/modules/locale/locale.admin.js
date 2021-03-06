/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  Drupal.behaviors.localeTranslateDirty = {
    attach() {
      const form = once('localetranslatedirty', '#locale-translate-edit-form');

      if (form.length) {
        const $form = $(form);
        $form.one('formUpdated.localeTranslateDirty', 'table', function () {
          const $marker = $(Drupal.theme('localeTranslateChangedWarning')).hide();
          $(this).addClass('changed').before($marker);
          $marker.fadeIn('slow');
        });
        $form.on('formUpdated.localeTranslateDirty', 'tr', function () {
          const $row = $(this);
          const rowToMark = once('localemark', $row);
          const marker = Drupal.theme('localeTranslateChangedMarker');
          $row.addClass('changed');

          if (rowToMark.length) {
            $(rowToMark).find('td:first-child .js-form-item').append(marker);
          }
        });
      }
    },

    detach(context, settings, trigger) {
      if (trigger === 'unload') {
        const form = once.remove('localetranslatedirty', '#locale-translate-edit-form');

        if (form.length) {
          $(form).off('formUpdated.localeTranslateDirty');
        }
      }
    }

  };
  Drupal.behaviors.hideUpdateInformation = {
    attach(context, settings) {
      const table = once('expand-updates', '#locale-translation-status-form');

      if (table.length) {
        const $table = $(table);
        const $tbodies = $table.find('tbody');
        $tbodies.on('click keydown', '.description', function (e) {
          if (e.keyCode && e.keyCode !== 13 && e.keyCode !== 32) {
            return;
          }

          e.preventDefault();
          const $tr = $(this).closest('tr');
          $tr.toggleClass('expanded');
          const $localePrefix = $tr.find('.locale-translation-update__prefix');

          if ($localePrefix.length) {
            $localePrefix[0].textContent = $tr.hasClass('expanded') ? Drupal.t('Hide description') : Drupal.t('Show description');
          }
        });
        $table.find('.requirements, .links').hide();
      }
    }

  };
  $.extend(Drupal.theme, {
    localeTranslateChangedMarker() {
      return `<abbr class="warning ajax-changed" title="${Drupal.t('Changed')}">*</abbr>`;
    },

    localeTranslateChangedWarning() {
      return `<div class="clearfix messages messages--warning">${Drupal.theme('localeTranslateChangedMarker')} ${Drupal.t('Changes made in this table will not be saved until the form is submitted.')}</div>`;
    }

  });
})(jQuery, Drupal);