var Stats = function () {

	var container = document.createElement( 'div' );
	container.id = 'stats';
	container.style.cssText = 'display:none'; // Configura para que o elemento não seja exibido

	return {

		REVISION: 12,

		domElement: container,

		begin: function () {
			// Início não faz nada
		},

		end: function () {
			// Fim não faz nada
		},

		update: function () {
			// Atualização não faz nada
		}

	}

};

if ( typeof module === 'object' ) {

	module.exports = Stats;

}