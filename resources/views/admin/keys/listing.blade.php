@extends('layout')

@section('content')
    <div class="box">

        <div class="box-body" id="no_keys">
            <p>{{ Lang::get('keys.none') }}</p>
        </div>

        <div class="box-body table-responsive" id="key_list">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{ Lang::get('keys.name') }}</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>


@stop

@section('right-buttons')
    <div class="pull-right">
        <button type="button" class="btn btn-default" title="{{ Lang::get('keys.create') }}" data-toggle="modal" data-target="#key"><span class="fa fa-plus"></span> {{ Lang::get('keys.create') }}</button>
    </div>
@stop

@push('javascript')
    <script type="text/javascript">
        new app.KeysTab();
        app.Keys.add({!! $keys !!});
    </script>
@endpush

@push('templates')
    <script type="text/template" id="key-template">
        <td><%- name %></td>
        <td>
            <div class="btn-group pull-right">
                <a href="/admin/keys/<%- id %>" class="btn btn-default" title="{{ Lang::get('projects.view_ssh_key') }}"><i class="fa fa-key"></i></a>
                <button class="btn btn-default btn-edit" title="{{ Lang::get('app.edit') }}" data-toggle="modal" data-target="#key"><i class="fa fa-edit"></i></button>
            </div>
        </td>
    </script>
@endpush
