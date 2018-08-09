var BUZZER = require("buzzer");

kidbright.init();


const Note = [ 294, 330, 350, 393, 441, 495, 556, 587 ];

var buzzer = new BUZZER(7,13);
for( var l=0; l<8; l+=1 ) {
    buzzer.tone( Note[l] );
    buzzer.volume( 90 );
    kidbright.delay( 200 );
    buzzer.volume( 0 );
}