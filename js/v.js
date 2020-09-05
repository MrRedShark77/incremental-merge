var app;

function loadVue() {
	app = new Vue({
	    el: "#app",
	    data: {
            player,
            notate,
            changeTab,
            FORMULA,
            UPGRADE,
            TABS,
            ACHIEVEMENTS,
        }
	})
}