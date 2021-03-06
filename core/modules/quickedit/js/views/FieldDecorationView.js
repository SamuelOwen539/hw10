/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Backbone, Drupal) {
  Drupal.quickedit.FieldDecorationView = Backbone.View.extend({
    _widthAttributeIsEmpty: null,
    events: {
      'mouseenter.quickedit': 'onMouseEnter',
      'mouseleave.quickedit': 'onMouseLeave',
      click: 'onClick',
      'tabIn.quickedit': 'onMouseEnter',
      'tabOut.quickedit': 'onMouseLeave'
    },

    initialize(options) {
      this.editorView = options.editorView;
      this.listenTo(this.model, 'change:state', this.stateChange);
      this.listenTo(this.model, 'change:isChanged change:inTempStore', this.renderChanged);
    },

    remove() {
      this.setElement();
      Backbone.View.prototype.remove.call(this);
    },

    stateChange(model, state) {
      const from = model.previous('state');
      const to = state;

      switch (to) {
        case 'inactive':
          this.undecorate();
          break;

        case 'candidate':
          this.decorate();

          if (from !== 'inactive') {
            this.stopHighlight();

            if (from !== 'highlighted') {
              this.model.set('isChanged', false);
              this.stopEdit();
            }
          }

          this._unpad();

          break;

        case 'highlighted':
          this.startHighlight();
          break;

        case 'activating':
          this.prepareEdit();
          break;

        case 'active':
          if (from !== 'activating') {
            this.prepareEdit();
          }

          if (this.editorView.getQuickEditUISettings().padding) {
            this._pad();
          }

          break;

        case 'changed':
          this.model.set('isChanged', true);
          break;

        case 'saving':
          break;

        case 'saved':
          break;

        case 'invalid':
          break;
      }
    },

    renderChanged() {
      this.$el.toggleClass('quickedit-changed', this.model.get('isChanged') || this.model.get('inTempStore'));
    },

    onMouseEnter(event) {
      const that = this;
      that.model.set('state', 'highlighted');
      event.stopPropagation();
    },

    onMouseLeave(event) {
      const that = this;
      that.model.set('state', 'candidate', {
        reason: 'mouseleave'
      });
      event.stopPropagation();
    },

    onClick(event) {
      this.model.set('state', 'activating');
      event.preventDefault();
      event.stopPropagation();
    },

    decorate() {
      this.$el.addClass('quickedit-candidate quickedit-editable');
    },

    undecorate() {
      this.$el.removeClass('quickedit-candidate quickedit-editable quickedit-highlighted quickedit-editing');
    },

    startHighlight() {
      const that = this;
      that.$el.addClass('quickedit-highlighted');
    },

    stopHighlight() {
      this.$el.removeClass('quickedit-highlighted');
    },

    prepareEdit() {
      this.$el.addClass('quickedit-editing');

      if (this.editorView.getQuickEditUISettings().popup) {
        this.$el.addClass('quickedit-editor-is-popup');
      }
    },

    stopEdit() {
      this.$el.removeClass('quickedit-highlighted quickedit-editing');

      if (this.editorView.getQuickEditUISettings().popup) {
        this.$el.removeClass('quickedit-editor-is-popup');
      }

      $('.quickedit-candidate').addClass('quickedit-editable');
    },

    _pad() {
      if (this.$el.data('quickedit-padded')) {
        return;
      }

      const self = this;

      if (this.$el[0].style.width === '') {
        this._widthAttributeIsEmpty = true;
        this.$el.addClass('quickedit-animate-disable-width').css('width', this.$el.width());
      }

      const posProp = this._getPositionProperties(this.$el);

      setTimeout(() => {
        self.$el.removeClass('quickedit-animate-disable-width');
        self.$el.css({
          position: 'relative',
          top: `${posProp.top - 5}px`,
          left: `${posProp.left - 5}px`,
          'padding-top': `${posProp['padding-top'] + 5}px`,
          'padding-left': `${posProp['padding-left'] + 5}px`,
          'padding-right': `${posProp['padding-right'] + 5}px`,
          'padding-bottom': `${posProp['padding-bottom'] + 5}px`,
          'margin-bottom': `${posProp['margin-bottom'] - 10}px`
        }).data('quickedit-padded', true);
      }, 0);
    },

    _unpad() {
      if (!this.$el.data('quickedit-padded')) {
        return;
      }

      const self = this;

      if (this._widthAttributeIsEmpty) {
        this.$el.addClass('quickedit-animate-disable-width').css('width', '');
      }

      const posProp = this._getPositionProperties(this.$el);

      setTimeout(() => {
        self.$el.removeClass('quickedit-animate-disable-width');
        self.$el.css({
          position: 'relative',
          top: `${posProp.top + 5}px`,
          left: `${posProp.left + 5}px`,
          'padding-top': `${posProp['padding-top'] - 5}px`,
          'padding-left': `${posProp['padding-left'] - 5}px`,
          'padding-right': `${posProp['padding-right'] - 5}px`,
          'padding-bottom': `${posProp['padding-bottom'] - 5}px`,
          'margin-bottom': `${posProp['margin-bottom'] + 10}px`
        });
      }, 0);
      this.$el.removeData('quickedit-padded');
    },

    _getPositionProperties($e) {
      let p;
      const r = {};
      const props = ['top', 'left', 'bottom', 'right', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom', 'margin-bottom'];
      const propCount = props.length;

      for (let i = 0; i < propCount; i++) {
        p = props[i];
        r[p] = parseInt(this._replaceBlankPosition($e.css(p)), 10);
      }

      return r;
    },

    _replaceBlankPosition(pos) {
      if (pos === 'auto' || !pos) {
        pos = '0px';
      }

      return pos;
    }

  });
})(jQuery, Backbone, Drupal);