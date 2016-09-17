//Habilita ou desabilita busca palestrantes e agenda
$("#iconSearch").click(function(){
    $("ion-searchbar").toggle(300);
});

var tabsFunction = {
    createTabs: function (selector) {
        $(selector).tabs();
    }
};