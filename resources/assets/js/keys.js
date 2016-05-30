var app = app || {};

(function ($) {
    var SUCCESSFUL = 0;
    var UNTESTED   = 1;
    var FAILED     = 2;
    var TESTING    = 3;

    $('#key_list table').sortable({
        containerSelector: 'table',
        itemPath: '> tbody',
        itemSelector: 'tr',
        placeholder: '<tr class="placeholder"/>',
        delay: 500,
        onDrop: function (item, container, _super) {
            _super(item, container);

            var ids = [];
            $('tbody tr td:first-child', container.el[0]).each(function (idx, element) {
                ids.push($(element).data('key-id'));
            });

            $.ajax({
                url: '/keys/reorder',
                method: 'POST',
                data: {
                    keys: ids
                }
            });
        }
    });

    // FIXME: This seems very wrong
    $('#key').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var modal = $(this);
        var title = Lang.get('keys.create');

        $('.btn-danger', modal).hide();
        $('.callout-danger', modal).hide();
        $('.has-error', modal).removeClass('has-error');
        $('.label-danger', modal).remove();
        $('#add-key-command', modal).hide();

        if (button.hasClass('btn-edit')) {
            title = Lang.get('keys.edit');
            $('.btn-danger', modal).show();
        } else {
            $('#key_id').val('');
            $('#key_name').val('');
            $('#key_address').val('');
            $('#key_port').val('22');
            $('#key_user').val('');
            $('#key_path').val('');
            $('#key_deploy_code').prop('checked', true);
            $('#add-key-command', modal).show();
        }

        modal.find('.modal-title span').text(title);
    });

    // FIXME: This seems very wrong
    $('#key button.btn-delete').on('click', function (event) {
        var target = $(event.currentTarget);
        var icon = target.find('i');
        var dialog = target.parents('.modal');

        icon.addClass('fa-refresh fa-spin').removeClass('fa-trash');
        dialog.find('input').attr('disabled', 'disabled');
        $('button.close', dialog).hide();

        var key = app.Keys.get($('#key_id').val());

        key.destroy({
            wait: true,
            success: function(model, response, options) {
                dialog.modal('hide');
                $('.callout-danger', dialog).hide();

                icon.removeClass('fa-refresh fa-spin').addClass('fa-trash');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');
            },
            error: function() {
                icon.removeClass('fa-refresh fa-spin').addClass('fa-trash');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');
            }
        });
    });

    // FIXME: This seems very wrong
    $('#key button.btn-save').on('click', function (event) {
        var target = $(event.currentTarget);
        var icon = target.find('i');
        var dialog = target.parents('.modal');

        icon.addClass('fa-refresh fa-spin').removeClass('fa-save');
        dialog.find('input').attr('disabled', 'disabled');
        $('button.close', dialog).hide();

        var key_id = $('#key_id').val();

        if (key_id) {
            var key = app.Keys.get(key_id);
        } else {
            var key = new app.Key();
        }

        key.save({
            name:         $('#key_name').val(),
            ip_address:   $('#key_address').val(),
            port:         $('#key_port').val(),
            user:         $('#key_user').val(),
            path:         $('#key_path').val(),
            deploy_code:  $('#key_deploy_code').is(':checked'),
            project_id:   $('input[name="project_id"]').val(),
            add_commands: $('#key_commands').is(':checked')
        }, {
            wait: true,
            success: function(model, response, options) {
                dialog.modal('hide');
                $('.callout-danger', dialog).hide();

                icon.removeClass('fa-refresh fa-spin').addClass('fa-save');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');

                if (!key_id) {
                    app.Keys.add(response);
                }
            },
            error: function(model, response, options) {
                $('.callout-danger', dialog).show();

                var errors = response.responseJSON;

                $('.has-error', dialog).removeClass('has-error');
                $('.label-danger', dialog).remove();

                $('form input', dialog).each(function (index, element) {
                    element = $(element);

                    var name = element.attr('name');

                    if (typeof errors[name] !== 'undefined') {
                        var parent = element.parent('div');
                        parent.addClass('has-error');
                        parent.append($('<span>').attr('class', 'label label-danger').text(errors[name]));
                    }
                });

                icon.removeClass('fa-refresh fa-spin').addClass('fa-save');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');
            }
        });
    });


    app.Key = Backbone.Model.extend({
        urlRoot: '/keys'
    });

    var Keys = Backbone.Collection.extend({
        model: app.Key,
        comparator: function(keyA, keyB) {
            if (keyA.get('name') > keyB.get('name')) {
                return -1; // before
            } else if (keyA.get('name') < keyB.get('name')) {
                return 1; // after
            }

            return 0; // equal
        }
    });

    app.Keys = new Keys();

    app.KeysTab = Backbone.View.extend({
        el: '#app',
        events: {

        },
        initialize: function() {
            this.$list = $('#key_list tbody');

            $('#no_keys').show();
            $('#key_list').hide();

            this.listenTo(app.Keys, 'add', this.addOne);
            this.listenTo(app.Keys, 'reset', this.addAll);
            this.listenTo(app.Keys, 'remove', this.addAll);
            this.listenTo(app.Keys, 'all', this.render);

            app.listener.on('key:REBELinBLUE\\Deployer\\Events\\ModelChanged', function (data) {
                var key = app.Keys.get(parseInt(data.model.id));

                if (key) {
                    key.set(data.model);
                }
            });

            app.listener.on('key:REBELinBLUE\\Deployer\\Events\\ModelCreated', function (data) {
                if (parseInt(data.model.project_id) === parseInt(app.project_id)) {
                    app.Keys.add(data.model);
                }
            });

            app.listener.on('key:REBELinBLUE\\Deployer\\Events\\ModelTrashed', function (data) {
                var key = app.Keys.get(parseInt(data.model.id));

                if (key) {
                    app.Keys.remove(key);
                }
            });
        },
        render: function () {
            if (app.Keys.length) {
                $('#no_keys').hide();
                $('#key_list').show();
            } else {
                $('#no_keys').show();
                $('#key_list').hide();
            }
        },
        addOne: function (key) {

            var view = new app.KeyView({
                model: key
            });

            this.$list.append(view.render().el);
        },
        addAll: function () {
            this.$list.html('');
            app.Keys.each(this.addOne, this);
        }
    });

    app.KeyView = Backbone.View.extend({
        tagName:  'tr',
        events: {
            'click .btn-test': 'testConnection',
            'click .btn-edit': 'editKey'
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);

            this.template = _.template($('#key-template').html());
        },
        render: function () {
            var data = this.model.toJSON();

            data.status_css = 'primary';
            data.icon_css   = 'question';
            data.status     = Lang.get('keys.untested');

            if (parseInt(this.model.get('status')) === SUCCESSFUL) {
                data.status_css = 'success';
                data.icon_css   = 'check';
                data.status     = Lang.get('keys.successful');
            } else if (parseInt(this.model.get('status')) === TESTING) {
                data.status_css = 'warning';
                data.icon_css   = 'spinner fa-pulse';
                data.status     = Lang.get('keys.testing');
            } else if (parseInt(this.model.get('status')) === FAILED) {
                data.status_css = 'danger';
                data.icon_css   = 'warning';
                data.status     = Lang.get('keys.failed');
            }

            this.$el.html(this.template(data));

            return this;
        },
        editKey: function() {
            // FIXME: Sure this is wrong?
            $('#key_id').val(this.model.id);
            $('#key_name').val(this.model.get('name'));
            $('#key_address').val(this.model.get('ip_address'));
            $('#key_port').val(this.model.get('port'));
            $('#key_user').val(this.model.get('user'));
            $('#key_path').val(this.model.get('path'));

            $('#key_deploy_code').prop('checked', (this.model.get('deploy_code') === true));
        },
        testConnection: function() {
            if (parseInt(this.model.get('status')) === TESTING) {
                return;
            }

            this.model.set({
                status: TESTING
            });

            var that = this;
            $.ajax({
                type: 'GET',
                url: this.model.urlRoot + '/' + this.model.id + '/test'
            }).fail(function (response) {
                that.model.set({
                    status: FAILED
                });
            });

        }
    });
})(jQuery);
