var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	AUTH = this;

Backbone.$ = $;

exports.init = function(options) {
	AUTH.loginUrl = options.loginUrl || '';
	AUTH.logoutUrl = options.logoutUrl || '';
	AUTH.loggedUserUrl = options.loggedUserUrl || '';
	AUTH.loginShowMessageTimer = options.loginShowMessageTimer || 3000;
	AUTH.appSigla = options.appSigla || 'Sigla';
	AUTH.appDescricao = options.appDescricao || 'Descrição';
	AUTH.appBotao = options.appBotao || 'Confirmar';
	AUTH.callbackdoLoginOK = options.callbackdoLoginOK || '';
	AUTH.callbackdoLoginNOK = options.callbackdoLoginNOK || '';
};

exports.loginView = Backbone.View.extend({

	events: {
		'submit .login-block-form': 'doLogin'
	},

	initialize: function(options) {
		// Template default de loginView
		var loginTemplate = [
		'<div class="login-block">',
		'	<div class="panel panel-default">',
		'		<div class="panel-heading">&nbsp;</div>',
		'		<div class="panel-body">',
		'			<form class="login-block-form">',
		'				<div class="col-md-12 login-block-sigla text-center">' + AUTH.appSigla + '</div>',
		'				<div class="col-md-12 login-block-descricao">' + AUTH.appDescricao + '</div>',
		'				<div class="col-md-12">',
		'					<div class="alert alert-danger login-block-message hide"></div>',
		'				</div>',
		'				<div class="col-md-12">',
		'					<div class="form-group">',
		'						<input type="text" class="form-control input-sm login-block-username" placeholder="Usuário">',
		'					</div>',
		'				</div>',
		'				<div class="col-md-12">',
		'					<div class="form-group">',
		'						<input type="password" class="form-control input-sm login-block-password" placeholder="Senha">',
		'					</div>',
		'				</div>',
		'				<div class="col-md-12">',
		'					<button type="SUBMIT" class="btn btn-success btn-block pull-right login-block-confirm">' + AUTH.appBotao + '</button>',
		'				</div>',
		'			</form>',
		'		</div>',
		'	</div>',
		'</div>'].join('');

		this.template = options._template || loginTemplate;
		this.events = _.extend({}, this.events, options._events);

		this.render();
	},

	render: function() {
		this.$el.html(this.template);
	},

	login: function(username, password) {
		return $.ajax({
						method: 'POST',
						url: AUTH.loginUrl,
						async: false,
						cache: false,
						data: {
							login: username,
							senha: password
						}
		});
	},

	doLogin: function(ev) {
		ev.preventDefault();

		var loginBlockMessage = $('.login-block-message'),
			loginBlockConfirm = $('.login-block-confirm'),
			user = this.$('.login-block-username').val(),
			pass = this.$('.login-block-password').val(),
			timer = AUTH.loginShowMessageTimer;

		// Desabilita botao Confirmar para execucao do processo de login
		loginBlockConfirm.prop('disabled', true);

		// Procedimento de login
		var retJSON = this.login(user, pass).success(AUTH.callbackdoLoginOK).error(AUTH.callbackdoLoginNOK).responseJSON;

		if(!retJSON.status || !retJSON.data) {
			// Exibe mensagem de erro caso ocorra e reabilita botao Confirmar
			loginBlockMessage.html(retJSON.message).removeClass('hide').fadeIn().delay(timer).fadeOut(function() { loginBlockConfirm.prop('disabled', false); });
		} else {
			// Reabilita botao Confirmar
			loginBlockConfirm.prop('disabled', false);
		}
	}
});

exports.logout = function() {
	return $.ajax({
					method: 'POST',
					url: AUTH.logoutUrl,
					async: false,
					cache: false
	});
};

exports.isLogged = function() {
	return $.ajax({
					method: 'GET',
					url: AUTH.loggedUserUrl,
					async: false,
					cache: false
	});
};