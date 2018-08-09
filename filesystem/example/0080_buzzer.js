var BUZZER = require("buzzer");

kidbright.init();

const Note = [ 294, 330, 350, 393, 441, 495, 556, 587 ];

for( var l=0; l<8; l+=1 ) {
    kidbright.buzzer().tone( Note[l] );
    kidbright.buzzer().volume( 60 );
    kidbright.delay( 200 );
    kidbright.buzzer().volume( 0 );
}