int r0 = 0;
int r1 = 0;
int r2 = 0;
int count = 0;

void setup() {
    pinMode(2, OUTPUT);
    pinMode(3, OUTPUT);
    pinMode(4, OUTPUT);
}

void loop() {
    for (count=0; count<=7; count++) {
        r0 = bitRead(count, 0);
        r1 = bitRead(count, 1);
        r2 = bitRead(count, 2);
        
        digitalWrite(2, r0);
        digitalWrite(3, r1);
        digitalWrite(4, r2);
        
        // other stuff
    }
}