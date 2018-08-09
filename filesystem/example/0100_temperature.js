kidbright.init();

setInterval( function() {
    var temperature = kidbright.temperature().read();
    console.log( temperature );
    log( "TEMP >>>>>>>>>>>>>>>>>>>>>>>>>>>> : " + temperature );
}, 10000);