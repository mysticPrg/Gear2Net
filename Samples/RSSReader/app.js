require.config({
	baseUrl: 'libs',
	paths: {
		app: '../app',
		G2N: 'Gear2Net/G2N',
	}
});

requirejs(['G2N', 'app/main']);