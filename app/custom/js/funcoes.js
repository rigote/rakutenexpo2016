//Habilita ou desabilita busca palestrantes e agenda
$("#iconSearch").click(function(){
    $("ion-searchbar").toggle(300);
});

var tabsFunction = {
    createTabs: function (selector, tab) {
        if (typeof tab != 'undefined')
            $(selector).tabs(tab);
        else
            $(selector).tabs();
    }, 
    hide: function (selector) {
        $('div.tabContent[id!="' + selector + '"]').hide(0);
    }
};